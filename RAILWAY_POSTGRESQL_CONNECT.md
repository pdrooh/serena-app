# 🔗 Como Conectar PostgreSQL ao Backend no Railway

## ⚠️ Erro Atual

```
connect ECONNREFUSED ::1:5432
```

Este erro significa que o backend está tentando conectar ao `localhost` porque **as variáveis do PostgreSQL não estão configuradas**.

---

## ✅ Solução: Conectar PostgreSQL ao Backend

### Passo 1: Verificar se você tem um serviço PostgreSQL

1. No Railway, veja se há um serviço chamado **"PostgreSQL"** ou similar
2. Se **NÃO tiver**, crie um:
   - Clique em **"+ New"** → **"Database"** → **"Add PostgreSQL"**

### Passo 2: Conectar o PostgreSQL ao Backend

1. **Abra o serviço do BACKEND** (não o PostgreSQL)
2. Vá na aba **"Variables"** (ou **"Settings"** > **"Variables"**)
3. Clique no botão **"+ New Variable"** ou **"Add Reference"**
4. Você verá uma opção **"Reference Variable"** ou **"Connect Database"**
5. **Selecione o serviço PostgreSQL** da lista
6. O Railway criará automaticamente estas variáveis:
   - `PGHOST`
   - `PGPORT`
   - `PGDATABASE`
   - `PGUSER`
   - `PGPASSWORD`

### Passo 3: Verificar se as variáveis foram criadas

Após conectar, você deve ver na lista de variáveis do backend:
- ✅ `PGHOST` (com um ícone de referência)
- ✅ `PGPORT`
- ✅ `PGDATABASE`
- ✅ `PGUSER`
- ✅ `PGPASSWORD`

---

## 📝 Variáveis Adicionais Necessárias

Além das variáveis do PostgreSQL (que são automáticas), configure manualmente:

### No serviço do BACKEND, adicione:

```
NODE_ENV=production
PORT=5001
DB_CLIENT=postgresql
JWT_SECRET=(clique em "Generate" para criar uma chave)
CORS_ORIGIN=https://seu-frontend.railway.app
```

**Como adicionar:**
1. No serviço do backend → **Variables**
2. Clique em **"+ New Variable"**
3. Adicione cada variável acima
4. Para `JWT_SECRET`, clique em **"Generate"** no Railway

---

## 🔄 Após Configurar

1. **O Railway fará redeploy automaticamente**
2. **Aguarde alguns minutos**
3. **Verifique os logs do backend**

### ✅ Logs Esperados (Sucesso):

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

### ❌ Logs de Erro (se ainda não funcionar):

```
🔍 Configuração do banco de dados:
   Host: NÃO DEFINIDO
   Database: NÃO DEFINIDO
❌ Variáveis de ambiente do banco de dados não configuradas corretamente!
```

Se você ver isso, significa que o PostgreSQL **não foi conectado corretamente**.

---

## 🎯 Resumo Rápido

1. ✅ Criar serviço PostgreSQL (se não tiver)
2. ✅ Abrir serviço do BACKEND
3. ✅ Variables → Add Reference → Selecionar PostgreSQL
4. ✅ Adicionar variáveis: `NODE_ENV`, `PORT`, `DB_CLIENT`, `JWT_SECRET`, `CORS_ORIGIN`
5. ✅ Aguardar redeploy
6. ✅ Verificar logs

---

## 🆘 Ainda com Problemas?

Se após conectar o PostgreSQL você ainda ver o erro:

1. **Verifique os logs completos** - agora eles mostram exatamente quais variáveis estão faltando
2. **Confirme que `NODE_ENV=production`** está configurado
3. **Verifique se o PostgreSQL está rodando** (deve aparecer como "Active" no Railway)
4. **Tente desconectar e reconectar** o PostgreSQL ao backend

---

**O código foi atualizado com logs de debug. Após conectar o PostgreSQL, os logs mostrarão exatamente o que está acontecendo!**

