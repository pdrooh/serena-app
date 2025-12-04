# 🚀 Deploy Automatizado - Serena

## Opção 1: Railway (Mais Fácil - Recomendado) ⭐

Railway é a opção mais simples e rápida. Suporta frontend + backend + banco de dados.

### Passo a Passo:

1. **Acesse Railway:**
   - Vá em: https://railway.app
   - Faça login com GitHub

2. **Criar Novo Projeto:**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Conecte seu repositório (ou faça upload do código)

3. **Configurar Backend:**
   - Railway detectará automaticamente o backend
   - Adicione as variáveis de ambiente:
     ```
     NODE_ENV=production
     PORT=5001
     DB_CLIENT=postgresql
     JWT_SECRET=(Railway gerará automaticamente)
     CORS_ORIGIN=https://seu-app.railway.app
     ```

4. **Adicionar Banco de Dados:**
   - No projeto, clique em "New" > "Database" > "PostgreSQL"
   - Railway criará automaticamente
   - Copie as variáveis de conexão:
     ```
     DB_HOST=(do Railway)
     DB_PORT=5432
     DB_NAME=railway
     DB_USER=postgres
     DB_PASSWORD=(do Railway)
     ```

5. **Executar Migrações:**
   - No serviço do backend, vá em "Settings" > "Deploy"
   - Adicione no "Start Command":
     ```
     npm run migrate && npm start
     ```

6. **Deploy Frontend (Separado):**
   - Crie outro serviço no mesmo projeto
   - Configure:
     - Build Command: `npm install && npm run build`
     - Start Command: `npx serve -s build -l 3000`
   - Variáveis:
     ```
     REACT_APP_API_URL=https://seu-backend.railway.app/api
     ```

7. **Criar Super Admin:**
   - No backend, vá em "Settings" > "Deploy" > "Run Command"
   - Execute:
     ```
     node scripts/create-super-admin.js admin@serena.com senha123 "Super Admin"
     ```

8. **Acessar:**
   - Railway fornecerá URLs automáticas
   - Exemplo: `https://seu-app.railway.app`

---

## Opção 2: Render (Gratuito e Fácil)

### Backend:

1. **Acesse Render:**
   - https://render.com
   - Faça login com GitHub

2. **Criar Web Service:**
   - "New" > "Web Service"
   - Conecte seu repositório
   - Configurações:
     - **Name:** serena-backend
     - **Root Directory:** backend
     - **Environment:** Node
     - **Build Command:** `npm install && npm run migrate`
     - **Start Command:** `npm start`
     - **Plan:** Free

3. **Variáveis de Ambiente:**
   ```
   NODE_ENV=production
   PORT=5001
   DB_CLIENT=postgresql
   JWT_SECRET=(gere com: openssl rand -base64 32)
   CORS_ORIGIN=https://seu-frontend.onrender.com
   ```

4. **Adicionar PostgreSQL:**
   - "New" > "PostgreSQL"
   - Plan: Free
   - Copie as variáveis de conexão para o Web Service

### Frontend:

1. **Criar Static Site:**
   - "New" > "Static Site"
   - Conecte repositório
   - Configurações:
     - **Build Command:** `npm install && npm run build`
     - **Publish Directory:** `build`
   - Variáveis:
     ```
     REACT_APP_API_URL=https://seu-backend.onrender.com/api
     ```

---

## Opção 3: Vercel (Frontend) + Railway/Render (Backend)

### Frontend no Vercel:

1. **Acesse Vercel:**
   - https://vercel.com
   - Login com GitHub

2. **Importar Projeto:**
   - "Add New" > "Project"
   - Conecte repositório
   - Framework Preset: Create React App
   - Variáveis de Ambiente:
     ```
     REACT_APP_API_URL=https://seu-backend.railway.app/api
     ```

3. **Deploy:**
   - Vercel faz deploy automático
   - URL: `https://seu-app.vercel.app`

### Backend (Railway ou Render):
- Siga as instruções da Opção 1 ou 2 para backend

---

## Opção 4: Heroku (Tradicional)

### Backend:

1. **Instalar Heroku CLI:**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Criar App:**
   ```bash
   cd backend
   heroku create serena-backend
   ```

3. **Adicionar PostgreSQL:**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Variáveis de Ambiente:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=$(openssl rand -base64 32)
   heroku config:set CORS_ORIGIN=https://seu-frontend.herokuapp.com
   ```

5. **Deploy:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   heroku git:remote -a serena-backend
   git push heroku main
   ```

6. **Migrações:**
   ```bash
   heroku run npm run migrate
   heroku run node scripts/create-super-admin.js admin@serena.com senha123 "Super Admin"
   ```

### Frontend:

1. **Criar App:**
   ```bash
   cd ..
   heroku create serena-frontend --buildpack https://github.com/mars/create-react-app-buildpack.git
   ```

2. **Variáveis:**
   ```bash
   heroku config:set REACT_APP_API_URL=https://serena-backend.herokuapp.com/api
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

---

## 🎯 Recomendação: Railway (Opção 1)

**Por quê?**
- ✅ Mais fácil de configurar
- ✅ Suporta tudo (frontend + backend + banco)
- ✅ Deploy automático via GitHub
- ✅ Plano gratuito generoso
- ✅ SSL automático
- ✅ URLs personalizadas

---

## 📝 Checklist de Deploy

### Antes de Fazer Deploy:

- [ ] Código no GitHub (ou pronto para upload)
- [ ] Variáveis de ambiente preparadas
- [ ] JWT_SECRET gerado
- [ ] CORS_ORIGIN configurado
- [ ] REACT_APP_API_URL configurado

### Após Deploy:

- [ ] Backend respondendo em `/api/health`
- [ ] Frontend carregando
- [ ] Migrações executadas
- [ ] Super admin criado
- [ ] Testar login
- [ ] Testar criação de paciente
- [ ] Verificar console do navegador (sem erros)

---

## 🔧 Scripts Úteis

### Gerar JWT Secret:
```bash
openssl rand -base64 32
```

### Testar API:
```bash
curl https://seu-backend.railway.app/api/health
```

### Ver Logs (Railway):
- Vá no dashboard do Railway > seu serviço > Logs

### Ver Logs (Render):
- Dashboard > seu serviço > Logs

---

## 🆘 Troubleshooting

### Backend não inicia:
- Verificar logs na plataforma
- Verificar variáveis de ambiente
- Verificar se porta está correta (Railway usa PORT automático)

### Frontend não conecta ao backend:
- Verificar CORS_ORIGIN no backend
- Verificar REACT_APP_API_URL no frontend
- Verificar se backend está rodando

### Erro de banco de dados:
- Verificar variáveis de conexão
- Verificar se migrações foram executadas
- Verificar se banco foi criado

---

## 🚀 Deploy Rápido (Railway - 5 minutos)

1. Acesse: https://railway.app
2. Login com GitHub
3. "New Project" > "Deploy from GitHub"
4. Selecione repositório
5. Adicione PostgreSQL (New > Database)
6. Configure variáveis de ambiente
7. Deploy automático!

**Pronto!** 🎉

---

Para mais detalhes, veja os arquivos de configuração:
- `railway.json` - Configuração Railway
- `render.yaml` - Configuração Render
- `vercel.json` - Configuração Vercel
- `netlify.toml` - Configuração Netlify

