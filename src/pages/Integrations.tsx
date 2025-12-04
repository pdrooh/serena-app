import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Settings,
  Calendar,
  MessageSquare,
  Mail,
  Video,
  Bell,
  Smartphone
} from 'lucide-react';
import { theme } from '../styles/theme';
import IntegrationsSettings from '../components/Integrations/IntegrationsSettings';
import EmailCampaigns from '../components/Integrations/EmailCampaigns';
import TeleconsultaManager from '../components/Integrations/TeleconsultaManager';

const IntegrationsContainer = styled.div`
  padding: ${theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.lg};
  }
`;

const PageHeader = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: ${theme.typography.sizes['4xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.sm} 0;
`;

const PageDescription = styled.p`
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.text.secondary};
  margin: 0;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.xl};
  border-bottom: 1px solid ${theme.colors.border};
  overflow-x: auto;

  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: ${theme.spacing.xs};
  }
`;

const Tab = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? theme.colors.primary : 'transparent'};
  color: ${props => props.active ? theme.colors.primary : theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${props => props.active ? theme.typography.weights.semibold : theme.typography.weights.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: ${theme.colors.primary};
    background: ${theme.colors.primary}10;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.typography.sizes.xs};
  }
`;

const TabContent = styled.div`
  min-height: 400px;
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const QuickActionCard = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.primary};
    box-shadow: ${theme.shadows.sm};
  }
`;

const QuickActionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
`;

const QuickActionIcon = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.lg};
  background: ${props => props.color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
`;

const QuickActionTitle = styled.h3`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const QuickActionDescription = styled.p`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.secondary};
  margin: 0 0 ${theme.spacing.md} 0;
  line-height: 1.4;
`;

const QuickActionButton = styled.button`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${theme.colors.primary}dd;
  }
`;

const Integrations: React.FC = () => {
  const [activeTab, setActiveTab] = useState('settings');

  const tabs = [
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'campaigns', label: 'Campanhas de Email', icon: Mail },
    { id: 'teleconsulta', label: 'Teleconsultas', icon: Video }
  ];

  const quickActions = [
    {
      id: 'calendar',
      title: 'Sincronizar Calendário',
      description: 'Conecte seu Google Calendar ou Outlook para sincronizar automaticamente os agendamentos.',
      icon: Calendar,
      color: theme.colors.primary,
      action: () => setActiveTab('settings')
    },
    {
      id: 'sms',
      title: 'Configurar SMS',
      description: 'Configure o gateway de SMS para enviar lembretes automáticos para seus pacientes.',
      icon: MessageSquare,
      color: theme.colors.status.success,
      action: () => setActiveTab('settings')
    },
    {
      id: 'email',
      title: 'Criar Campanha',
      description: 'Crie e gerencie campanhas de email marketing para seus pacientes.',
      icon: Mail,
      color: theme.colors.status.warning,
      action: () => setActiveTab('campaigns')
    },
    {
      id: 'video',
      title: 'Nova Teleconsulta',
      description: 'Crie uma nova reunião online para consultas virtuais.',
      icon: Video,
      color: theme.colors.status.error,
      action: () => setActiveTab('teleconsulta')
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'settings':
        return <IntegrationsSettings />;
      case 'campaigns':
        return <EmailCampaigns />;
      case 'teleconsulta':
        return <TeleconsultaManager />;
      default:
        return <IntegrationsSettings />;
    }
  };

  return (
    <IntegrationsContainer>
      <PageHeader>
        <PageTitle>Integrações Externas</PageTitle>
        <PageDescription>
          Conecte o Serena com ferramentas externas para automatizar tarefas e melhorar a experiência dos pacientes.
        </PageDescription>
      </PageHeader>

      <QuickActions>
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <QuickActionCard key={action.id}>
              <QuickActionHeader>
                <QuickActionIcon color={action.color}>
                  <Icon size={20} />
                </QuickActionIcon>
                <QuickActionTitle>{action.title}</QuickActionTitle>
              </QuickActionHeader>
              <QuickActionDescription>
                {action.description}
              </QuickActionDescription>
              <QuickActionButton onClick={action.action}>
                Configurar
              </QuickActionButton>
            </QuickActionCard>
          );
        })}
      </QuickActions>

      <TabsContainer>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Tab
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              {tab.label}
            </Tab>
          );
        })}
      </TabsContainer>

      <TabContent>
        {renderTabContent()}
      </TabContent>
    </IntegrationsContainer>
  );
};

export default Integrations;
