# 🚀 Deploy Rápido - Serena

## Passo a Passo Simplificado

### 1️⃣ Preparar Servidor (Ubuntu/Debian)

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2, Nginx, PostgreSQL
sudo npm install -g pm2
sudo apt install nginx postgresql -y

# Configurar PostgreSQL
sudo -u postgres psql
CREATE DATABASE serena_prod;
CREATE USER serena_user WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE serena_prod TO serena_user;
\q
```

### 2️⃣ Copiar Projeto para Servidor

```bash
# Criar diretório
sudo mkdir -p /var/www/serena
sudo chown -R $USER:$USER /var/www/serena

# Copiar todos os arquivos do projeto para /var/www/serena
# (ou fazer git clone)
```

### 3️⃣ Configurar Backend

```bash
cd /var/www/serena/backend

# Copiar e editar .env
cp env.production .env
nano .env
```

**Editar `.env` com:**
```env
NODE_ENV=production
PORT=5001
DB_CLIENT=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=serena_prod
DB_USER=serena_user
DB_PASSWORD=sua_senha
JWT_SECRET=$(openssl rand -base64 32)
CORS_ORIGIN=https://seu-dominio.com
```

```bash
# Instalar e migrar
npm install --production
NODE_ENV=production npm run migrate

# Criar super admin
node scripts/create-super-admin.js admin@serena.com senha_segura "Super Admin"
```

### 4️⃣ Build Frontend

```bash
cd /var/www/serena

# Criar .env.production
echo "REACT_APP_API_URL=https://seu-dominio.com/api" > .env.production

# Build
npm install
npm run build
```

### 5️⃣ Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/serena
```

**Colar:**
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        root /var/www/serena/build;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Ativar
sudo ln -s /etc/nginx/sites-available/serena /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6️⃣ Iniciar Backend com PM2

```bash
cd /var/www/serena
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 7️⃣ SSL (Opcional mas Recomendado)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

### 8️⃣ Atualizar CORS

```bash
# Editar backend/.env
nano /var/www/serena/backend/.env
# Garantir: CORS_ORIGIN=https://seu-dominio.com

# Reiniciar
pm2 restart serena-backend
```

## ✅ Verificar

```bash
# Backend
pm2 status
curl http://localhost:5001/api/health

# Frontend
curl http://localhost/

# Acessar no navegador
# https://seu-dominio.com
```

## 🔄 Deploy Futuro

```bash
cd /var/www/serena
./deploy.sh
```

## 📝 Checklist

- [ ] Servidor preparado
- [ ] PostgreSQL configurado
- [ ] Backend .env configurado
- [ ] Migrações executadas
- [ ] Super admin criado
- [ ] Frontend buildado
- [ ] Nginx configurado
- [ ] PM2 rodando
- [ ] SSL configurado (opcional)
- [ ] Testado no navegador

---

**Para mais detalhes, veja: `DEPLOY_PRODUCAO.md`**

