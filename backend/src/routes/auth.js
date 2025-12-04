const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../database/connection');

const router = express.Router();

// Validações
const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('role').optional().isIn(['psychologist', 'admin']).withMessage('Role inválida')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória')
];

// Registrar usuário - DESABILITADO: Apenas Super Admin pode criar usuários
router.post('/register', registerValidation, async (req, res) => {
  res.status(403).json({
    error: 'Registro público desabilitado. Apenas administradores podem criar contas. Entre em contato com o administrador do sistema.'
  });
});

// Login
router.post('/login', loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Buscar usuário
    const user = await db('users').where('email', email).first();
    if (!user) {
      return res.status(401).json({
        error: 'Credenciais inválidas'
      });
    }

    // Verificar se conta está ativa
    if (!user.isActive) {
      return res.status(401).json({
        error: 'Conta desativada'
      });
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Credenciais inválidas'
      });
    }

    // Gerar token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Retornar usuário (sem senha)
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Verificar token
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Token não fornecido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db('users')
      .select('id', 'name', 'email', 'role', 'isActive', 'createdAt')
      .where('id', decoded.userId)
      .first();

    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Token inválido'
      });
    }

    res.json({
      valid: true,
      user
    });

  } catch (error) {
    res.status(401).json({
      error: 'Token inválido'
    });
  }
});

module.exports = router;
