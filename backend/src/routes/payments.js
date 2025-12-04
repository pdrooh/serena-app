const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../database/connection');
const { applyUserFilter } = require('../middleware/auth');

const router = express.Router();

// Validações
const paymentValidation = [
  body('patientId').isInt().withMessage('ID do paciente é obrigatório'),
  body('amount').isDecimal({ decimal_digits: '0,2' }).withMessage('Valor deve ser um número decimal'),
  body('date').isISO8601().withMessage('Data inválida'),
  body('method').isIn(['pix', 'dinheiro', 'cartao', 'transferencia']).withMessage('Método de pagamento inválido'),
  body('status').optional().isIn(['pendente', 'pago', 'atrasado']).withMessage('Status inválido')
];

// Listar pagamentos do usuário
router.get('/', async (req, res) => {
  try {
    const { patientId, startDate, endDate, status, method } = req.query;

    let query = db('payments')
      .select('payments.*', 'patients.name as patientName')
      .join('patients', 'payments.patientId', 'patients.id');
    query = applyUserFilter(query, req.user, 'payments.userId');

    if (patientId) {
      query = query.where('payments.patientId', patientId);
    }

    if (startDate) {
      query = query.where('payments.date', '>=', startDate);
    }

    if (endDate) {
      query = query.where('payments.date', '<=', endDate);
    }

    if (status) {
      query = query.where('payments.status', status);
    }

    if (method) {
      query = query.where('payments.method', method);
    }

    const payments = await query.orderBy('payments.date', 'desc');

    res.json(payments);
  } catch (error) {
    console.error('Erro ao listar pagamentos:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Buscar pagamento por ID
router.get('/:id', async (req, res) => {
  try {
    let paymentQuery = db('payments')
      .select('payments.*', 'patients.name as patientName')
      .join('patients', 'payments.patientId', 'patients.id')
      .where('payments.id', req.params.id);
    paymentQuery = applyUserFilter(paymentQuery, req.user, 'payments.userId');
    const payment = await paymentQuery.first();

    if (!payment) {
      return res.status(404).json({
        error: 'Pagamento não encontrado'
      });
    }

    res.json(payment);
  } catch (error) {
    console.error('Erro ao buscar pagamento:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Criar pagamento
router.post('/', paymentValidation, async (req, res) => {
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
      sessionId,
      amount,
      date,
      method,
      status = 'pendente',
      receiptUrl,
      notes
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

    // Verificar se sessão existe e pertence ao usuário (se fornecida)
    if (sessionId) {
      const session = await db('sessions')
        .where('id', sessionId)
        .andWhere('userId', req.user.id)
        .first();

      if (!session) {
        return res.status(404).json({
          error: 'Sessão não encontrada'
        });
      }
    }

    const [paymentId] = await db('payments').insert({
      userId: req.user.id,
      patientId,
      sessionId: sessionId || null,
      amount: parseFloat(amount),
      date: new Date(date),
      method,
      status,
      receiptUrl: receiptUrl || null,
      notes: notes || null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const newPayment = await db('payments')
      .select('payments.*', 'patients.name as patientName')
      .join('patients', 'payments.patientId', 'patients.id')
      .where('payments.id', paymentId)
      .first();

    res.status(201).json({
      message: 'Pagamento criado com sucesso',
      payment: newPayment
    });

  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Atualizar pagamento
router.put('/:id', paymentValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }

    const paymentId = req.params.id;
    const {
      patientId,
      sessionId,
      amount,
      date,
      method,
      status,
      receiptUrl,
      notes
    } = req.body;

    // Verificar se pagamento existe e pertence ao usuário
    const existingPayment = await db('payments')
      .where('id', paymentId)
      .andWhere('userId', req.user.id)
      .first();

    if (!existingPayment) {
      return res.status(404).json({
        error: 'Pagamento não encontrado'
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

    // Verificar se sessão existe e pertence ao usuário (se fornecida)
    if (sessionId) {
      const session = await db('sessions')
        .where('id', sessionId)
        .andWhere('userId', req.user.id)
        .first();

      if (!session) {
        return res.status(404).json({
          error: 'Sessão não encontrada'
        });
      }
    }

    await db('payments')
      .where('id', paymentId)
      .update({
        patientId,
        sessionId: sessionId || null,
        amount: parseFloat(amount),
        date: new Date(date),
        method,
        status: status || existingPayment.status,
        receiptUrl: receiptUrl || null,
        notes: notes || null,
        updatedAt: new Date()
      });

    const updatedPayment = await db('payments')
      .select('payments.*', 'patients.name as patientName')
      .join('patients', 'payments.patientId', 'patients.id')
      .where('payments.id', paymentId)
      .first();

    res.json({
      message: 'Pagamento atualizado com sucesso',
      payment: updatedPayment
    });

  } catch (error) {
    console.error('Erro ao atualizar pagamento:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Deletar pagamento
router.delete('/:id', async (req, res) => {
  try {
    const paymentId = req.params.id;

    // Verificar se pagamento existe e pertence ao usuário
    const payment = await db('payments')
      .where('id', paymentId)
      .andWhere('userId', req.user.id)
      .first();

    if (!payment) {
      return res.status(404).json({
        error: 'Pagamento não encontrado'
      });
    }

    await db('payments').where('id', paymentId).del();

    res.json({
      message: 'Pagamento deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar pagamento:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Estatísticas de pagamentos
router.get('/stats/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = db('payments')
      .where('userId', req.user.id);

    if (startDate) {
      query = query.where('date', '>=', startDate);
    }

    if (endDate) {
      query = query.where('date', '<=', endDate);
    }

    const stats = await query
      .select(
        db.raw('COUNT(*) as total'),
        db.raw('SUM(CASE WHEN status = "pago" THEN amount ELSE 0 END) as totalPaid'),
        db.raw('SUM(CASE WHEN status = "pendente" THEN amount ELSE 0 END) as totalPending'),
        db.raw('SUM(CASE WHEN status = "atrasado" THEN amount ELSE 0 END) as totalOverdue'),
        db.raw('COUNT(CASE WHEN status = "pago" THEN 1 END) as paidCount'),
        db.raw('COUNT(CASE WHEN status = "pendente" THEN 1 END) as pendingCount'),
        db.raw('COUNT(CASE WHEN status = "atrasado" THEN 1 END) as overdueCount')
      )
      .first();

    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
