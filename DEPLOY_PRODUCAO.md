# 🚀 Guia Completo de Deploy em Produção - Serena

## 📋 Índice
1. [Pré-requisitos](#pré-requisitos)
2. [Preparação do Servidor](#preparação-do-servidor)
3. [Configuração do Backend](#configuração-do-backend)
4. [Build do Frontend](#build-do-frontend)
5. [Configuração do Nginx](#configuração-do-nginx)
6. [SSL/HTTPS](#sslhttps)
7. [PM2 e Processos](#pm2-e-processos)
8. [Scripts de Deploy](#scripts-de-deploy)
9. [Verificação e Testes](#verificação-e-testes)
10. [Troubleshooting](#troubleshooting)

---

## 📦 Pré-requisitos

### Software Necessário
- **Node.js** 18+
- **NPM** ou **Yarn**
- **PM2** (gerenciador de processos)
- **Nginx** (servidor web)
- **PostgreSQL** (banco de dados) ou **SQLite** (para testes)
- **Certbot** (para SSL)

### Servidor
- Ubuntu 20.04+ ou Debian 11+
- Mínimo 2GB RAM, 2 CPU cores
- 20GB+ espaço em disco

---

## 🖥️ Preparação do Servidor

### 1. Atualizar Sistema
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Instalar Node.js
```bash
# Instalar Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node --version
npm --version
```

### 3. Instalar PM2
```bash
sudo npm install -g pm2
pm2 startup
```

### 4. Instalar PostgreSQL (Recomendado) ou usar SQLite
```bash
# PostgreSQL
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Criar banco de dados
sudo -u postgres psql
CREATE DATABASE serena_prod;
CREATE USER serena_user WITH PASSWORD 'sua_senha_segura_aqui';
GRANT ALL PRIVILEGES ON DATABASE serena_prod TO serena_user;
\q
```

### 5. Instalar Nginx
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## 🔧 Configuração do Backend

### 1. Clonar/Copiar Projeto
```bash
# Criar diretório
sudo mkdir -p /var/www/serena
sudo chown -R $USER:$USER /var/www/serena

# Copiar arquivos do projeto para /var/www/serena
# (ou fazer git clone se estiver em repositório)
```

### 2. Configurar Variáveis de Ambiente
```bash
cd /var/www/serena/backend

# Copiar arquivo de exemplo
cp env.production .env

# Editar com suas configurações
nano .env
```

**Conteúdo do `.env` (ajustar valores):**
```env
NODE_ENV=production
PORT=5001

# Banco de Dados PostgreSQL
DB_CLIENT=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=serena_prod
DB_USER=serena_user
DB_PASSWORD=sua_senha_segura_aqui
DB_SSL=false

# JWT Secret (GERAR UMA CHAVE SEGURA!)
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

# CORS - IMPORTANTE: Colocar seu domínio
CORS_ORIGIN=https://seu-dominio.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
```

### 3. Instalar Dependências e Migrações
```bash
cd /var/www/serena/backend
npm install --production

# Executar migrações
NODE_ENV=production npm run migrate

# Criar usuário super admin
node scripts/create-super-admin.js admin@serena.com senha_segura "Super Admin"
```

### 4. Testar Backend
```bash
# Iniciar manualmente para testar
NODE_ENV=production npm start

# Deve responder em http://localhost:5001/api/health
# Parar com Ctrl+C
```

---

## 🎨 Build do Frontend

### 1. Configurar Variáveis de Ambiente
```bash
cd /var/www/serena

# Criar arquivo .env.production
cat > .env.production << EOF
REACT_APP_API_URL=https://seu-dominio.com/api
NODE_ENV=production
EOF
```

### 2. Instalar Dependências e Build
```bash
cd /var/www/serena
npm install
npm run build

# O build será criado em /var/www/serena/build
```

### 3. Verificar Build
```bash
ls -la build/
# Deve conter: index.html, static/, manifest.json, etc.
```

---

## 🌐 Configuração do Nginx

### 1. Criar Configuração do Site
```bash
sudo nano /etc/nginx/sites-available/serena
```

**Conteúdo:**
```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    # Redirecionar HTTP para HTTPS (após configurar SSL)
    # return 301 https://$server_name$request_uri;

    # Frontend - React App
    location / {
        root /var/www/serena/build;
        index index.html;
        try_files $uri $uri/ /index.html;

        # Cache de arquivos estáticos
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### 2. Ativar Site
```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/serena /etc/nginx/sites-enabled/

# Remover default se necessário
sudo rm /etc/nginx/sites-enabled/default

# Testar configuração
sudo nginx -t

# Recarregar Nginx
sudo systemctl reload nginx
```

---

## 🔒 SSL/HTTPS

### 1. Instalar Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 2. Obter Certificado SSL
```bash
# IMPORTANTE: Ajustar o arquivo Nginx ANTES para não redirecionar HTTP
# Depois executar:
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# Seguir as instruções interativas
# Certbot vai configurar automaticamente o HTTPS
```

### 3. Renovação Automática
```bash
# Testar renovação
sudo certbot renew --dry-run

# Certbot já cria um cron job automático
# Verificar: sudo systemctl status certbot.timer
```

### 4. Atualizar CORS no Backend
```bash
# Editar backend/.env
nano /var/www/serena/backend/.env

# Garantir que CORS_ORIGIN está correto:
CORS_ORIGIN=https://seu-dominio.com
```

---

## ⚙️ PM2 e Processos

### 1. Criar Arquivo de Configuração PM2
```bash
cd /var/www/serena
nano ecosystem.config.js
```

**Conteúdo:**
```javascript
module.exports = {
  apps: [{
    name: 'serena-backend',
    script: 'src/server.js',
    cwd: './backend',
    instances: 2, // ou 'max' para usar todos os CPUs
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    // Restart se usar mais de 1GB de memória
  }]
};
```

### 2. Iniciar com PM2
```bash
cd /var/www/serena

# Criar diretório de logs
mkdir -p backend/logs

# Iniciar aplicação
pm2 start ecosystem.config.js

# Salvar configuração para reiniciar após reboot
pm2 save

# Verificar status
pm2 status
pm2 logs serena-backend
```

### 3. Comandos Úteis PM2
```bash
# Ver status
pm2 status

# Ver logs
pm2 logs serena-backend

# Reiniciar
pm2 restart serena-backend

# Parar
pm2 stop serena-backend

# Monitoramento
pm2 monit
```

---

## 📜 Scripts de Deploy

### 1. Script de Deploy Completo
```bash
cd /var/www/serena
nano deploy.sh
```

**Conteúdo:**
```bash
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
pm2 restart serena-backend

# 5. Recarregar Nginx
echo -e "${YELLOW}🌐 Recarregando Nginx...${NC}"
sudo systemctl reload nginx

echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
```

### 2. Tornar Executável
```bash
chmod +x deploy.sh
```

### 3. Script de Backup
```bash
nano backup.sh
```

**Conteúdo:**
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/serena"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup do banco de dados
if [ "$DB_CLIENT" = "postgresql" ]; then
    pg_dump -h localhost -U serena_user -d serena_prod > $BACKUP_DIR/db_backup_$DATE.sql
else
    cp backend/database.sqlite $BACKUP_DIR/db_backup_$DATE.sqlite
fi

# Backup dos uploads (se houver)
if [ -d "backend/uploads" ]; then
    tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz backend/uploads/
fi

# Remover backups antigos (manter últimos 7 dias)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.sqlite" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup concluído: $BACKUP_DIR"
```

```bash
chmod +x backup.sh

# Adicionar ao crontab (backup diário às 2h da manhã)
crontab -e
# Adicionar: 0 2 * * * /var/www/serena/backup.sh
```

---

## ✅ Verificação e Testes

### 1. Verificar Backend
```bash
# Verificar se está rodando
pm2 status

# Testar API
curl http://localhost:5001/api/health

# Ver logs
pm2 logs serena-backend --lines 50
```

### 2. Verificar Frontend
```bash
# Testar se build está acessível
curl http://localhost/

# Verificar arquivos estáticos
ls -la /var/www/serena/build/static/
```

### 3. Verificar Nginx
```bash
# Testar configuração
sudo nginx -t

# Ver status
sudo systemctl status nginx

# Ver logs de erro
sudo tail -f /var/log/nginx/error.log
```

### 4. Testar no Navegador
1. Acessar: `https://seu-dominio.com`
2. Verificar console do navegador (F12) para erros
3. Testar login
4. Testar criação de paciente
5. Verificar se API está respondendo

---

## 🔍 Troubleshooting

### Backend não inicia
```bash
# Ver logs detalhados
pm2 logs serena-backend --err

# Verificar variáveis de ambiente
cd backend
cat .env

# Testar conexão com banco
# PostgreSQL:
psql -h localhost -U serena_user -d serena_prod
```

### Frontend não carrega
```bash
# Verificar build
ls -la build/

# Verificar permissões
sudo chown -R www-data:www-data /var/www/serena/build

# Ver logs do Nginx
sudo tail -f /var/log/nginx/error.log
```

### Erro 502 Bad Gateway
```bash
# Verificar se backend está rodando
pm2 status

# Verificar porta
netstat -tulpn | grep 5001

# Verificar logs do PM2
pm2 logs serena-backend
```

### Erro de CORS
```bash
# Verificar CORS_ORIGIN no backend/.env
cat backend/.env | grep CORS

# Deve ser: CORS_ORIGIN=https://seu-dominio.com
```

### Problemas de SSL
```bash
# Verificar certificado
sudo certbot certificates

# Renovar manualmente
sudo certbot renew

# Verificar configuração Nginx
sudo nginx -t
```

---

## 📊 Monitoramento

### 1. PM2 Monitoring
```bash
# Dashboard web (opcional)
pm2 web

# Acessar: http://localhost:9615
```

### 2. Logs
```bash
# Logs do backend
pm2 logs serena-backend

# Logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs do sistema
sudo journalctl -u nginx -f
```

### 3. Recursos do Sistema
```bash
# CPU e Memória
htop

# Espaço em disco
df -h

# Processos Node
pm2 monit
```

---

## 🎯 Checklist Final

- [ ] Node.js 18+ instalado
- [ ] PM2 instalado e configurado
- [ ] PostgreSQL instalado e banco criado
- [ ] Nginx instalado e configurado
- [ ] SSL/HTTPS configurado
- [ ] Backend `.env` configurado
- [ ] Frontend `.env.production` configurado
- [ ] Migrações executadas
- [ ] Usuário super admin criado
- [ ] Build do frontend criado
- [ ] PM2 rodando backend
- [ ] Nginx servindo frontend
- [ ] Testes realizados
- [ ] Backup configurado
- [ ] Monitoramento configurado

---

## 🚀 Deploy Rápido (Resumo)

```bash
# 1. Preparar servidor
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs nginx postgresql
sudo npm install -g pm2

# 2. Configurar projeto
cd /var/www/serena
cp backend/env.production backend/.env
# Editar backend/.env com suas configurações

# 3. Backend
cd backend
npm install --production
NODE_ENV=production npm run migrate
node scripts/create-super-admin.js admin@serena.com senha "Super Admin"
cd ..

# 4. Frontend
echo "REACT_APP_API_URL=https://seu-dominio.com/api" > .env.production
npm install
npm run build

# 5. PM2
pm2 start ecosystem.config.js
pm2 save

# 6. Nginx
# Criar /etc/nginx/sites-available/serena (ver acima)
sudo ln -s /etc/nginx/sites-available/serena /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 7. SSL
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

---

## 📞 Suporte

Em caso de problemas:
1. Verificar logs: `pm2 logs` e `/var/log/nginx/error.log`
2. Verificar status: `pm2 status` e `sudo systemctl status nginx`
3. Testar manualmente: `curl http://localhost:5001/api/health`

---

**🎉 Parabéns! Seu sistema Serena está em produção!**

