# 🚀 Guia Completo de Deploy no Railway

## 📋 Checklist de Configuração

Use este guia passo a passo para configurar tudo no Railway.

---

## 1️⃣ Criar Serviços no Railway

### Serviço 1: PostgreSQL (Banco de Dados)

1. No Railway, clique em **"+ New"**
2. Selecione **"Database"**
3. Escolha **"Add PostgreSQL"**
4. Aguarde o PostgreSQL ser criado
5. **Anote o nome do serviço** (ex: "PostgreSQL" ou "postgres")

### Serviço 2: Backend (API)

1. No Railway, clique em **"+ New"**
2. Selecione **"GitHub Repo"**
3. Conecte seu repositório: `pdrooh/serena-app`
4. Quando perguntado sobre o tipo de serviço, escolha **"Empty Service"** ou **"Web Service"**
5. **Configure o Root Directory:**
   - Vá em **Settings** → **Deploy**
   - **Root Directory:** `backend`
   - **Build Command:** `npm install --production`
   - **Start Command:** `npm run start:migrate`

### Serviço 3: Frontend (Opcional - se quiser deployar o frontend também)

1. Crie outro serviço do mesmo repositório
2. **Root Directory:** (deixe vazio ou `/`)
3. **Build Command:** `npm install && npm run build`
4. **Start Command:** `npx serve -s build -l 3000`

---

## 2️⃣ Conectar PostgreSQL ao Backend

### Passo a Passo:

1. **Abra o serviço do BACKEND** (não o PostgreSQL)
2. Clique na aba **"Variables"** (ou **Settings** → **Variables**)
3. Clique em **"+ New Variable"**
4. Você verá uma opção **"Reference Variable"** ou **"Connect Database"**
5. **Selecione o serviço PostgreSQL** da lista
6. O Railway criará automaticamente:
   - ✅ `PGHOST`
   - ✅ `PGPORT`
   - ✅ `PGDATABASE`
   - ✅ `PGUSER`
   - ✅ `PGPASSWORD`

**Como saber se funcionou:**
- As variáveis aparecerão na lista com um ícone de "link" ou "referência"
- Elas mostrarão algo como: `PGHOST → postgres.PGHOST`

---

## 3️⃣ Configurar Variáveis do Backend

No serviço do **BACKEND**, adicione estas variáveis manualmente:

### Variáveis Obrigatórias:

| Variável | Valor | Como Obter |
|----------|-------|------------|
| `NODE_ENV` | `production` | Digite manualmente |
| `PORT` | `5001` | Digite manualmente |
| `DB_CLIENT` | `postgresql` | Digite manualmente |
| `JWT_SECRET` | (chave aleatória) | Clique em **"Generate"** no Railway |
| `CORS_ORIGIN` | URL do frontend | Use a URL do seu frontend (ex: `https://seu-frontend.railway.app`) |

### Variáveis Opcionais (mas recomendadas):

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `DB_SSL` | `true` | Necessário para PostgreSQL no Railway |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Limite de requisições (15 minutos) |
| `RATE_LIMIT_MAX_REQUESTS` | `1000` | Máximo de requisições por janela |

**Como adicionar:**
1. No serviço do backend → **Variables**
2. Clique em **"+ New Variable"**
3. Digite o **nome** da variável
4. Digite o **valor** da variável
5. Clique em **"Add"**
6. Repita para cada variável

---

## 4️⃣ Verificar Configuração

Após configurar tudo, o Railway fará um redeploy automático.

### Verificar Logs do Backend:

1. Abra o serviço do **BACKEND**
2. Vá na aba **"Deploy Logs"** ou **"HTTP Logs"**
3. Procure por estas mensagens:

**✅ Sucesso:**
```
🔍 Configuração do banco de dados:
   Host: [host do Railway]
   Port: 5432
   Database: [nome do banco]
   User: [usuário]
   Password: ***
✅ Conexão com banco de dados estabelecida
Server running on port 5001
```

**❌ Erro (se algo estiver faltando):**
```
🔍 Configuração do banco de dados:
   Host: NÃO DEFINIDO
   Database: NÃO DEFINIDO
❌ Variáveis de ambiente do banco de dados não configuradas corretamente!
```

---

## 5️⃣ Obter URLs dos Serviços

### Backend URL:

1. No serviço do **BACKEND**
2. Vá em **Settings** → **Networking**
3. Clique em **"Generate Domain"** (se ainda não tiver)
4. **Copie a URL** (ex: `https://backend-production-xxxx.up.railway.app`)
5. Use esta URL no `CORS_ORIGIN` do frontend (se aplicável)

### Frontend URL (se deployou):

1. No serviço do **FRONTEND**
2. Vá em **Settings** → **Networking**
3. Clique em **"Generate Domain"**
4. **Copie a URL** (ex: `https://frontend-production-xxxx.up.railway.app`)

---

## 6️⃣ Configurar Frontend (se deployou)

No serviço do **FRONTEND**, adicione:

| Variável | Valor |
|----------|-------|
| `REACT_APP_API_URL` | URL do backend (ex: `https://backend-production-xxxx.up.railway.app`) |

**Importante:** Variáveis do React precisam começar com `REACT_APP_`

---

## 7️⃣ Testar a Aplicação

### Testar Backend:

1. Acesse: `https://seu-backend.railway.app/api/health`
2. Deve retornar: `{"status":"ok"}`

### Testar Frontend:

1. Acesse a URL do frontend
2. Tente fazer login
3. Verifique se consegue acessar os dados

---

## 🆘 Troubleshooting

### Erro: "ECONNREFUSED ::1:5432"

**Causa:** PostgreSQL não está conectado ao backend

**Solução:**
1. Verifique se o PostgreSQL está conectado (Variables → deve ter PGHOST, etc.)
2. Se não estiver, conecte usando "Add Reference"
3. Verifique se `NODE_ENV=production` está configurado

### Erro: "Cannot find module 'cors'"

**Causa:** Dependências não foram instaladas

**Solução:**
1. Verifique se o Root Directory está configurado como `backend`
2. Verifique se o Build Command está como `npm install --production`

### Erro: "JWT_SECRET is not defined"

**Causa:** Variável JWT_SECRET não está configurada

**Solução:**
1. Adicione `JWT_SECRET` nas variáveis do backend
2. Use "Generate" no Railway para criar uma chave segura

---

## ✅ Checklist Final

Antes de considerar o deploy completo, verifique:

- [ ] PostgreSQL criado e rodando
- [ ] Backend criado com Root Directory = `backend`
- [ ] PostgreSQL conectado ao backend (variáveis PGHOST, etc. presentes)
- [ ] Variáveis obrigatórias configuradas (NODE_ENV, PORT, DB_CLIENT, JWT_SECRET, CORS_ORIGIN)
- [ ] Backend está rodando (logs mostram "Server running")
- [ ] Conexão com banco estabelecida (logs mostram "✅ Conexão com banco de dados estabelecida")
- [ ] Frontend configurado com REACT_APP_API_URL (se aplicável)
- [ ] Teste de health check funcionando (`/api/health`)

---

## 📞 Próximos Passos

Após tudo configurado:

1. **Criar usuário Super Admin:**
   - Use o script: `node backend/scripts/create-super-admin.js`
   - Ou crie manualmente via API

2. **Testar todas as funcionalidades:**
   - Login
   - Criar pacientes
   - Criar sessões
   - Criar agendamentos
   - Criar pagamentos

3. **Configurar domínio customizado (opcional):**
   - No Railway, Settings → Networking → Custom Domain

---

**Boa sorte com o deploy! 🚀**

