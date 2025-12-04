#!/bin/bash
set -e

echo "🚀 Iniciando deploy do Serena..."

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Atualizar código (se usar Git)
# git pull origin main

# 2. Backend
echo -e "${YELLOW}📦 Atualizando backend...${NC}"
cd backend
npm install --production
NODE_ENV=production npm run migrate
cd ..

# 3. Frontend
echo -e "${YELLOW}🎨 Buildando frontend...${NC}"
npm install
npm run build

# 4. Reiniciar backend
echo -e "${YELLOW}🔄 Reiniciando backend...${NC}"
pm2 restart serena-backend || pm2 start ecosystem.config.js

# 5. Recarregar Nginx (se estiver instalado)
if command -v nginx &> /dev/null; then
    echo -e "${YELLOW}🌐 Recarregando Nginx...${NC}"
    sudo systemctl reload nginx
fi

echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"

