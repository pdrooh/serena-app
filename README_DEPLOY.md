# 🚀 Deploy Rápido - Serena

## ⚡ Deploy em 5 Minutos (Railway)

### 1. Preparar Código
```bash
# Certifique-se de que todos os arquivos estão prontos
# Se usar Git, faça commit e push
```

### 2. Acessar Railway
- Vá em: **https://railway.app**
- Login com GitHub

### 3. Criar Projeto
- "+ New Project" > "Deploy from GitHub repo"
- Selecione seu repositório

### 4. Configurar Backend
- Railway detecta automaticamente
- Adicione variáveis:
  ```
  NODE_ENV=production
  PORT=5001
  DB_CLIENT=postgresql
  JWT_SECRET=(clique Generate)
  CORS_ORIGIN=https://seu-app.railway.app
  ```

### 5. Adicionar PostgreSQL
- "+ New" > "Database" > "PostgreSQL"
- Copie variáveis de conexão para o backend

### 6. Start Command
- Settings > Deploy > Start Command:
  ```
  cd backend && npm run start:migrate
  ```

### 7. Criar Super Admin
- Após deploy, Settings > Run Command:
  ```
  cd backend && node scripts/create-super-admin.js admin@serena.com senha123 "Super Admin"
  ```

### 8. Frontend
- "+ New" > "Service" > mesmo repositório
- Build: `npm install && npm run build`
- Start: `npx serve -s build -l 3000`
- Variável: `REACT_APP_API_URL=https://seu-backend.railway.app/api`

### 9. Pronto! 🎉
- Acesse a URL fornecida pelo Railway
- Login: admin@serena.com / senha123

---

## 📚 Documentação Completa

- **`COMO_DEPLOYAR.md`** - Guia passo a passo detalhado
- **`DEPLOY_AUTOMATICO.md`** - Múltiplas opções de plataformas
- **`DEPLOY_PRODUCAO.md`** - Deploy em servidor próprio
- **`DEPLOY_RAPIDO.md`** - Resumo rápido

---

## ✅ Checklist

- [ ] Código no GitHub
- [ ] Conta Railway criada
- [ ] Backend deployado
- [ ] Banco de dados conectado
- [ ] Migrações executadas
- [ ] Super admin criado
- [ ] Frontend deployado
- [ ] Variáveis configuradas
- [ ] Testado no navegador

---

**🎯 Recomendação: Use Railway - É a opção mais fácil e rápida!**

