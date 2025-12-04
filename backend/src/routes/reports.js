const express = require('express');
const db = require('../database/connection');
const { applyUserFilter } = require('../middleware/auth');

const router = express.Router();

// Relatório financeiro
router.get('/financial', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = db('payments');
    query = applyUserFilter(query, req.user, 'userId');

    if (startDate) {
      query = query.where('date', '>=', startDate);
    }

    if (endDate) {
      query = query.where('date', '<=', endDate);
    }

    const stats = await query
      .select(
        db.raw('COUNT(*) as totalPayments'),
        db.raw('SUM(CASE WHEN status = "pago" THEN amount ELSE 0 END) as totalRevenue'),
        db.raw('SUM(CASE WHEN status = "pendente" THEN amount ELSE 0 END) as pendingAmount'),
        db.raw('SUM(CASE WHEN status = "atrasado" THEN amount ELSE 0 END) as overdueAmount'),
        db.raw('AVG(CASE WHEN status = "pago" THEN amount END) as averagePayment'),
        db.raw('COUNT(CASE WHEN status = "pago" THEN 1 END) as paidCount'),
        db.raw('COUNT(CASE WHEN status = "pendente" THEN 1 END) as pendingCount'),
        db.raw('COUNT(CASE WHEN status = "atrasado" THEN 1 END) as overdueCount')
      )
      .first();

    // Receita por método de pagamento
    const revenueByMethod = await query
      .select('method')
      .sum('amount as total')
      .count('* as count')
      .where('status', 'pago')
      .groupBy('method');

    // Receita mensal (últimos 12 meses)
    const monthlyRevenue = await query
      .select(
        db.raw('strftime("%Y-%m", date) as month'),
        db.raw('SUM(CASE WHEN status = "pago" THEN amount ELSE 0 END) as revenue'),
        db.raw('COUNT(*) as payments')
      )
      .groupBy(db.raw('strftime("%Y-%m", date)'))
      .orderBy('month', 'desc')
      .limit(12);

    res.json({
      summary: stats,
      revenueByMethod,
      monthlyRevenue
    });

  } catch (error) {
    console.error('Erro ao gerar relatório financeiro:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Relatório de pacientes
router.get('/patients', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Estatísticas gerais
    let patientsQuery = db('patients');
    patientsQuery = applyUserFilter(patientsQuery, req.user, 'userId');
    const stats = await patientsQuery
      .select(
        db.raw('COUNT(*) as totalPatients'),
        db.raw('COUNT(CASE WHEN status = "ativo" THEN 1 END) as activePatients'),
        db.raw('COUNT(CASE WHEN status = "inativo" THEN 1 END) as inactivePatients'),
        db.raw('COUNT(CASE WHEN status = "suspenso" THEN 1 END) as suspendedPatients')
      )
      .first();

    // Pacientes com sessões
    let patientsWithSessionsQuery = db('patients')
      .join('sessions', 'patients.id', 'sessions.patientId');
    patientsWithSessionsQuery = applyUserFilter(patientsWithSessionsQuery, req.user, 'patients.userId');
    const patientsWithSessions = await patientsWithSessionsQuery
      .select('patients.id', 'patients.name')
      .count('sessions.id as sessionCount')
      .groupBy('patients.id', 'patients.name')
      .orderBy('sessionCount', 'desc');

    // Novos pacientes por mês
    let newPatientsQuery = db('patients');
    newPatientsQuery = applyUserFilter(newPatientsQuery, req.user, 'userId');

    if (startDate) {
      newPatientsQuery = newPatientsQuery.where('createdAt', '>=', startDate);
    }

    if (endDate) {
      newPatientsQuery = newPatientsQuery.where('createdAt', '<=', endDate);
    }

    const newPatientsByMonth = await newPatientsQuery
      .select(
        db.raw('strftime("%Y-%m", createdAt) as month'),
        db.raw('COUNT(*) as newPatients')
      )
      .groupBy(db.raw('strftime("%Y-%m", createdAt)'))
      .orderBy('month', 'desc')
      .limit(12);

    res.json({
      summary: stats,
      patientsWithSessions,
      newPatientsByMonth
    });

  } catch (error) {
    console.error('Erro ao gerar relatório de pacientes:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Relatório de sessões
router.get('/sessions', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = db('sessions')
      .join('patients', 'sessions.patientId', 'patients.id');
    query = applyUserFilter(query, req.user, 'sessions.userId');

    if (startDate) {
      query = query.where('sessions.date', '>=', startDate);
    }

    if (endDate) {
      query = query.where('sessions.date', '<=', endDate);
    }

    // Estatísticas gerais
    const stats = await query
      .select(
        db.raw('COUNT(*) as totalSessions'),
        db.raw('AVG(mood) as averageMood'),
        db.raw('AVG(duration) as averageDuration'),
        db.raw('COUNT(CASE WHEN type = "presencial" THEN 1 END) as presencialCount'),
        db.raw('COUNT(CASE WHEN type = "online" THEN 1 END) as onlineCount')
      )
      .first();

    // Sessões por paciente
    const sessionsByPatient = await query
      .select('patients.name as patientName')
      .count('sessions.id as sessionCount')
      .avg('sessions.mood as averageMood')
      .groupBy('patients.id', 'patients.name')
      .orderBy('sessionCount', 'desc');

    // Sessões por mês
    const sessionsByMonth = await query
      .select(
        db.raw('strftime("%Y-%m", sessions.date) as month'),
        db.raw('COUNT(*) as sessionCount'),
        db.raw('AVG(mood) as averageMood')
      )
      .groupBy(db.raw('strftime("%Y-%m", sessions.date)'))
      .orderBy('month', 'desc')
      .limit(12);

    res.json({
      summary: stats,
      sessionsByPatient,
      sessionsByMonth
    });

  } catch (error) {
    console.error('Erro ao gerar relatório de sessões:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Relatório de agendamentos
router.get('/appointments', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = db('appointments')
      .join('patients', 'appointments.patientId', 'patients.id');
    query = applyUserFilter(query, req.user, 'appointments.userId');

    if (startDate) {
      query = query.where('appointments.date', '>=', startDate);
    }

    if (endDate) {
      query = query.where('appointments.date', '<=', endDate);
    }

    // Estatísticas gerais
    const stats = await query
      .select(
        db.raw('COUNT(*) as totalAppointments'),
        db.raw('COUNT(CASE WHEN status = "agendado" THEN 1 END) as scheduledCount'),
        db.raw('COUNT(CASE WHEN status = "confirmado" THEN 1 END) as confirmedCount'),
        db.raw('COUNT(CASE WHEN status = "realizado" THEN 1 END) as completedCount'),
        db.raw('COUNT(CASE WHEN status = "cancelado" THEN 1 END) as cancelledCount'),
        db.raw('COUNT(CASE WHEN type = "presencial" THEN 1 END) as presencialCount'),
        db.raw('COUNT(CASE WHEN type = "online" THEN 1 END) as onlineCount')
      )
      .first();

    // Taxa de comparecimento
    const attendanceRate = await query
      .select(
        db.raw('COUNT(CASE WHEN status = "realizado" THEN 1 END) * 100.0 / COUNT(*) as attendanceRate')
      )
      .first();

    // Agendamentos por mês
    const appointmentsByMonth = await query
      .select(
        db.raw('strftime("%Y-%m", appointments.date) as month'),
        db.raw('COUNT(*) as appointmentCount'),
        db.raw('COUNT(CASE WHEN status = "realizado" THEN 1 END) as completedCount')
      )
      .groupBy(db.raw('strftime("%Y-%m", appointments.date)'))
      .orderBy('month', 'desc')
      .limit(12);

    res.json({
      summary: stats,
      attendanceRate: attendanceRate.attendanceRate || 0,
      appointmentsByMonth
    });

  } catch (error) {
    console.error('Erro ao gerar relatório de agendamentos:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Dashboard - resumo geral
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.user.id;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Estatísticas gerais
    let patientsCountQuery = db('patients');
    let sessionsCountQuery = db('sessions');
    let appointmentsCountQuery = db('appointments');
    let paymentsCountQuery = db('payments');

    patientsCountQuery = applyUserFilter(patientsCountQuery, req.user, 'userId');
    sessionsCountQuery = applyUserFilter(sessionsCountQuery, req.user, 'userId');
    appointmentsCountQuery = applyUserFilter(appointmentsCountQuery, req.user, 'userId');
    paymentsCountQuery = applyUserFilter(paymentsCountQuery, req.user, 'userId');

    const [
      patientsCount,
      sessionsCount,
      appointmentsCount,
      paymentsCount
    ] = await Promise.all([
      patientsCountQuery.count('* as count').first(),
      sessionsCountQuery.count('* as count').first(),
      appointmentsCountQuery.count('* as count').first(),
      paymentsCountQuery.count('* as count').first()
    ]);

    // Receita do mês atual
    let currentMonthRevenueQuery = db('payments');
    currentMonthRevenueQuery = applyUserFilter(currentMonthRevenueQuery, req.user, 'userId');
    const currentMonthRevenue = await currentMonthRevenueQuery
      .where('status', 'pago')
      .whereRaw('strftime("%Y-%m", date) = ?', [`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`])
      .sum('amount as total')
      .first();

    // Próximos agendamentos
    let upcomingAppointmentsQuery = db('appointments')
      .join('patients', 'appointments.patientId', 'patients.id');
    upcomingAppointmentsQuery = applyUserFilter(upcomingAppointmentsQuery, req.user, 'appointments.userId');
    const upcomingAppointments = await upcomingAppointmentsQuery
      .where('appointments.date', '>=', currentDate)
      .whereIn('appointments.status', ['agendado', 'confirmado'])
      .select('appointments.*', 'patients.name as patientName')
      .orderBy('appointments.date', 'asc')
      .limit(5);

    // Pagamentos pendentes
    let pendingPaymentsQuery = db('payments')
      .join('patients', 'payments.patientId', 'patients.id');
    pendingPaymentsQuery = applyUserFilter(pendingPaymentsQuery, req.user, 'payments.userId');
    const pendingPayments = await pendingPaymentsQuery
      .whereIn('payments.status', ['pendente', 'atrasado'])
      .select('payments.*', 'patients.name as patientName')
      .orderBy('payments.date', 'asc')
      .limit(5);

    res.json({
      summary: {
        totalPatients: patientsCount.count,
        totalSessions: sessionsCount.count,
        totalAppointments: appointmentsCount.count,
        totalPayments: paymentsCount.count,
        currentMonthRevenue: currentMonthRevenue.total || 0
      },
      upcomingAppointments,
      pendingPayments
    });

  } catch (error) {
    console.error('Erro ao gerar dashboard:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
