const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../database/connection');
const { applyUserFilter } = require('../middleware/auth');

const router = express.Router();

// Validações
const sessionValidation = [
  body('patientId').isInt().withMessage('ID do paciente é obrigatório'),
  body('date').isISO8601().withMessage('Data inválida'),
  body('duration').isInt({ min: 15, max: 180 }).withMessage('Duração deve ser entre 15 e 180 minutos'),
  body('type').isIn(['presencial', 'online']).withMessage('Tipo deve ser presencial ou online'),
  body('mood').isInt({ min: 1, max: 10 }).withMessage('Humor deve ser entre 1 e 10')
];

// Listar sessões do usuário
router.get('/', async (req, res) => {
  try {
    const { patientId, startDate, endDate, type } = req.query;

    let query = db('sessions')
      .select('sessions.*', 'patients.name as patientName')
      .join('patients', 'sessions.patientId', 'patients.id');
    query = applyUserFilter(query, req.user, 'sessions.userId');

    if (patientId) {
      query = query.where('sessions.patientId', patientId);
    }

    if (startDate) {
      query = query.where('sessions.date', '>=', startDate);
    }

    if (endDate) {
      query = query.where('sessions.date', '<=', endDate);
    }

    if (type) {
      query = query.where('sessions.type', type);
    }

    const sessions = await query.orderBy('sessions.date', 'desc');

    res.json(sessions);
  } catch (error) {
    console.error('Erro ao listar sessões:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Buscar sessão por ID
router.get('/:id', async (req, res) => {
  try {
    let sessionQuery = db('sessions')
      .select('sessions.*', 'patients.name as patientName')
      .join('patients', 'sessions.patientId', 'patients.id')
      .where('sessions.id', req.params.id);
    sessionQuery = applyUserFilter(sessionQuery, req.user, 'sessions.userId');
    const session = await sessionQuery.first();

    if (!session) {
      return res.status(404).json({
        error: 'Sessão não encontrada'
      });
    }

    res.json(session);
  } catch (error) {
    console.error('Erro ao buscar sessão:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Criar sessão
router.post('/', sessionValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const {
      patientId,
      date,
      duration,
      type,
      notes,
      audioRecording,
      attachments,
      mood,
      objectives,
      techniques,
      nextSessionGoals
    } = req.body;

    // Verificar se paciente existe e pertence ao usuário
    const patient = await db('patients')
      .where('id', patientId)
      .andWhere('userId', req.user.id)
      .first();

    if (!patient) {
      return res.status(404).json({
        error: 'Paciente não encontrado'
      });
    }

    const [sessionId] = await db('sessions').insert({
      userId: req.user.id,
      patientId,
      date: new Date(date),
      duration,
      type,
      notes: notes || null,
      audioRecording: audioRecording || null,
      attachments: attachments ? JSON.stringify(attachments) : null,
      mood,
      objectives: objectives ? JSON.stringify(objectives) : null,
      techniques: techniques ? JSON.stringify(techniques) : null,
      nextSessionGoals: nextSessionGoals || null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const newSession = await db('sessions')
      .select('sessions.*', 'patients.name as patientName')
      .join('patients', 'sessions.patientId', 'patients.id')
      .where('sessions.id', sessionId)
      .first();

    res.status(201).json({
      message: 'Sessão criada com sucesso',
      session: newSession
    });

  } catch (error) {
    console.error('Erro ao criar sessão:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Atualizar sessão
router.put('/:id', sessionValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const sessionId = req.params.id;
    const {
      patientId,
      date,
      duration,
      type,
      notes,
      audioRecording,
      attachments,
      mood,
      objectives,
      techniques,
      nextSessionGoals
    } = req.body;

    // Verificar se sessão existe e pertence ao usuário
    const existingSession = await db('sessions')
      .where('id', sessionId)
      .andWhere('userId', req.user.id)
      .first();

    if (!existingSession) {
      return res.status(404).json({
        error: 'Sessão não encontrada'
      });
    }

    // Verificar se paciente existe e pertence ao usuário
    const patient = await db('patients')
      .where('id', patientId)
      .andWhere('userId', req.user.id)
      .first();

    if (!patient) {
      return res.status(404).json({
        error: 'Paciente não encontrado'
      });
    }

    await db('sessions')
      .where('id', sessionId)
      .update({
        patientId,
        date: new Date(date),
        duration,
        type,
        notes: notes || null,
        audioRecording: audioRecording || null,
        attachments: attachments ? JSON.stringify(attachments) : null,
        mood,
        objectives: objectives ? JSON.stringify(objectives) : null,
        techniques: techniques ? JSON.stringify(techniques) : null,
        nextSessionGoals: nextSessionGoals || null,
        updatedAt: new Date()
      });

    const updatedSession = await db('sessions')
      .select('sessions.*', 'patients.name as patientName')
      .join('patients', 'sessions.patientId', 'patients.id')
      .where('sessions.id', sessionId)
      .first();

    res.json({
      message: 'Sessão atualizada com sucesso',
      session: updatedSession
    });

  } catch (error) {
    console.error('Erro ao atualizar sessão:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Deletar sessão
router.delete('/:id', async (req, res) => {
  try {
    const sessionId = req.params.id;

    // Verificar se sessão existe e pertence ao usuário
    const session = await db('sessions')
      .where('id', sessionId)
      .andWhere('userId', req.user.id)
      .first();

    if (!session) {
      return res.status(404).json({
        error: 'Sessão não encontrada'
      });
    }

    await db('sessions').where('id', sessionId).del();

    res.json({
      message: 'Sessão deletada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar sessão:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
