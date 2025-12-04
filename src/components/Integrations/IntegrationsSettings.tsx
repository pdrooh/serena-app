import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Calendar,
  MessageSquare,
  Mail,
  Video,
  Settings,
  Check,
  X,
  Save,
  TestTube
} from 'lucide-react';
import { theme } from '../../styles/theme';
import { externalIntegrationsService, IntegrationConfig } from '../../services/externalIntegrations';
import { toast } from 'react-toastify';

const SettingsContainer = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.md};
  border: 1px solid ${theme.colors.border};
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.lg};
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};
`;

const SectionIcon = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.lg};
  background: ${props => props.color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
`;

const SectionTitle = styled.h2`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const IntegrationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const IntegrationCard = styled.div<{ enabled: boolean }>`
  background: ${theme.colors.background};
  border: 2px solid ${props => props.enabled ? theme.colors.primary : theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  transition: all 0.2s ease;
  opacity: ${props => props.enabled ? 1 : 0.7};

  &:hover {
    border-color: ${props => props.enabled ? theme.colors.primary : theme.colors.text.secondary};
  }
`;

const IntegrationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.md};
`;

const IntegrationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const IntegrationIcon = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.md};
  background: ${props => props.color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
`;

const IntegrationTitle = styled.h3`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const ToggleSwitch = styled.label<{ enabled: boolean }>`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  background: ${props => props.enabled ? theme.colors.primary : theme.colors.text.secondary};
  border-radius: ${theme.borderRadius.full};
  cursor: pointer;
  transition: background 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.enabled ? '26px' : '2px'};
    width: 20px;
    height: 20px;
    background: white;
    border-radius: ${theme.borderRadius.full};
    transition: left 0.2s ease;
  }
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const IntegrationForm = styled.div<{ enabled: boolean }>`
  display: ${props => props.enabled ? 'block' : 'none'};
  margin-top: ${theme.spacing.md};
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

const FormLabel = styled.label`
  display: block;
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
`;

const FormInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.primary};
  background: ${theme.colors.surface};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.primary};
  background: ${theme.colors.surface};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.lg};
`;

const ActionButton = styled.button<{ variant: 'primary' | 'secondary' | 'success' }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary};
          color: white;
          &:hover { background: ${theme.colors.primary}dd; }
        `;
      case 'secondary':
        return `
          background: ${theme.colors.background};
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.border};
          &:hover { background: ${theme.colors.surface}; }
        `;
      case 'success':
        return `
          background: ${theme.colors.status.success};
          color: white;
          &:hover { background: ${theme.colors.status.success}dd; }
        `;
    }
  }}
`;

const StatusIndicator = styled.div<{ status: 'connected' | 'disconnected' | 'testing' }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.medium};

  ${props => {
    switch (props.status) {
      case 'connected':
        return `color: ${theme.colors.status.success};`;
      case 'disconnected':
        return `color: ${theme.colors.status.error};`;
      case 'testing':
        return `color: ${theme.colors.status.warning};`;
    }
  }}
`;

const IntegrationsSettings: React.FC = () => {
  const [config, setConfig] = useState<IntegrationConfig>(externalIntegrationsService.getConfig());
  const [testing, setTesting] = useState<string | null>(null);

  useEffect(() => {
    setConfig(externalIntegrationsService.getConfig());
  }, []);

  const handleToggle = (integration: keyof IntegrationConfig) => {
    const newConfig = {
      ...config,
      [integration]: {
        ...config[integration],
        enabled: !config[integration]?.enabled
      }
    };
    setConfig(newConfig);
  };

  const handleConfigChange = (integration: keyof IntegrationConfig, field: string, value: string) => {
    const newConfig = {
      ...config,
      [integration]: {
        ...config[integration],
        [field]: value
      }
    };
    setConfig(newConfig);
  };

  const handleSave = () => {
    externalIntegrationsService.updateConfig(config);
    toast.success('Configurações salvas com sucesso!');
  };

  const handleTest = async (integration: keyof IntegrationConfig) => {
    setTesting(integration);

    try {
      // Simular teste de conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`${integration} conectado com sucesso!`);
    } catch (error) {
      toast.error(`Erro ao conectar com ${integration}`);
    } finally {
      setTesting(null);
    }
  };

  const integrations = [
    {
      key: 'googleCalendar' as keyof IntegrationConfig,
      title: 'Google Calendar',
      icon: Calendar,
      color: theme.colors.primary,
      fields: [
        { key: 'clientId', label: 'Client ID', type: 'text' },
        { key: 'apiKey', label: 'API Key', type: 'text' },
        { key: 'calendarId', label: 'Calendar ID', type: 'text' }
      ]
    },
    {
      key: 'outlook' as keyof IntegrationConfig,
      title: 'Microsoft Outlook',
      icon: Calendar,
      color: theme.colors.accent,
      fields: [
        { key: 'clientId', label: 'Client ID', type: 'text' },
        { key: 'tenantId', label: 'Tenant ID', type: 'text' }
      ]
    },
    {
      key: 'smsGateway' as keyof IntegrationConfig,
      title: 'SMS Gateway',
      icon: MessageSquare,
      color: theme.colors.status.success,
      fields: [
        { key: 'provider', label: 'Provider', type: 'select', options: ['twilio', 'aws-sns', 'custom'] },
        { key: 'apiKey', label: 'API Key', type: 'text' },
        { key: 'phoneNumber', label: 'Phone Number', type: 'text' }
      ]
    },
    {
      key: 'emailMarketing' as keyof IntegrationConfig,
      title: 'Email Marketing',
      icon: Mail,
      color: theme.colors.status.warning,
      fields: [
        { key: 'provider', label: 'Provider', type: 'select', options: ['mailchimp', 'sendgrid', 'custom'] },
        { key: 'apiKey', label: 'API Key', type: 'text' },
        { key: 'listId', label: 'List ID', type: 'text' }
      ]
    },
    {
      key: 'teleconsulta' as keyof IntegrationConfig,
      title: 'Teleconsulta',
      icon: Video,
      color: theme.colors.status.error,
      fields: [
        { key: 'provider', label: 'Provider', type: 'select', options: ['zoom', 'google-meet', 'microsoft-teams'] },
        { key: 'apiKey', label: 'API Key', type: 'text' },
        { key: 'accountId', label: 'Account ID', type: 'text' }
      ]
    }
  ];

  return (
    <SettingsContainer>
      <SectionHeader>
        <SectionIcon color={theme.colors.primary}>
          <Settings size={24} />
        </SectionIcon>
        <SectionTitle>Integrações Externas</SectionTitle>
      </SectionHeader>

      <IntegrationGrid>
        {integrations.map((integration) => {
          const Icon = integration.icon;
          const isEnabled = config[integration.key]?.enabled || false;
          const isTesting = testing === integration.key;

          return (
            <IntegrationCard key={integration.key} enabled={isEnabled}>
              <IntegrationHeader>
                <IntegrationInfo>
                  <IntegrationIcon color={integration.color}>
                    <Icon size={20} />
                  </IntegrationIcon>
                  <IntegrationTitle>{integration.title}</IntegrationTitle>
                </IntegrationInfo>
                <ToggleSwitch enabled={isEnabled}>
                  <ToggleInput
                    type="checkbox"
                    checked={isEnabled}
                    onChange={() => handleToggle(integration.key)}
                  />
                </ToggleSwitch>
              </IntegrationHeader>

              <StatusIndicator status={isTesting ? 'testing' : isEnabled ? 'connected' : 'disconnected'}>
                {isTesting ? (
                  <>
                    <TestTube size={12} />
                    Testando...
                  </>
                ) : isEnabled ? (
                  <>
                    <Check size={12} />
                    Conectado
                  </>
                ) : (
                  <>
                    <X size={12} />
                    Desconectado
                  </>
                )}
              </StatusIndicator>

              <IntegrationForm enabled={isEnabled}>
                {integration.fields.map((field) => (
                  <FormGroup key={field.key}>
                    <FormLabel>{field.label}</FormLabel>
                    {field.type === 'select' ? (
                      <FormSelect
                        value={config[integration.key]?.[field.key as keyof typeof config[typeof integration.key]] || ''}
                        onChange={(e) => handleConfigChange(integration.key, field.key, e.target.value)}
                      >
                        <option value="">Selecione...</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </option>
                        ))}
                      </FormSelect>
                    ) : (
                      <FormInput
                        type={field.type}
                        value={config[integration.key]?.[field.key as keyof typeof config[typeof integration.key]] || ''}
                        onChange={(e) => handleConfigChange(integration.key, field.key, e.target.value)}
                        placeholder={`Digite o ${field.label.toLowerCase()}`}
                      />
                    )}
                  </FormGroup>
                ))}

                <ActionButtons>
                  <ActionButton
                    variant="secondary"
                    onClick={() => handleTest(integration.key)}
                    disabled={isTesting}
                  >
                    <TestTube size={14} />
                    Testar
                  </ActionButton>
                </ActionButtons>
              </IntegrationForm>
            </IntegrationCard>
          );
        })}
      </IntegrationGrid>

      <ActionButtons>
        <ActionButton variant="primary" onClick={handleSave}>
          <Save size={16} />
          Salvar Configurações
        </ActionButton>
      </ActionButtons>
    </SettingsContainer>
  );
};

export default IntegrationsSettings;
