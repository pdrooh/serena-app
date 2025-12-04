const jwt = require('jsonwebtoken');
const db = require('../database/connection');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Token de acesso necessário'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar se o usuário ainda existe
    const user = await db('users').where('id', decoded.userId).first();

    if (!user) {
      return res.status(401).json({
        error: 'Usuário não encontrado'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: 'Conta desativada'
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token inválido'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado'
      });
    }

    console.error('Erro na autenticação:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Usuário não autenticado'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Acesso negado'
      });
    }

    next();
  };
};

// Helper para verificar se é super admin
const isSuperAdmin = (user) => {
  return user && user.role === 'super_admin';
};

// Helper para aplicar filtro de userId apenas se não for super admin
const applyUserFilter = (query, user, userIdColumn = 'userId') => {
  if (!isSuperAdmin(user)) {
    return query.where(userIdColumn, user.id);
  }
  return query; // Super admin vê tudo, não aplica filtro
};

module.exports = {
  authenticateToken,
  requireRole,
  isSuperAdmin,
  applyUserFilter
};
