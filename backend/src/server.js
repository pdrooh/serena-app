const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const patientRoutes = require('./routes/patients');
const sessionRoutes = require('./routes/sessions');
const appointmentRoutes = require('./routes/appointments');
const paymentRoutes = require('./routes/payments');
const reportRoutes = require('./routes/reports');

const errorHandler = require('./middleware/errorHandler');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de segurança
app.use(helmet());
app.use(compression());

// Rate limiting - Configuração mais permissiva para desenvolvimento
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000, // limite de 1000 requests por IP (mais permissivo)
  message: {
    error: 'Muitas tentativas. Tente novamente em alguns minutos.'
  },
  // Pular rate limiting em desenvolvimento
  skip: (req) => process.env.NODE_ENV === 'development'
});
app.use(limiter);

// CORS
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : process.env.NODE_ENV === 'production'
    ? ['https://yourdomain.com']
    : ['http://localhost:3000', 'http://192.168.1.117:3000'];

app.use(cors({
  origin: corsOrigins,
  credentials: true
}));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rotas públicas
app.use('/api/auth', authRoutes);

// Rotas protegidas
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/patients', authenticateToken, patientRoutes);
app.use('/api/sessions', authenticateToken, sessionRoutes);
app.use('/api/appointments', authenticateToken, appointmentRoutes);
app.use('/api/payments', authenticateToken, paymentRoutes);
app.use('/api/reports', authenticateToken, reportRoutes);

// Middleware de tratamento de erros
app.use(errorHandler);

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
