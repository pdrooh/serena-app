# 🚂 Configuração Railway - Passo a Passo

## ✅ Você já tem:
- ✅ Repositório no GitHub: `pdrooh/serena-app`
- ✅ Conta Railway conectada

## 🚀 Agora vamos configurar no Railway:

### Passo 1: Fazer Push do Código (se ainda não fez)

```bash
cd /Users/pdrooh/Documents/psicologia

# Se ainda não fez push, use HTTPS:
git remote set-url origin https://github.com/pdrooh/serena-app.git
git push -u origin main
```

Ou faça push manualmente pelo GitHub Desktop ou interface web do GitHub.

---

### Passo 2: Criar Projeto no Railway

1. **Acesse Railway:**
   - Vá em: https://railway.app
   - Faça login (já está conectado)

2. **Criar Novo Projeto:**
   - Clique no botão **"+ New Project"** (canto superior direito)
   - Selecione **"Deploy from GitHub repo"**
   - Escolha o repositório: **`pdrooh/serena-app`**
   - Railway começará a detectar automaticamente

---

### Passo 3: Configurar Backend

1. **Railway detectará o backend automaticamente**
   - Pode criar um serviço automaticamente
   - Se não criar, clique em **"+ New"** > **"GitHub Repo"** > selecione o repo

2. **Configurar o Serviço do Backend:**
   - Clique no serviço criado
   - Vá em **"Settings"** (ícone de engrenagem)
   - Em **"Root Directory"**, coloque: `backend`
   - Em **"Start Command"**, coloque:
     ```
     npm run start:migrate
     ```

3. **Adicionar Variáveis de Ambiente:**
   - No serviço do backend, vá em **"Variables"** (aba)
   - Clique em **"+ New Variable"**
   - Adicione uma por uma:

   ```
   NODE_ENV = production
   PORT = 5001
   DB_CLIENT = postgresql
   JWT_SECRET = (clique em "Generate" para gerar automaticamente)
   ```

   **⚠️ IMPORTANTE:** Ainda não adicione `CORS_ORIGIN` - vamos fazer isso depois que tiver a URL do frontend.

---

### Passo 4: Adicionar Banco de Dados PostgreSQL

1. **No mesmo projeto Railway:**
   - Clique em **"+ New"** (canto superior direito)
   - Selecione **"Database"**
   - Escolha **"PostgreSQL"**
   - Railway criará automaticamente

2. **Conectar Backend ao Banco:**
   - Clique no serviço do **banco de dados PostgreSQL**
   - Vá em **"Variables"** (aba)
   - Você verá variáveis como:
     - `PGHOST`
     - `PGPORT`
     - `PGDATABASE`
     - `PGUSER`
     - `PGPASSWORD`

3. **Adicionar essas variáveis no Backend:**
   - Volte para o serviço do **backend**
   - Vá em **"Variables"**
   - Clique em **"+ New Variable"**
   - Adicione cada uma (copie os valores do banco):

   ```
   DB_HOST = (valor de PGHOST)
   DB_PORT = (valor de PGPORT)
   DB_NAME = (valor de PGDATABASE)
   DB_USER = (valor de PGUSER)
   DB_PASSWORD = (valor de PGPASSWORD)
   ```

---

### Passo 5: Deploy do Backend

1. **Railway fará deploy automaticamente**
   - Aguarde alguns minutos
   - Veja os logs em tempo real clicando no serviço

2. **Verificar se funcionou:**
   - No serviço do backend, vá em **"Settings"**
   - Em **"Domains"**, você verá uma URL como: `https://seu-backend.railway.app`
   - **ANOTE ESSA URL!** Você precisará dela.

3. **Testar Backend:**
   - Abra a URL em um navegador
   - Adicione `/api/health` no final
   - Exemplo: `https://seu-backend.railway.app/api/health`
   - Deve retornar: `{"status":"OK"}`

---

### Passo 6: Criar Super Admin

1. **No serviço do backend:**
   - Vá em **"Settings"** > **"Deploy"**
   - Role até **"Run Command"**
   - Execute:
     ```
     node scripts/create-super-admin.js admin@serena.com senha123 "Super Admin"
     ```
   - **⚠️ ANOTE:** Email: `admin@serena.com` / Senha: `senha123`

---

### Passo 7: Configurar Frontend

1. **Criar Novo Serviço para Frontend:**
   - No mesmo projeto Railway
   - Clique em **"+ New"** > **"GitHub Repo"**
   - Selecione o mesmo repositório: `pdrooh/serena-app`

2. **Configurar Frontend:**
   - Clique no novo serviço criado
   - Vá em **"Settings"**
   - **Root Directory:** (deixe vazio - é a raiz)
   - **Build Command:**
     ```
     npm install && npm run build
     ```
   - **Start Command:**
     ```
     npx serve -s build -l 3000
     ```

3. **Variáveis de Ambiente do Frontend:**
   - Vá em **"Variables"**
   - Adicione:
     ```
     REACT_APP_API_URL = https://seu-backend.railway.app/api
     ```
     (Substitua `seu-backend.railway.app` pela URL real do seu backend)

---

### Passo 8: Atualizar CORS no Backend

1. **Volte para o serviço do backend:**
   - Vá em **"Variables"**
   - Adicione:
     ```
     CORS_ORIGIN = https://seu-frontend.railway.app
     ```
     (Substitua pela URL do frontend que Railway fornecerá)

2. **Reiniciar Backend:**
   - Railway reiniciará automaticamente quando você adicionar a variável
   - Ou clique em **"Redeploy"** no menu do serviço

---

### Passo 9: Acessar Aplicação

1. **No serviço do frontend:**
   - Vá em **"Settings"** > **"Domains"**
   - Você verá uma URL como: `https://seu-frontend.railway.app`
   - **Essa é a URL da sua aplicação!**

2. **Acesse no navegador:**
   - Abra: `https://seu-frontend.railway.app`
   - Deve carregar a tela de login

3. **Fazer Login:**
   - Email: `admin@serena.com`
   - Senha: `senha123`

---

## ✅ Checklist Final

- [ ] Backend deployado e funcionando
- [ ] Banco de dados PostgreSQL conectado
- [ ] Migrações executadas (automático com `start:migrate`)
- [ ] Super admin criado
- [ ] Frontend deployado
- [ ] `REACT_APP_API_URL` configurado no frontend
- [ ] `CORS_ORIGIN` configurado no backend
- [ ] Aplicação acessível no navegador
- [ ] Login funcionando

---

## 🆘 Problemas Comuns

### Backend não inicia:
- Verifique os logs no Railway
- Verifique se todas as variáveis de banco estão configuradas
- Verifique se `Root Directory` está como `backend`

### Frontend não conecta ao backend:
- Verifique se `REACT_APP_API_URL` está correto
- Verifique se `CORS_ORIGIN` inclui a URL do frontend
- Verifique se o backend está rodando (veja logs)

### Erro de migrações:
- Verifique se as variáveis de banco estão corretas
- Veja os logs do backend durante o deploy

---

## 🎉 Pronto!

Sua aplicação está no ar! Acesse a URL do frontend e comece a usar.

**Credenciais:**
- Email: `admin@serena.com`
- Senha: `senha123`

---

## 📝 URLs Importantes

- **Frontend:** `https://seu-frontend.railway.app`
- **Backend API:** `https://seu-backend.railway.app/api`
- **Health Check:** `https://seu-backend.railway.app/api/health`

---

**Dica:** Railway faz deploy automático sempre que você fizer push no GitHub!

