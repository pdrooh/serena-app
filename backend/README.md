# Serena Backend

Backend completo para o sistema Serena - Gestão de Consultório de Psicologia.

## 🚀 Características

- **API RESTful** completa
- **Autenticação JWT** segura
- **Banco de dados SQLite** (fácil de usar e deployar)
- **Validação de dados** robusta
- **Rate limiting** para segurança
- **Criptografia** de senhas com bcrypt
- **Relatórios** detalhados
- **Isolamento de dados** por usuário

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn

## 🛠️ Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp env.example .env
```

3. **Executar migrações:**
```bash
npm run migrate
```

4. **Iniciar servidor:**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📊 Estrutura do Banco de Dados

### Tabelas:
- **users** - Usuários do sistema
- **patients** - Pacientes
- **sessions** - Sessões de terapia
- **appointments** - Agendamentos
- **payments** - Pagamentos

## 🔐 Autenticação

Todas as rotas (exceto `/api/auth`) requerem autenticação via JWT:

```bash
Authorization: Bearer <token>
```

## 📡 Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verificar token

### Pacientes
- `GET /api/patients` - Listar pacientes
- `POST /api/patients` - Criar paciente
- `PUT /api/patients/:id` - Atualizar paciente
- `DELETE /api/patients/:id` - Deletar paciente

### Sessões
- `GET /api/sessions` - Listar sessões
- `POST /api/sessions` - Criar sessão
- `PUT /api/sessions/:id` - Atualizar sessão
- `DELETE /api/sessions/:id` - Deletar sessão

### Agendamentos
- `GET /api/appointments` - Listar agendamentos
- `POST /api/appointments` - Criar agendamento
- `PUT /api/appointments/:id` - Atualizar agendamento
- `DELETE /api/appointments/:id` - Deletar agendamento

### Pagamentos
- `GET /api/payments` - Listar pagamentos
- `POST /api/payments` - Criar pagamento
- `PUT /api/payments/:id` - Atualizar pagamento
- `DELETE /api/payments/:id` - Deletar pagamento

### Relatórios
- `GET /api/reports/dashboard` - Dashboard geral
- `GET /api/reports/financial` - Relatório financeiro
- `GET /api/reports/patients` - Relatório de pacientes
- `GET /api/reports/sessions` - Relatório de sessões
- `GET /api/reports/appointments` - Relatório de agendamentos

## 🔒 Segurança

- **Rate limiting** - 100 requests por 15 minutos
- **Helmet** - Headers de segurança
- **CORS** configurado
- **Validação** de entrada
- **Sanitização** de dados
- **Isolamento** de dados por usuário

## 📈 Monitoramento

- **Health check**: `GET /health`
- **Logs** estruturados
- **Tratamento** de erros centralizado

## 🚀 Deploy

### Produção:
1. Configure as variáveis de ambiente
2. Execute as migrações
3. Inicie o servidor com `npm start`

### Docker (opcional):
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run migrate
EXPOSE 5000
CMD ["npm", "start"]
```

## 📝 Scripts Disponíveis

- `npm start` - Iniciar em produção
- `npm run dev` - Iniciar em desenvolvimento
- `npm run migrate` - Executar migrações
- `npm run seed` - Executar seeds
- `npm test` - Executar testes

## 🔧 Configuração

### Variáveis de Ambiente:

```env
PORT=5000
NODE_ENV=production
DB_CLIENT=sqlite3
DB_FILENAME=./database.sqlite
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
```

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação da API ou entre em contato com a equipe de desenvolvimento.
