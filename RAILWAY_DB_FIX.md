# 🔧 Correção: Erro de Conexão com PostgreSQL no Railway

## ⚠️ Problema

O backend está falhando com o erro:
```
connect ECONNREFUSED ::1:5432
Error: connect ECONNREFUSED ::1:5432
```

Isso acontece porque o backend está tentando conectar ao `localhost` (`::1` é IPv6 localhost) ao invés do host do PostgreSQL do Railway.

## ✅ Solução Aplicada

O `knexfile.js` foi atualizado para suportar as variáveis de ambiente do Railway:

- **Railway usa:** `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`
- **Backend esperava:** `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`

Agora o backend aceita **ambas** as nomenclaturas, priorizando as variáveis do Railway.

---

## 📝 Variáveis de Ambiente no Railway

### ✅ Automáticas (do serviço PostgreSQL)

Quando você conecta o serviço PostgreSQL ao backend no Railway, estas variáveis são **automaticamente** criadas:

```
PGHOST=(host do PostgreSQL)
PGPORT=5432
PGDATABASE=(nome do banco)
PGUSER=(usuário)
PGPASSWORD=(senha)
```

**Você NÃO precisa configurar essas manualmente!** Elas são criadas automaticamente quando você conecta os serviços.

---

## 🔗 Como Conectar o PostgreSQL ao Backend

1. **No Railway, vá no serviço do backend**
2. **Clique em "Variables" (ou "Settings" > "Variables")**
3. **Clique em "Add Reference"** (ou "Connect Database")
4. **Selecione o serviço PostgreSQL**
5. **O Railway criará automaticamente as variáveis `PGHOST`, `PGPORT`, etc.**

---

## ⚙️ Variáveis Adicionais Necessárias

Além das variáveis do PostgreSQL (que são automáticas), você precisa configurar:

### Obrigatórias:
```
NODE_ENV=production
PORT=5001
DB_CLIENT=postgresql
JWT_SECRET=(clique em "Generate" no Railway para criar uma chave segura)
CORS_ORIGIN=https://seu-frontend.railway.app
```

### Opcionais (mas recomendadas):
```
DB_SSL=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

---

## 🔄 Próximos Passos

1. **Certifique-se de que o PostgreSQL está conectado ao backend:**
   - Vá no serviço do backend
   - Variables > Add Reference > Selecione PostgreSQL

2. **Configure as variáveis obrigatórias:**
   - `NODE_ENV=production`
   - `PORT=5001`
   - `DB_CLIENT=postgresql`
   - `JWT_SECRET=(generate)`
   - `CORS_ORIGIN=(URL do frontend)`

3. **Aguarde o redeploy automático**

4. **Verifique os logs:**
   - Deve aparecer: `✅ Conexão com banco de dados estabelecida`
   - Não deve mais aparecer: `ECONNREFUSED`

---

## ✅ Verificar se Funcionou

Após o redeploy, os logs devem mostrar:
- ✅ `Conexão com banco de dados estabelecida`
- ✅ `Server running on port 5001`
- ✅ Migrações executadas com sucesso

---

**O código foi atualizado e commitado. Após conectar o PostgreSQL e configurar as variáveis, o backend deve funcionar!**

