# 🔗 Integrações Externas - Serena Psicologia

## 📋 Visão Geral

O sistema Serena agora inclui integrações externas completas para automatizar tarefas e melhorar a experiência dos pacientes. Todas as integrações são modulares e podem ser configuradas individualmente.

## 🚀 Funcionalidades Implementadas

### ✅ 1. Google Calendar / Outlook - Sincronização de Agenda

**Funcionalidades:**
- Sincronização automática de agendamentos
- Criação de eventos em calendários externos
- Suporte para Google Calendar e Microsoft Outlook
- Links de reunião automáticos para consultas online

**Como usar:**
1. Acesse **Sistema > Integrações**
2. Configure as credenciais do Google Calendar ou Outlook
3. Teste a conexão
4. Os agendamentos serão sincronizados automaticamente

**Configuração necessária:**
- Google Calendar: Client ID, API Key, Calendar ID
- Outlook: Client ID, Tenant ID

### ✅ 2. SMS Gateway - Lembretes por SMS

**Funcionalidades:**
- Envio automático de lembretes por SMS
- Suporte para múltiplos provedores (Twilio, AWS SNS, Custom)
- Integração com sistema de notificações
- Lembretes personalizáveis

**Como usar:**
1. Configure o gateway de SMS nas integrações
2. Ative os lembretes por SMS nas configurações de notificação
3. Os pacientes receberão SMS automaticamente

**Provedores suportados:**
- Twilio
- AWS SNS
- Gateway customizado

### ✅ 3. Email Marketing - Campanhas para Pacientes

**Funcionalidades:**
- Criação e gerenciamento de campanhas de email
- Templates personalizáveis
- Agendamento de envios
- Segmentação de pacientes
- Relatórios de entrega

**Como usar:**
1. Acesse **Integrações > Campanhas de Email**
2. Crie uma nova campanha
3. Configure o conteúdo e destinatários
4. Agende ou envie imediatamente

**Provedores suportados:**
- Mailchimp
- SendGrid
- Gateway customizado

### ✅ 4. Teleconsulta - Integração com Zoom/Meet

**Funcionalidades:**
- Criação automática de reuniões online
- Suporte para Zoom, Google Meet e Microsoft Teams
- Links de reunião seguros
- Senhas de acesso automáticas
- Integração com agendamentos online

**Como usar:**
1. Configure o provedor de teleconsulta
2. Crie reuniões para agendamentos online
3. Compartilhe links com os pacientes
4. Gerencie reuniões ativas

**Provedores suportados:**
- Zoom
- Google Meet
- Microsoft Teams

## 🛠️ Configuração das Integrações

### Acesso às Configurações

1. **Login no sistema** com suas credenciais
2. **Navegue para:** Sistema > Integrações
3. **Configure cada integração** conforme necessário

### Estrutura de Configuração

```typescript
interface IntegrationConfig {
  googleCalendar?: {
    enabled: boolean;
    clientId: string;
    apiKey: string;
    calendarId: string;
  };
  outlook?: {
    enabled: boolean;
    clientId: string;
    tenantId: string;
  };
  smsGateway?: {
    enabled: boolean;
    provider: 'twilio' | 'aws-sns' | 'custom';
    apiKey: string;
    phoneNumber: string;
  };
  emailMarketing?: {
    enabled: boolean;
    provider: 'mailchimp' | 'sendgrid' | 'custom';
    apiKey: string;
    listId: string;
  };
  teleconsulta?: {
    enabled: boolean;
    provider: 'zoom' | 'google-meet' | 'microsoft-teams';
    apiKey: string;
    accountId?: string;
  };
}
```

## 📱 Interface do Usuário

### Página de Integrações

A página de integrações (`/integrations`) inclui:

1. **Ações Rápidas:** Cards com acesso direto às principais funcionalidades
2. **Configurações:** Interface para configurar cada integração
3. **Campanhas de Email:** Gerenciador completo de campanhas
4. **Teleconsultas:** Criação e gerenciamento de reuniões

### Componentes Criados

- `IntegrationsSettings.tsx` - Configuração de integrações
- `EmailCampaigns.tsx` - Gerenciamento de campanhas
- `TeleconsultaManager.tsx` - Gerenciamento de reuniões
- `externalIntegrations.ts` - Serviço principal de integrações

## 🔄 Sincronização Automática

### Agendamentos

- **Criação:** Novos agendamentos são automaticamente sincronizados com calendários configurados
- **Atualização:** Mudanças em agendamentos são refletidas nos calendários externos
- **Lembretes:** Sistema de notificações integrado com SMS e email

### Notificações

- **Lembretes de consulta:** Enviados via browser, SMS e email
- **Lembretes de pagamento:** Alertas automáticos para pagamentos em atraso
- **Lembretes de aniversário:** Notificações de aniversário dos pacientes

## 🧪 Testando as Integrações

### Dados de Teste

Use a conta criada para testar:
- **Email:** pedro.admin@teste.com
- **Senha:** 123456

### Cenários de Teste

1. **Calendário:**
   - Crie um novo agendamento
   - Verifique se aparece no calendário externo

2. **SMS:**
   - Configure o gateway de SMS
   - Crie um agendamento próximo
   - Verifique se o SMS é enviado

3. **Email Marketing:**
   - Crie uma campanha de boas-vindas
   - Envie para todos os pacientes
   - Verifique o status de entrega

4. **Teleconsulta:**
   - Crie um agendamento online
   - Gere uma reunião
   - Teste o link de acesso

## 🔧 Desenvolvimento

### Estrutura de Arquivos

```
src/
├── services/
│   └── externalIntegrations.ts     # Serviço principal
├── components/
│   └── Integrations/
│       ├── IntegrationsSettings.tsx
│       ├── EmailCampaigns.tsx
│       └── TeleconsultaManager.tsx
└── pages/
    └── Integrations.tsx            # Página principal
```

### Extensibilidade

O sistema foi projetado para ser facilmente extensível:

1. **Novos provedores:** Adicione novos provedores nas interfaces
2. **Novas integrações:** Crie novos serviços seguindo o padrão existente
3. **Customizações:** Modifique comportamentos específicos conforme necessário

## 📊 Status das Integrações

| Integração | Status | Funcionalidades |
|------------|--------|-----------------|
| Google Calendar | ✅ Completo | Sincronização automática, eventos, links |
| Microsoft Outlook | ✅ Completo | Sincronização automática, eventos, links |
| SMS Gateway | ✅ Completo | Lembretes automáticos, múltiplos provedores |
| Email Marketing | ✅ Completo | Campanhas, agendamento, segmentação |
| Teleconsulta | ✅ Completo | Zoom, Meet, Teams, links seguros |

## 🚀 Próximos Passos

Para implementação em produção:

1. **Configure credenciais reais** para cada integração
2. **Teste com dados reais** antes de ativar
3. **Configure webhooks** para sincronização bidirecional
4. **Implemente logs** para monitoramento
5. **Configure backup** das configurações

## 📞 Suporte

Para dúvidas sobre as integrações:

1. Consulte esta documentação
2. Verifique os logs do console do navegador
3. Teste cada integração individualmente
4. Verifique as configurações de API

---

**Desenvolvido com ❤️ para o Serena Psicologia**

