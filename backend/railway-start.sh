#!/bin/bash
# Script de inicialização para Railway
# Executa migrações e inicia o servidor

echo "🚀 Iniciando backend Serena..."

# Executar migrações
echo "📦 Executando migrações..."
npm run migrate

# Iniciar servidor
echo "✅ Migrações concluídas. Iniciando servidor..."
npm start

