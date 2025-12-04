const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const db = require('../database/connection');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

// Validações
const updateProfileValidation = [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Email inválido')
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Senha atual é obrigatória'),
  body('newPassword').isLength({ min: 6 }).withMessage('Nova senha deve ter pelo menos 6 caracteres'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Confirmação de senha não confere');
    }
    return true;
  })
];

// Buscar perfil do usuário
router.get('/profile', async (req, res) => {
  try {
    const user = await db('users')
      .select('id', 'name', 'email', 'role', 'isActive', 'createdAt', 'updatedAt')
      .where('id', req.user.id)
      .first();

    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Atualizar perfil
router.put('/profile', updateProfileValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const { name, email } = req.body;
    const updateData = { updatedAt: new Date() };

    if (name) updateData.name = name;
    if (email) {
      // Verificar se email já existe para outro usuário
      const existingUser = await db('users')
        .where('email', email)
        .andWhere('id', '!=', req.user.id)
        .first();

      if (existingUser) {
        return res.status(409).json({
          error: 'Email já está em uso por outro usuário'
        });
      }

      updateData.email = email;
    }

    await db('users')
      .where('id', req.user.id)
      .update(updateData);

    const updatedUser = await db('users')
      .select('id', 'name', 'email', 'role', 'isActive', 'createdAt', 'updatedAt')
      .where('id', req.user.id)
      .first();

    res.json({
      message: 'Perfil atualizado com sucesso',
      user: updatedUser
    });

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Alterar senha
router.put('/change-password', changePasswordValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Buscar usuário com senha
    const user = await db('users')
      .where('id', req.user.id)
      .first();

    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    // Verificar senha atual
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Senha atual incorreta'
      });
    }

    // Hash da nova senha
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Atualizar senha
    await db('users')
      .where('id', req.user.id)
      .update({
        password: hashedPassword,
        updatedAt: new Date()
      });

    res.json({
      message: 'Senha alterada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Estatísticas do usuário
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id;

    const [
      patientsCount,
      sessionsCount,
      appointmentsCount,
      paymentsCount,
      totalRevenue
    ] = await Promise.all([
      db('patients').where('userId', userId).count('* as count').first(),
      db('sessions').where('userId', userId).count('* as count').first(),
      db('appointments').where('userId', userId).count('* as count').first(),
      db('payments').where('userId', userId).count('* as count').first(),
      db('payments').where('userId', userId).where('status', 'pago').sum('amount as total').first()
    ]);

    res.json({
      patients: patientsCount.count,
      sessions: sessionsCount.count,
      appointments: appointmentsCount.count,
      payments: paymentsCount.count,
      totalRevenue: totalRevenue.total || 0
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Deletar conta (soft delete)
router.delete('/account', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        error: 'Senha é obrigatória para deletar a conta'
      });
    }

    // Buscar usuário com senha
    const user = await db('users')
      .where('id', req.user.id)
      .first();

    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Senha incorreta'
      });
    }

    // Desativar conta (soft delete)
    await db('users')
      .where('id', req.user.id)
      .update({
        isActive: false,
        updatedAt: new Date()
      });

    res.json({
      message: 'Conta desativada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar conta:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// ============================================
// ROTAS DE SUPER ADMIN - GERENCIAMENTO DE USUÁRIOS
// ============================================

// Listar todos os usuários (apenas super_admin)
router.get('/all', requireRole(['super_admin']), async (req, res) => {
  try {
    const users = await db('users')
      .select('id', 'name', 'email', 'role', 'isActive', 'createdAt', 'updatedAt')
      .orderBy('createdAt', 'desc');

    res.json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Criar novo usuário (apenas super_admin)
const createUserValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('role').optional().isIn(['psychologist', 'admin', 'super_admin']).withMessage('Role inválido')
];

router.post('/create', requireRole(['super_admin']), createUserValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const { name, email, password, role = 'psychologist' } = req.body;

    // Verificar se email já existe
    const existingUser = await db('users').where('email', email).first();
    if (existingUser) {
      return res.status(409).json({
        error: 'Email já cadastrado'
      });
    }

    // Hash da senha
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criar usuário
    const [userId] = await db('users').insert({
      name,
      email,
      password: hashedPassword,
      role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Buscar usuário criado (sem senha)
    const newUser = await db('users')
      .select('id', 'name', 'email', 'role', 'isActive', 'createdAt', 'updatedAt')
      .where('id', userId)
      .first();

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: newUser
    });

  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Atualizar usuário (apenas super_admin)
const updateUserValidation = [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Email inválido'),
  body('role').optional().isIn(['psychologist', 'admin', 'super_admin']).withMessage('Role inválido'),
  body('isActive').optional().isBoolean().withMessage('isActive deve ser boolean')
];

router.put('/:userId', requireRole(['super_admin']), updateUserValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const { userId } = req.params;
    const { name, email, role, isActive } = req.body;

    // Verificar se usuário existe
    const user = await db('users').where('id', userId).first();
    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    // Não permitir desativar o próprio super_admin
    if (user.role === 'super_admin' && user.id === req.user.id && isActive === false) {
      return res.status(403).json({
        error: 'Não é possível desativar seu próprio usuário super_admin'
      });
    }

    const updateData = { updatedAt: new Date() };
    if (name) updateData.name = name;
    if (email) {
      // Verificar se email já existe para outro usuário
      const existingUser = await db('users')
        .where('email', email)
        .andWhere('id', '!=', userId)
        .first();

      if (existingUser) {
        return res.status(409).json({
          error: 'Email já está em uso por outro usuário'
        });
      }

      updateData.email = email;
    }
    if (role) updateData.role = role;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    await db('users')
      .where('id', userId)
      .update(updateData);

    const updatedUser = await db('users')
      .select('id', 'name', 'email', 'role', 'isActive', 'createdAt', 'updatedAt')
      .where('id', userId)
      .first();

    res.json({
      message: 'Usuário atualizado com sucesso',
      user: updatedUser
    });

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Trocar senha de usuário (apenas super_admin)
const changeUserPasswordValidation = [
  body('newPassword').isLength({ min: 6 }).withMessage('Nova senha deve ter pelo menos 6 caracteres')
];

router.put('/:userId/password', requireRole(['super_admin']), changeUserPasswordValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const { userId } = req.params;
    const { newPassword } = req.body;

    // Verificar se usuário existe
    const user = await db('users').where('id', userId).first();
    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    // Hash da nova senha
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Atualizar senha
    await db('users')
      .where('id', userId)
      .update({
        password: hashedPassword,
        updatedAt: new Date()
      });

    res.json({
      message: 'Senha alterada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao alterar senha do usuário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Deletar usuário (apenas super_admin)
router.delete('/:userId', requireRole(['super_admin']), async (req, res) => {
  try {
    const { userId } = req.params;

    // Verificar se usuário existe
    const user = await db('users').where('id', userId).first();
    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    // Não permitir deletar o próprio super_admin
    if (user.role === 'super_admin' && user.id === req.user.id) {
      return res.status(403).json({
        error: 'Não é possível deletar seu próprio usuário super_admin'
      });
    }

    // Soft delete - desativar usuário
    await db('users')
      .where('id', userId)
      .update({
        isActive: false,
        updatedAt: new Date()
      });

    res.json({
      message: 'Usuário desativado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Buscar dados de um usuário específico (apenas super_admin) - para inspeção
router.get('/:userId/inspect', requireRole(['super_admin']), async (req, res) => {
  try {
    const { userId } = req.params;

    // Buscar usuário
    const user = await db('users')
      .select('id', 'name', 'email', 'role', 'isActive', 'createdAt', 'updatedAt')
      .where('id', userId)
      .first();

    if (!user) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }

    // Buscar estatísticas do usuário
    const [
      patientsCount,
      sessionsCount,
      appointmentsCount,
      paymentsCount,
      totalRevenue
    ] = await Promise.all([
      db('patients').where('userId', userId).count('* as count').first(),
      db('sessions').where('userId', userId).count('* as count').first(),
      db('appointments').where('userId', userId).count('* as count').first(),
      db('payments').where('userId', userId).count('* as count').first(),
      db('payments').where('userId', userId).where('status', 'pago').sum('amount as total').first()
    ]);

    // Buscar últimos pacientes
    const recentPatients = await db('patients')
      .where('userId', userId)
      .orderBy('createdAt', 'desc')
      .limit(5)
      .select('id', 'name', 'email', 'phone', 'createdAt');

    // Buscar últimas sessões
    const recentSessions = await db('sessions')
      .where('userId', userId)
      .orderBy('date', 'desc')
      .limit(5)
      .select('id', 'patientId', 'date', 'duration', 'type');

    res.json({
      user,
      stats: {
        patients: patientsCount.count,
        sessions: sessionsCount.count,
        appointments: appointmentsCount.count,
        payments: paymentsCount.count,
        totalRevenue: totalRevenue.total || 0
      },
      recentPatients,
      recentSessions
    });

  } catch (error) {
    console.error('Erro ao inspecionar usuário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
