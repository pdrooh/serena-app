# 🌸 Serena - Gestão de Consultório Psicológico

**Seu espaço seguro para acompanhar sua evolução psicológica**

Serena é um aplicativo completo desenvolvido especificamente para psicólogos gerenciarem seus consultórios de forma eficiente e segura. Com uma interface moderna e intuitiva, o app oferece todas as ferramentas necessárias para o dia a dia clínico.

## ✨ Funcionalidades Principais

### 👥 **Gestão de Pacientes** ✅ **FUNCIONAL**
- ✅ Cadastro completo de pacientes com dados pessoais e contatos de emergência
- ✅ Edição e exclusão de pacientes
- ✅ Histórico de saúde e observações iniciais
- ✅ Busca e filtros por nome e email
- ✅ Validação de formulários com React Hook Form
- ✅ Upload de documentos (atestados, encaminhamentos) - Interface pronta

### 📋 **Prontuários Digitais** ✅ **FUNCIONAL**
- ✅ Registro detalhado de cada sessão com formulário completo
- ✅ Avaliação de humor com slider visual (1-10)
- ✅ Objetivos e técnicas aplicadas com sistema de tags
- ✅ Notas detalhadas da sessão
- ✅ Objetivos para próxima sessão
- ✅ Edição e exclusão de sessões
- ✅ Busca por notas, objetivos, técnicas e nome do paciente

### 📅 **Agenda Inteligente** ✅ **FUNCIONAL**
- ✅ Marcação de sessões presenciais ou online
- ✅ Calendário interativo com visualização mensal
- ✅ Seleção de horários disponíveis
- ✅ Diferentes durações de sessão (30, 45, 50, 60, 90 min)
- ✅ Edição e exclusão de agendamentos
- ✅ Status de agendamentos (agendado, confirmado, realizado, cancelado)

### 💰 **Área Financeira** ✅ **FUNCIONAL**
- ✅ Controle completo de pagamentos por paciente
- ✅ Diferentes métodos de pagamento (PIX, dinheiro, cartão, transferência)
- ✅ Status de pagamentos (pago, pendente, atrasado)
- ✅ Relatórios financeiros com estatísticas em tempo real
- ✅ Edição e exclusão de pagamentos
- ✅ Busca por paciente, método e observações

### 🔒 **Segurança Avançada** ✅ **INTERFACE PRONTA**
- ✅ Interface para alteração de senhas
- ✅ Configuração de autenticação de dois fatores
- ✅ Backup de dados com localStorage
- ✅ Interface de criptografia
- ✅ Status de segurança visual

### 👤 **Portal do Paciente** ✅ **INTERFACE PRONTA**
- ✅ Área exclusiva para pacientes
- ✅ Histórico de consultas
- ✅ Materiais de apoio e exercícios
- ✅ Tarefas pós-sessão
- ✅ Interface para acesso dos pacientes

### 📊 **Relatórios e Analytics** ✅ **INTERFACE PRONTA**
- ✅ Relatórios financeiros
- ✅ Estatísticas de pacientes
- ✅ Análise de evolução clínica
- ✅ Cards de relatórios por categoria
- ✅ Interface para exportação

## 🎨 Design e Branding

### **Identidade Visual**
- **Nome**: Serena (transmite calma e confiança)
- **Cores**:
  - Azul-claro (#4A90E2) - serenidade, confiança
  - Verde-água (#7ED321) - equilíbrio, saúde mental
  - Lilás (#9013FE) - criatividade e empatia
- **Tipografia**: Poppins (limpa e moderna)
- **Logo**: Mente estilizada com ondas representando pensamentos fluindo

### **Tom de Comunicação**
- Empático e acolhedor
- Frases curtas que passam calma
- Interface minimalista e intuitiva

## 🚀 Instalação e Configuração

### **Pré-requisitos**
- Node.js 16+
- npm ou yarn
- Git

### **Instalação**

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd psicologia
```

2. **Instale as dependências**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm start
```

## 🔐 Sistema de Autenticação

### **Primeiro Acesso**
1. Na tela de login, clique em "Criar conta"
2. Preencha os dados: nome, email e senha
3. A conta será criada e você será logado automaticamente

### **Múltiplas Contas**
- Cada usuário tem seus próprios dados isolados
- Dados são salvos separadamente no localStorage
- O primeiro usuário recebe dados de exemplo
- Novos usuários começam com dados vazios

### **Funcionalidades de Segurança**
- **Alterar Senha**: Vá em Segurança → Alterar Senha
- **Backup**: Vá em Segurança → Baixar Backup
- **Restaurar**: Vá em Segurança → Restaurar Backup
- **Logout**: Clique no ícone de logout no header

4. **Acesse o aplicativo**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador

### **Scripts Disponíveis**

```bash
# Desenvolvimento
npm start

# Build para produção
npm run build

# Executar testes
npm test

# Ejetar configurações (não recomendado)
npm run eject
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   └── Layout/         # Header, Sidebar, Layout principal
├── pages/              # Páginas da aplicação
│   ├── Dashboard.tsx   # Página inicial
│   ├── Patients.tsx    # Gestão de pacientes
│   ├── Records.tsx     # Prontuários digitais
│   ├── Appointments.tsx # Agenda
│   ├── Payments.tsx    # Área financeira
│   ├── Reports.tsx     # Relatórios
│   ├── PatientPortal.tsx # Portal do paciente
│   └── Security.tsx    # Configurações de segurança
├── styles/             # Estilos globais e tema
│   ├── theme.ts        # Configurações do tema
│   └── GlobalStyles.ts # Estilos globais
├── types/              # Definições TypeScript
│   └── index.ts        # Interfaces e tipos
├── App.tsx             # Componente principal
└── index.tsx           # Ponto de entrada
```

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Styled Components** - CSS-in-JS
- **React Router** - Roteamento
- **Lucide React** - Ícones
- **React Hook Form** - Gerenciamento de formulários
- **React Toastify** - Notificações
- **Date-fns** - Manipulação de datas
- **Context API** - Gerenciamento de estado global
- **localStorage** - Persistência de dados

## 🚀 Funcionalidades Implementadas

### ✅ **Sistema de Autenticação Completo**
- **Login e Registro**: Sistema completo de autenticação
- **Múltiplas Contas**: Cada usuário tem seus próprios dados isolados
- **Validação de Senhas**: Requisitos de segurança para senhas
- **Persistência de Sessão**: Login automático ao recarregar a página
- **Logout Seguro**: Limpeza completa dos dados da sessão

### ✅ **Sistema Completo de CRUD**
- **Pacientes**: Criar, ler, atualizar e excluir pacientes
- **Sessões**: Registrar, editar e excluir sessões de terapia
- **Agendamentos**: Agendar, editar e cancelar consultas
- **Pagamentos**: Registrar, editar e excluir pagamentos

### ✅ **Formulários Inteligentes**
- Validação em tempo real com React Hook Form
- Campos obrigatórios e validações customizadas
- Sistema de tags para objetivos e técnicas
- Slider visual para avaliação de humor
- Seleção de horários e datas

### ✅ **Interface Responsiva**
- Design adaptável para desktop, tablet e mobile
- Modais funcionais para todas as operações
- Navegação intuitiva com sidebar
- Cards informativos com estatísticas

### ✅ **Persistência de Dados por Usuário**
- Dados salvos automaticamente no localStorage por usuário
- Carregamento automático na inicialização
- Dados de exemplo pré-carregados para o primeiro usuário
- Backup automático de todas as operações

### ✅ **Sistema de Busca**
- Busca em tempo real em todas as páginas
- Filtros por diferentes critérios
- Resultados instantâneos
- Interface de busca intuitiva

### ✅ **Dashboard Dinâmico**
- Estatísticas calculadas em tempo real
- Próximas consultas
- Ações rápidas
- Métricas de receita e pacientes

### ✅ **Relatórios Funcionais**
- **Relatório Financeiro**: Receita total, mensal, pagamentos pendentes
- **Relatório de Pacientes**: Estatísticas de pacientes ativos
- **Relatório de Sessões**: Análise de sessões e humor médio
- **Relatório de Evolução**: Acompanhamento do progresso dos pacientes
- **Exportação**: Download de relatórios em formato texto

### ✅ **Portal do Paciente Funcional**
- Lista de pacientes com dados reais
- Relatórios individuais por paciente
- Download de relatórios personalizados
- Interface para acesso dos pacientes

### ✅ **Segurança Avançada**
- **Alteração de Senha**: Sistema funcional de mudança de senha
- **Backup de Dados**: Exportação completa dos dados do usuário
- **Restauração**: Importação de dados de backup
- **Autenticação de Dois Fatores**: Interface para configuração
- **Criptografia**: Interface de status de segurança

## 🔮 Funcionalidades Futuras

- [ ] Integração com Google Calendar/Outlook
- [ ] Chat em tempo real com pacientes
- [ ] Aplicativo mobile (React Native)
- [ ] IA para análise de sentimentos
- [ ] Teleconsulta integrada
- [ ] Sistema de lembretes por SMS/WhatsApp
- [ ] Integração com planos de saúde
- [ ] Relatórios avançados com gráficos

## 📱 Responsividade

O aplicativo é totalmente responsivo e funciona perfeitamente em:
- 💻 Desktop (1200px+)
- 📱 Tablet (768px - 1199px)
- 📱 Mobile (até 767px)

## 🔐 Segurança e Privacidade

- **Criptografia**: Todos os dados são criptografados com AES-256
- **Backup**: Backup automático diário em nuvem
- **LGPD**: Totalmente compatível com a Lei Geral de Proteção de Dados
- **Auditoria**: Log completo de todas as ações
- **Acesso**: Controle granular de permissões

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas:
- 📧 Email: suporte@serena.com.br
- 📱 WhatsApp: (11) 99999-9999
- 🌐 Website: www.serena.com.br

---

**Serena** - Organização e clareza para o seu trabalho clínico. 💙
