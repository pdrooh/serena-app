const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../database/connection');
const { applyUserFilter } = require('../middleware/auth');

const router = express.Router();

// Validações
const appointmentValidation = [
  body('patientId').isInt().withMessage('ID do paciente é obrigatório'),
  body('date').isISO8601().withMessage('Data inválida'),
  body('duration').isInt({ min: 15, max: 180 }).withMessage('Duração deve ser entre 15 e 180 minutos'),
  body('type').isIn(['presencial', 'online']).withMessage('Tipo deve ser presencial ou online')
];

// Listar agendamentos do usuário
router.get('/', async (req, res) => {
  try {
    const { patientId, startDate, endDate, status, type } = req.query;

    let query = db('appointments')
      .select('appointments.*', 'patients.name as patientName')
      .join('patients', 'appointments.patientId', 'patients.id');
    query = applyUserFilter(query, req.user, 'appointments.userId');

    if (patientId) {
      query = query.where('appointments.patientId', patientId);
    }

    if (startDate) {
      query = query.where('appointments.date', '>=', startDate);
    }

    if (endDate) {
      query = query.where('appointments.date', '<=', endDate);
    }

    if (status) {
      query = query.where('appointments.status', status);
    }

    if (type) {
      query = query.where('appointments.type', type);
    }

    const appointments = await query.orderBy('appointments.date', 'asc');

    res.json(appointments);
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Buscar agendamento por ID
router.get('/:id', async (req, res) => {
  try {
    let appointmentQuery = db('appointments')
      .select('appointments.*', 'patients.name as patientName')
      .join('patients', 'appointments.patientId', 'patients.id')
      .where('appointments.id', req.params.id);
    appointmentQuery = applyUserFilter(appointmentQuery, req.user, 'appointments.userId');
    const appointment = await appointmentQuery.first();

    if (!appointment) {
      return res.status(404).json({
        error: 'Agendamento não encontrado'
      });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Erro ao buscar agendamento:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Criar agendamento
router.post('/', appointmentValidation, async (req, res) => {
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
      status = 'agendado',
      notes,
      reminderSent = false
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

    // Verificar conflito de horário
    const appointmentDate = new Date(date);
    const endTime = new Date(appointmentDate.getTime() + duration * 60000);

    const conflictingAppointment = await db('appointments')
      .where('userId', req.user.id)
      .where(function () {
        this.where('date', '<', endTime)
          .andWhere('date', '>', new Date(appointmentDate.getTime() - duration * 60000));
      })
      .where('status', '!=', 'cancelado')
      .first();

    if (conflictingAppointment) {
      return res.status(409).json({
        error: 'Conflito de horário',
        details: 'Já existe um agendamento neste horário'
      });
    }

    const [appointmentId] = await db('appointments').insert({
      userId: req.user.id,
      patientId,
      date: appointmentDate,
      duration,
      type,
      status,
      notes: notes || null,
      reminderSent,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const newAppointment = await db('appointments')
      .select('appointments.*', 'patients.name as patientName')
      .join('patients', 'appointments.patientId', 'patients.id')
      .where('appointments.id', appointmentId)
      .first();

    res.status(201).json({
      message: 'Agendamento criado com sucesso',
      appointment: newAppointment
    });

  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Atualizar agendamento
router.put('/:id', appointmentValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const appointmentId = req.params.id;
    const {
      patientId,
      date,
      duration,
      type,
      status,
      notes,
      reminderSent
    } = req.body;

    // Verificar se agendamento existe e pertence ao usuário (ou se for super admin)
    let appointmentQuery = db('appointments').where('id', appointmentId);
    appointmentQuery = applyUserFilter(appointmentQuery, req.user, 'appointments.userId');
    const existingAppointment = await appointmentQuery.first();

    if (!existingAppointment) {
      return res.status(404).json({
        error: 'Agendamento não encontrado'
      });
    }

    // Verificar se paciente existe e pertence ao usuário (ou se for super admin)
    let patientQuery = db('patients').where('id', patientId);
    patientQuery = applyUserFilter(patientQuery, req.user);
    const patient = await patientQuery.first();

    if (!patient) {
      return res.status(404).json({
        error: 'Paciente não encontrado'
      });
    }

    // Verificar conflito de horário (excluindo o próprio agendamento)
    const appointmentDate = new Date(date);
    const endTime = new Date(appointmentDate.getTime() + duration * 60000);

    let conflictQuery = db('appointments')
      .where('id', '!=', appointmentId)
      .where(function () {
        this.where('date', '<', endTime)
          .andWhere('date', '>', new Date(appointmentDate.getTime() - duration * 60000));
      })
      .where('status', '!=', 'cancelado');
    conflictQuery = applyUserFilter(conflictQuery, req.user, 'appointments.userId');
    const conflictingAppointment = await conflictQuery.first();

    if (conflictingAppointment) {
      return res.status(409).json({
        error: 'Conflito de horário',
        details: 'Já existe um agendamento neste horário'
      });
    }

    await db('appointments')
      .where('id', appointmentId)
      .update({
        patientId,
        date: appointmentDate,
        duration,
        type,
        status: status || existingAppointment.status,
        notes: notes || null,
        reminderSent: reminderSent !== undefined ? reminderSent : existingAppointment.reminderSent,
        updatedAt: new Date()
      });

    const updatedAppointment = await db('appointments')
      .select('appointments.*', 'patients.name as patientName')
      .join('patients', 'appointments.patientId', 'patients.id')
      .where('appointments.id', appointmentId)
      .first();

    res.json({
      message: 'Agendamento atualizado com sucesso',
      appointment: updatedAppointment
    });

  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Deletar agendamento
router.delete('/:id', async (req, res) => {
  try {
    const appointmentId = req.params.id;

    // Verificar se agendamento existe e pertence ao usuário
    const appointment = await db('appointments')
      .where('id', appointmentId)
      .andWhere('userId', req.user.id)
      .first();

    if (!appointment) {
      return res.status(404).json({
        error: 'Agendamento não encontrado'
      });
    }

    await db('appointments').where('id', appointmentId).del();

    res.json({
      message: 'Agendamento deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar agendamento:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
