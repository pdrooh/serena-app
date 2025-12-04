const errorHandler = (err, req, res, next) => {
  console.error('Erro capturado:', err);

  // Erro de validação
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: err.message
    });
  }

  // Erro de chave duplicada
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return res.status(409).json({
      error: 'Dados já existem',
      details: 'Um registro com essas informações já existe'
    });
  }

  // Erro de chave estrangeira
  if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
    return res.status(400).json({
      error: 'Referência inválida',
      details: 'O registro referenciado não existe'
    });
  }

  // Erro de sintaxe SQL
  if (err.code === 'SQLITE_ERROR') {
    return res.status(500).json({
      error: 'Erro no banco de dados',
      details: 'Erro interno do servidor'
    });
  }

  // Erro personalizado
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details || null
    });
  }

  // Erro padrão
  res.status(500).json({
    error: 'Erro interno do servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : null
  });
};

module.exports = errorHandler;
