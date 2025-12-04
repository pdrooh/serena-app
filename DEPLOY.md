# 🚀 Guia de Deploy - Serena

## 📋 Pré-requisitos

### 1. Banco de Dados PostgreSQL
```bash
# Instalar PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Criar banco de dados
sudo -u postgres createdb serena_prod
sudo -u postgres createuser serena_user
sudo -u postgres psql -c "ALTER USER serena_user PASSWORD 'sua_senha_segura';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE serena_prod TO serena_user;"
```

### 2. Node.js e PM2
```bash
# Instalar Node.js (versão 18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2 globalmente
sudo npm install -g pm2
```

## 🔧 Configuração do Backend

### 1. Configurar Variáveis de Ambiente
```bash
# Copiar arquivo de exemplo
cp backend/env.production backend/.env

# Editar com suas configurações
nano backend/.env
```

### 2. Instalar Dependências e Executar Migrações
```bash
cd backend
npm install
npm run migrate
```

### 3. Configurar PM2
```bash
# Criar arquivo de configuração PM2
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'serena-backend',
    script: 'src/server.js',
    cwd: './backend',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Iniciar aplicação
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🎨 Configuração do Frontend

### 1. Build de Produção
```bash
# Instalar dependências
npm install

# Build de produção
npm run build
```

### 2. Servir Arquivos Estáticos
```bash
# Instalar serve globalmente
npm install -g serve

# Servir build de produção
serve -s build -l 3000
```

### 3. Configurar Nginx (Recomendado)
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    # Frontend
    location / {
        root /caminho/para/serena/build;
        index index.html;
        try_files $uri $uri/ /index.html;
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
    }
}
```

## 🔒 Configuração SSL (HTTPS)

### 1. Certbot (Let's Encrypt)
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado SSL
sudo certbot --nginx -d seu-dominio.com

# Renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoramento

### 1. PM2 Monitoring
```bash
# Ver status das aplicações
pm2 status

# Ver logs
pm2 logs

# Monitoramento em tempo real
pm2 monit
```

### 2. Backup do Banco de Dados
```bash
# Script de backup diário
cat > backup.sh << EOF
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U serena_user -d serena_prod > /backups/serena_backup_$DATE.sql
find /backups -name "serena_backup_*.sql" -mtime +7 -delete
EOF

chmod +x backup.sh

# Adicionar ao crontab
crontab -e
# Adicionar: 0 2 * * * /caminho/para/backup.sh
```

## 🚀 Deploy Automatizado

### 1. Script de Deploy
```bash
cat > deploy.sh << EOF
#!/bin/bash
set -e

echo "🚀 Iniciando deploy do Serena..."

# Pull latest code
git pull origin main

# Backend
cd backend
npm install
npm run migrate
pm2 restart serena-backend

# Frontend
cd ..
npm install
npm run build

# Restart nginx
sudo systemctl reload nginx

echo "✅ Deploy concluído com sucesso!"
EOF

chmod +x deploy.sh
```

## 🔧 Configurações de Produção

### 1. Otimizações de Performance
```javascript
// backend/src/server.js - Adicionar compressão
const compression = require('compression');
app.use(compression());

// Rate limiting mais restritivo
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});
app.use('/api/', limiter);
```

### 2. Logs Estruturados
```javascript
// Adicionar Winston para logs
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});
```

## 📱 PWA em Produção

### 1. Service Worker Otimizado
```javascript
// public/sw.js - Versão otimizada
const CACHE_NAME = 'serena-v1.0.0';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});
```

## 🔍 Troubleshooting

### Problemas Comuns:

1. **Erro de conexão com banco:**
   ```bash
   # Verificar se PostgreSQL está rodando
   sudo systemctl status postgresql

   # Verificar conexão
   psql -h localhost -U serena_user -d serena_prod
   ```

2. **Build falha:**
   ```bash
   # Limpar cache
   npm run build -- --no-cache

   # Verificar memória
   node --max-old-space-size=4096 node_modules/.bin/react-scripts build
   ```

3. **PM2 não inicia:**
   ```bash
   # Verificar logs
   pm2 logs serena-backend

   # Reiniciar
   pm2 restart serena-backend
   ```

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o deploy, consulte:
- Logs da aplicação: `pm2 logs`
- Logs do Nginx: `/var/log/nginx/error.log`
- Logs do PostgreSQL: `/var/log/postgresql/`

---

**🎉 Parabéns! Seu sistema Serena está pronto para produção!**



