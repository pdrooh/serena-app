import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { Database, Trash2, Download, AlertTriangle } from 'lucide-react';
import { theme } from '../styles/theme';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { hybridApiService } from '../services/hybridApi';

const DemoManagerContainer = styled.div`
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

const SectionTitle = styled.h2`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.lg} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const Description = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.sm};
  margin: 0 0 ${theme.spacing.lg} 0;
  line-height: 1.6;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const ActionButton = styled.button<{ variant: 'primary' | 'secondary' | 'danger' }>`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  border: none;
  font-size: ${theme.typography.sizes.sm};

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary};
          color: white;
          &:hover {
            background: ${theme.colors.accent};
          }
        `;
      case 'danger':
        return `
          background: ${theme.colors.status.error};
          color: white;
          &:hover {
            background: #c0392b;
          }
        `;
      default:
        return `
          background: ${theme.colors.surface};
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.border};
          &:hover {
            background: ${theme.colors.background};
          }
        `;
    }
  }}

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    justify-content: center;
  }
`;

const WarningBox = styled.div`
  background: ${theme.colors.status.warning}20;
  border: 1px solid ${theme.colors.status.warning};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const WarningText = styled.span`
  color: ${theme.colors.status.warning};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  text-align: center;
  border: 1px solid ${theme.colors.border};
`;

const StatValue = styled.div`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.weights.medium};
`;

const DemoDataManager: React.FC = () => {
  const { state } = useApp();
  const { state: authState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const isAdmin = authState.user?.email === 'admin@serena.com';
  const hasData = state.patients.length > 0 || state.sessions.length > 0 ||
    state.appointments.length > 0 || state.payments.length > 0;

  const handleLoadDemoData = async () => {
    setIsLoading(true);
    try {
      const success = hybridApiService.initializeDemoData();
      if (success) {
        toast.success('Dados de demonstração carregados com sucesso!');
        // Recarregar a página para atualizar os dados
        window.location.reload();
      } else {
        toast.error('Apenas administradores podem carregar dados de demonstração');
      }
    } catch (error) {
      toast.error('Erro ao carregar dados de demonstração');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = async () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      setIsLoading(true);
      try {
        hybridApiService.clearDemoData();
        toast.success('Dados limpos com sucesso!');
        // Recarregar a página para atualizar os dados
        window.location.reload();
      } catch (error) {
        toast.error('Erro ao limpar dados');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleExportData = () => {
    const data = {
      patients: state.patients,
      sessions: state.sessions,
      appointments: state.appointments,
      payments: state.payments,
      exportedAt: new Date().toISOString(),
      exportedBy: authState.user?.name || 'Usuário'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `serena_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success('Dados exportados com sucesso!');
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <DemoManagerContainer>
      <SectionTitle>
        <Database size={24} />
        Gerenciamento de Dados
      </SectionTitle>

      <Description>
        Como administrador, você pode gerenciar os dados de demonstração e fazer backup das informações.
      </Description>

      {hasData && (
        <WarningBox>
          <AlertTriangle size={20} />
          <WarningText>
            Você tem dados no sistema. Use com cuidado as opções abaixo.
          </WarningText>
        </WarningBox>
      )}

      <StatsGrid>
        <StatCard>
          <StatValue>{state.patients.length}</StatValue>
          <StatLabel>Pacientes</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{state.sessions.length}</StatValue>
          <StatLabel>Sessões</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{state.appointments.length}</StatValue>
          <StatLabel>Agendamentos</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{state.payments.length}</StatValue>
          <StatLabel>Pagamentos</StatLabel>
        </StatCard>
      </StatsGrid>

      <ActionsGrid>
        <ActionButton
          variant="primary"
          onClick={handleLoadDemoData}
          disabled={isLoading}
        >
          <Database size={16} />
          Carregar Dados Demo
        </ActionButton>

        <ActionButton
          variant="secondary"
          onClick={handleExportData}
          disabled={!hasData || isLoading}
        >
          <Download size={16} />
          Exportar Dados
        </ActionButton>

        <ActionButton
          variant="danger"
          onClick={handleClearData}
          disabled={!hasData || isLoading}
        >
          <Trash2 size={16} />
          Limpar Todos os Dados
        </ActionButton>
      </ActionsGrid>
    </DemoManagerContainer>
  );
};

export default DemoDataManager;



