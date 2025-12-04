# 🔧 Configuração do Backend no Railway

## ⚠️ Problema Atual

O backend está falhando porque as dependências não estão sendo instaladas. O erro mostra:
```
Error: Cannot find module 'cors'
```

## ✅ Solução

### Opção 1: Configurar Root Directory (Recomendado)

No Railway, configure o serviço do backend:

1. **Vá no serviço do backend no Railway**
2. **Clique em "Settings"**
3. **Configure:**
   - **Root Directory:** `backend`
   - **Build Command:** `npm install --production`
   - **Start Command:** `npm run start:migrate`

### Opção 2: Usar nixpacks.toml (Já criado)

O arquivo `nixpacks.toml` já foi criado na raiz do projeto. O Railway deve detectá-lo automaticamente.

Se não funcionar, você pode criar um arquivo `Dockerfile` no diretório `backend`:

---

## 🐳 Dockerfile para Backend (Alternativa)

Crie um arquivo `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm install --production

# Copiar código
COPY . .

# Expor porta
EXPOSE 5001

# Comando de inicialização
CMD ["npm", "run", "start:migrate"]
```

---

## 📝 Variáveis de Ambiente Necessárias

Certifique-se de que todas estas variáveis estão configuradas no Railway:

### Obrigatórias:
```
NODE_ENV=production
PORT=5001
DB_CLIENT=postgresql
JWT_SECRET=(gerar uma chave segura)
CORS_ORIGIN=https://seu-frontend.railway.app
```

### Banco de Dados (do serviço PostgreSQL):
```
DB_HOST=(do PostgreSQL)
DB_PORT=5432
DB_NAME=(do PostgreSQL)
DB_USER=(do PostgreSQL)
DB_PASSWORD=(do PostgreSQL)
```

---

## 🔄 Passos para Corrigir Agora

1. **No Railway, vá no serviço do backend**
2. **Settings > Deploy**
3. **Configure:**
   - Root Directory: `backend`
   - Build Command: `npm install --production`
   - Start Command: `npm run start:migrate`
4. **Salve e aguarde o redeploy**

---

## ✅ Verificar se Funcionou

Após o redeploy, verifique:
- Logs não mostram erro de módulo não encontrado
- Backend responde em `/api/health`
- Migrações foram executadas

---

**O arquivo `nixpacks.toml` foi criado e deve ajudar, mas a configuração manual no Railway é mais confiável.**

