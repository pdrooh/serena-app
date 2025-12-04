# 🚀 Como Fazer Deploy - Guia Passo a Passo

## ⚡ Opção Mais Rápida: Railway (5 minutos)

### Passo 1: Preparar Código no GitHub

1. Crie uma conta no GitHub (se não tiver): https://github.com
2. Crie um novo repositório
3. Faça upload de todos os arquivos do projeto

### Passo 2: Deploy no Railway

1. **Acesse Railway:**
   - Vá em: https://railway.app
   - Clique em "Login" e faça login com GitHub

2. **Criar Novo Projeto:**
   - Clique no botão "+ New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha seu repositório
   - Railway detectará automaticamente o projeto

3. **Configurar Backend:**
   - Railway criará um serviço automaticamente
   - Clique no serviço para configurar
   - Vá em "Settings" > "Variables"
   - Adicione estas variáveis:
     ```
     NODE_ENV=production
     PORT=5001
     DB_CLIENT=postgresql
     JWT_SECRET=(clique em "Generate" para gerar automaticamente)
     CORS_ORIGIN=https://seu-app.railway.app
     ```
   - **IMPORTANTE:** Anote a URL que Railway fornecerá (ex: `https://seu-app.railway.app`)

4. **Adicionar Banco de Dados PostgreSQL:**
   - No projeto, clique em "+ New" > "Database" > "PostgreSQL"
   - Railway criará automaticamente
   - Vá em "Variables" do banco de dados
   - Copie estas variáveis:
     - `PGHOST`
     - `PGPORT`
     - `PGDATABASE`
     - `PGUSER`
     - `PGPASSWORD`
   - Volte ao serviço do backend e adicione essas variáveis:
     ```
     DB_HOST=(valor de PGHOST)
     DB_PORT=(valor de PGPORT)
     DB_NAME=(valor de PGDATABASE)
     DB_USER=(valor de PGUSER)
     DB_PASSWORD=(valor de PGPASSWORD)
     ```

5. **Configurar Start Command:**
   - No serviço do backend, vá em "Settings" > "Deploy"
   - Em "Start Command", coloque:
     ```
     cd backend && npm run start:migrate
     ```
   - Isso executará as migrações antes de iniciar

6. **Deploy Automático:**
   - Railway fará deploy automaticamente
   - Aguarde alguns minutos
   - Veja os logs para acompanhar

7. **Criar Super Admin:**
   - Após o deploy, vá em "Settings" > "Deploy" > "Run Command"
   - Execute:
     ```
     cd backend && node scripts/create-super-admin.js admin@serena.com senha123 "Super Admin"
     ```
   - **IMPORTANTE:** Anote essas credenciais!

8. **Configurar Frontend:**
   - No mesmo projeto, clique em "+ New" > "Service" > "GitHub Repo"
   - Selecione o mesmo repositório
   - Configure:
     - **Root Directory:** (deixe vazio, é a raiz)
     - **Build Command:** `npm install && npm run build`
     - **Start Command:** `npx serve -s build -l 3000`
   - Variáveis de ambiente:
     ```
     REACT_APP_API_URL=https://seu-backend.railway.app/api
     ```
     (Substitua `seu-backend.railway.app` pela URL do seu backend)

9. **Acessar Aplicação:**
   - Railway fornecerá uma URL para o frontend
   - Exemplo: `https://seu-app.railway.app`
   - Acesse essa URL no navegador!

---

## ✅ Verificação

1. **Testar Backend:**
   - Acesse: `https://seu-backend.railway.app/api/health`
   - Deve retornar: `{"status":"OK"}`

2. **Testar Frontend:**
   - Acesse a URL do frontend
   - Deve carregar a tela de login

3. **Fazer Login:**
   - Use as credenciais do super admin criado
   - Email: `admin@serena.com`
   - Senha: `senha123` (ou a que você definiu)

---

## 🔧 Ajustes Finais

### Se o Frontend não conectar ao Backend:

1. Verifique a variável `REACT_APP_API_URL` no frontend
2. Verifique a variável `CORS_ORIGIN` no backend
3. Ambos devem usar as URLs do Railway

### Personalizar Domínio (Opcional):

1. No Railway, vá em "Settings" > "Domains"
2. Adicione seu domínio personalizado
3. Siga as instruções de DNS
4. Atualize `CORS_ORIGIN` e `REACT_APP_API_URL` com o novo domínio

---

## 📱 Outras Opções de Deploy

### Render (Gratuito):
- Veja `DEPLOY_AUTOMATICO.md` para instruções detalhadas

### Vercel (Frontend) + Railway (Backend):
- Frontend: https://vercel.com
- Backend: Siga instruções do Railway acima

---

## 🆘 Problemas Comuns

### Backend não inicia:
- Verifique os logs no Railway
- Verifique se todas as variáveis estão configuradas
- Verifique se o banco de dados está conectado

### Frontend não carrega:
- Verifique se o build foi concluído
- Verifique os logs
- Verifique se `REACT_APP_API_URL` está correto

### Erro de CORS:
- Verifique se `CORS_ORIGIN` no backend inclui a URL do frontend
- Pode usar múltiplas URLs separadas por vírgula

---

## 🎉 Pronto!

Sua aplicação está no ar! Acesse a URL fornecida pelo Railway e comece a usar.

**Credenciais de Super Admin:**
- Email: `admin@serena.com`
- Senha: `senha123` (ou a que você definiu)

---

## 📞 Precisa de Ajuda?

1. Verifique os logs no Railway
2. Verifique as variáveis de ambiente
3. Teste a API diretamente: `https://seu-backend.railway.app/api/health`

