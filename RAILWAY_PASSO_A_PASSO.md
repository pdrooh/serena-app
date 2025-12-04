# 🎯 Passo a Passo Rápido - Railway

## ⚡ Ação Rápida (5 minutos)

### 1. Conectar PostgreSQL ao Backend

1. **Railway Dashboard** → Abra o serviço **BACKEND**
2. **Variables** (ou Settings → Variables)
3. **"+ New Variable"** → **"Reference Variable"** (ou "Connect Database")
4. **Selecione PostgreSQL** → Salvar

✅ **Resultado:** Variáveis `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` criadas automaticamente

---

### 2. Adicionar Variáveis Obrigatórias

No serviço **BACKEND** → **Variables** → Adicione:

```
NODE_ENV = production
PORT = 5001
DB_CLIENT = postgresql
JWT_SECRET = [clique em "Generate"]
CORS_ORIGIN = https://seu-frontend.railway.app
DB_SSL = true
```

---

### 3. Aguardar Redeploy

O Railway fará redeploy automaticamente. Aguarde 2-3 minutos.

---

### 4. Verificar Logs

No serviço **BACKEND** → **Deploy Logs** → Procure:

✅ **Sucesso:**
```
✅ Conexão com banco de dados estabelecida
Server running on port 5001
```

❌ **Erro:**
```
Host: NÃO DEFINIDO
❌ Variáveis de ambiente do banco de dados não configuradas
```

---

## 📋 Checklist Visual

```
[ ] PostgreSQL criado no Railway
[ ] Backend criado com Root Directory = "backend"
[ ] PostgreSQL conectado ao Backend (Add Reference)
[ ] NODE_ENV=production configurado
[ ] PORT=5001 configurado
[ ] DB_CLIENT=postgresql configurado
[ ] JWT_SECRET gerado e configurado
[ ] CORS_ORIGIN configurado
[ ] DB_SSL=true configurado
[ ] Logs mostram "✅ Conexão estabelecida"
[ ] Backend respondendo em /api/health
```

---

## 🆘 Problemas Comuns

### "ECONNREFUSED ::1:5432"
→ PostgreSQL não conectado. Use "Add Reference" no backend.

### "Cannot find module 'cors'"
→ Root Directory não está como "backend". Configure em Settings → Deploy.

### "Host: NÃO DEFINIDO"
→ PostgreSQL não conectado ou NODE_ENV não é "production".

---

**Tempo estimado: 5-10 minutos** ⏱️

