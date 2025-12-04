const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../database/connection');
const { applyUserFilter, isSuperAdmin } = require('../middleware/auth');

const router = express.Router();

// Validações
const patientValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('age').isInt({ min: 0, max: 120 }).withMessage('Idade deve ser entre 0 e 120'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('phone').matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/).withMessage('Telefone deve estar no formato (11) 99999-9999'),
  body('emergencyContact').trim().isLength({ min: 2 }).withMessage('Contato de emergência é obrigatório'),
  body('emergencyPhone').matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/).withMessage('Telefone de emergência deve estar no formato (11) 99999-9999')
];

// Listar pacientes do usuário (ou todos se for super admin)
router.get('/', async (req, res) => {
  try {
    let query = db('patients');
    query = applyUserFilter(query, req.user);
    const patients = await query.orderBy('createdAt', 'desc');

    res.json(patients);
  } catch (error) {
    console.error('Erro ao listar pacientes:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Buscar estatísticas de registros associados ao paciente (deve vir antes de /:id)
router.get('/:id/stats', async (req, res) => {
  try {
    const patientId = req.params.id;

    // Verificar se paciente existe e pertence ao usuário (ou se for super admin)
    let patientQuery = db('patients').where('id', patientId);
    patientQuery = applyUserFilter(patientQuery, req.user);
    const patient = await patientQuery.first();

    if (!patient) {
      return res.status(404).json({
        error: 'Paciente não encontrado'
      });
    }

    // Contar registros associados
    const sessionResult = await db('sessions').where('patientId', patientId).count('* as count').first();
    const appointmentResult = await db('appointments').where('patientId', patientId).count('* as count').first();
    const paymentResult = await db('payments').where('patientId', patientId).count('* as count').first();

    // SQLite retorna count como string ou número, dependendo da versão
    const sessionCount = parseInt(sessionResult?.count || sessionResult?.['count(*)'] || 0);
    const appointmentCount = parseInt(appointmentResult?.count || appointmentResult?.['count(*)'] || 0);
    const paymentCount = parseInt(paymentResult?.count || paymentResult?.['count(*)'] || 0);

    res.json({
      sessions: sessionCount,
      appointments: appointmentCount,
      payments: paymentCount,
      total: sessionCount + appointmentCount + paymentCount
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas do paciente:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Buscar paciente por ID
router.get('/:id', async (req, res) => {
  try {
    let query = db('patients').where('id', req.params.id);
    query = applyUserFilter(query, req.user);
    const patient = await query.first();

    if (!patient) {
      return res.status(404).json({
        error: 'Paciente não encontrado'
      });
    }

    res.json(patient);
  } catch (error) {
    console.error('Erro ao buscar paciente:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Criar paciente
router.post('/', patientValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const {
      name,
      age,
      email,
      phone,
      address,
      emergencyContact,
      emergencyPhone,
      healthHistory,
      initialObservations
    } = req.body;

    // Verificar se email já existe para este usuário (ou todos se for super admin)
    let emailQuery = db('patients').where('email', email);
    emailQuery = applyUserFilter(emailQuery, req.user);
    const existingPatient = await emailQuery.first();

    if (existingPatient) {
      return res.status(409).json({
        error: 'Já existe um paciente com este email'
      });
    }

    const [patientId] = await db('patients').insert({
      userId: req.user.id,
      name,
      age,
      email,
      phone,
      address: address || null,
      emergencyContact,
      emergencyPhone,
      healthHistory: healthHistory || null,
      initialObservations: initialObservations || null,
      status: 'ativo',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const newPatient = await db('patients')
      .where('id', patientId)
      .first();

    res.status(201).json({
      message: 'Paciente criado com sucesso',
      patient: newPatient
    });

  } catch (error) {
    console.error('Erro ao criar paciente:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Atualizar paciente
router.put('/:id', patientValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const patientId = req.params.id;
    const {
      name,
      age,
      email,
      phone,
      address,
      emergencyContact,
      emergencyPhone,
      healthHistory,
      initialObservations,
      status
    } = req.body;

    // Verificar se paciente existe e pertence ao usuário (ou se for super admin)
    let patientQuery = db('patients').where('id', patientId);
    patientQuery = applyUserFilter(patientQuery, req.user);
    const existingPatient = await patientQuery.first();

    if (!existingPatient) {
      return res.status(404).json({
        error: 'Paciente não encontrado'
      });
    }

    // Verificar se email já existe para outro paciente
    if (email !== existingPatient.email) {
      let emailQuery = db('patients')
        .where('email', email)
        .andWhere('id', '!=', patientId);
      emailQuery = applyUserFilter(emailQuery, req.user);
      const emailExists = await emailQuery.first();

      if (emailExists) {
        return res.status(409).json({
          error: 'Já existe um paciente com este email'
        });
      }
    }

    await db('patients')
      .where('id', patientId)
      .update({
        name,
        age,
        email,
        phone,
        address: address || null,
        emergencyContact,
        emergencyPhone,
        healthHistory: healthHistory || null,
        initialObservations: initialObservations || null,
        status: status || existingPatient.status,
        updatedAt: new Date()
      });

    const updatedPatient = await db('patients')
      .where('id', patientId)
      .first();

    res.json({
      message: 'Paciente atualizado com sucesso',
      patient: updatedPatient
    });

  } catch (error) {
    console.error('Erro ao atualizar paciente:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Deletar paciente
router.delete('/:id', async (req, res) => {
  try {
    const patientId = req.params.id;

    // Verificar se paciente existe e pertence ao usuário (ou se for super admin)
    let patientQuery = db('patients').where('id', patientId);
    patientQuery = applyUserFilter(patientQuery, req.user);
    const patient = await patientQuery.first();

    if (!patient) {
      return res.status(404).json({
        error: 'Paciente não encontrado'
      });
    }

    // Verificar quantos registros associados existem (para informação)
    const sessionResult = await db('sessions').where('patientId', patientId).count('* as count').first();
    const appointmentResult = await db('appointments').where('patientId', patientId).count('* as count').first();
    const paymentResult = await db('payments').where('patientId', patientId).count('* as count').first();

    // SQLite retorna count como string ou número, dependendo da versão
    const sessionCount = parseInt(sessionResult?.count || sessionResult?.['count(*)'] || 0);
    const appointmentCount = parseInt(appointmentResult?.count || appointmentResult?.['count(*)'] || 0);
    const paymentCount = parseInt(paymentResult?.count || paymentResult?.['count(*)'] || 0);

    // Deletar em cascata: primeiro os registros associados, depois o paciente
    // Isso garante integridade referencial
    if (sessionCount > 0) {
      await db('sessions').where('patientId', patientId).del();
    }
    if (appointmentCount > 0) {
      await db('appointments').where('patientId', patientId).del();
    }
    if (paymentCount > 0) {
      await db('payments').where('patientId', patientId).del();
    }

    // Agora deletar o paciente
    await db('patients').where('id', patientId).del();

    // Preparar mensagem informativa
    const deletedItems = [];
    if (sessionCount > 0) deletedItems.push(`${sessionCount} sessão(ões)`);
    if (appointmentCount > 0) deletedItems.push(`${appointmentCount} agendamento(s)`);
    if (paymentCount > 0) deletedItems.push(`${paymentCount} pagamento(s)`);

    const message = deletedItems.length > 0
      ? `Paciente e ${deletedItems.join(', ')} associados foram deletados com sucesso`
      : 'Paciente deletado com sucesso';

    res.json({
      message,
      deletedRecords: {
        sessions: sessionCount,
        appointments: appointmentCount,
        payments: paymentCount
      }
    });

  } catch (error) {
    console.error('Erro ao deletar paciente:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Buscar pacientes por nome ou email
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query.toLowerCase();

    let searchQuery = db('patients').where(function () {
      this.where('name', 'like', `%${query}%`)
        .orWhere('email', 'like', `%${query}%`);
    });
    searchQuery = applyUserFilter(searchQuery, req.user);
    const patients = await searchQuery.orderBy('name', 'asc');

    res.json(patients);
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
