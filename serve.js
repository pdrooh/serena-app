const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir arquivos estáticos do build
app.use(express.static(path.join(__dirname, 'build')));

// Rota para todas as páginas (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📱 Acesse localmente: http://localhost:${PORT}`);
  console.log(`🌐 Acesse na rede: http://192.168.1.117:${PORT}`);
  console.log(`📊 Pronto para compartilhamento!`);
});



