import React from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Download,
  Filter,
  Eye
} from 'lucide-react';
import { theme } from '../styles/theme';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const ReportsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const PageTitle = styled.h1`
  font-size: ${theme.typography.sizes['3xl']};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  border: none;

  ${props => props.variant === 'primary' ? `
    background: ${theme.colors.primary};
    color: white;

    &:hover {
      background: ${theme.colors.accent};
    }
  ` : `
    background: ${theme.colors.surface};
    color: ${theme.colors.text.primary};
    border: 1px solid ${theme.colors.border};

    &:hover {
      background: ${theme.colors.background};
    }
  `}
`;

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
`;

const ReportCard = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.md};
  border: 1px solid ${theme.colors.border};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.lg};
`;

const ReportIcon = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.lg};
  background: ${props => props.color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
`;

const ReportTitle = styled.h3`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.sm} 0;
`;

const ReportDescription = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.sm};
  margin: 0;
  line-height: 1.5;
`;

const ReportActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.lg};
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  border: none;

  ${props => props.variant === 'primary' ? `
    background: ${theme.colors.primary};
    color: white;

    &:hover {
      background: ${theme.colors.accent};
    }
  ` : `
    background: ${theme.colors.background};
    color: ${theme.colors.text.primary};
    border: 1px solid ${theme.colors.border};

    &:hover {
      background: ${theme.colors.surface};
    }
  `}
`;

const ChartPlaceholder = styled.div`
  height: 200px;
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.sm};
  margin: ${theme.spacing.lg} 0;
  border: 2px dashed ${theme.colors.border};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
  margin: ${theme.spacing.lg} 0;
`;

const StatItem = styled.div`
  text-align: center;
  padding: ${theme.spacing.md};
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md};
`;

const StatValue = styled.div`
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.weights.medium};
`;

const Reports: React.FC = () => {
  const { state } = useApp();
  const { state: authState } = useAuth();

  // Calcular estatísticas reais
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const sessionsThisMonth = state.sessions.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear;
  });

  const revenueThisMonth = state.payments
    .filter(payment => {
      const paymentDate = new Date(payment.date);
      return paymentDate.getMonth() === currentMonth &&
        paymentDate.getFullYear() === currentYear &&
        payment.status === 'pago';
    })
    .reduce((total, payment) => total + payment.amount, 0);

  const totalRevenue = state.payments
    .filter(payment => payment.status === 'pago')
    .reduce((total, payment) => total + payment.amount, 0);

  const pendingPayments = state.payments.filter(p => p.status === 'pendente').length;
  const overduePayments = state.payments.filter(p => p.status === 'atrasado').length;

  // Calcular evolução dos pacientes
  const patientsWithSessions = state.patients.filter(patient =>
    state.sessions.some(session => session.patientId === patient.id)
  );

  const averageMood = state.sessions.length > 0
    ? state.sessions.reduce((sum, session) => sum + session.mood, 0) / state.sessions.length
    : 0;

  const handleExportReport = (reportType: string) => {
    let data = '';
    let filename = '';

    switch (reportType) {
      case 'financial':
        data = `Relatório Financeiro - ${authState.user?.name}\n\n` +
          `Receita Total: R$ ${totalRevenue.toLocaleString('pt-BR')}\n` +
          `Receita Este Mês: R$ ${revenueThisMonth.toLocaleString('pt-BR')}\n` +
          `Pagamentos Pendentes: ${pendingPayments}\n` +
          `Pagamentos Atrasados: ${overduePayments}\n\n` +
          `Detalhamento dos Pagamentos:\n` +
          state.payments.map(payment =>
            `- ${new Date(payment.date).toLocaleDateString('pt-BR')}: R$ ${payment.amount.toLocaleString('pt-BR')} (${payment.status})`
          ).join('\n');
        filename = `relatorio_financeiro_${new Date().toISOString().split('T')[0]}.txt`;
        break;

      case 'patients':
        data = `Relatório de Pacientes - ${authState.user?.name}\n\n` +
          `Total de Pacientes: ${state.patients.length}\n` +
          `Pacientes com Sessões: ${patientsWithSessions.length}\n\n` +
          `Lista de Pacientes:\n` +
          state.patients.map(patient =>
            `- ${patient.name} (${patient.age} anos) - ${patient.email}`
          ).join('\n');
        filename = `relatorio_pacientes_${new Date().toISOString().split('T')[0]}.txt`;
        break;

      case 'sessions':
        data = `Relatório de Sessões - ${authState.user?.name}\n\n` +
          `Total de Sessões: ${state.sessions.length}\n` +
          `Sessões Este Mês: ${sessionsThisMonth.length}\n` +
          `Humor Médio: ${averageMood.toFixed(1)}/10\n\n` +
          `Detalhamento das Sessões:\n` +
          state.sessions.map(session => {
            const patient = state.patients.find(p => p.id === session.patientId);
            return `- ${new Date(session.date).toLocaleDateString('pt-BR')}: ${patient?.name || 'Paciente não encontrado'} - Humor: ${session.mood}/10`;
          }).join('\n');
        filename = `relatorio_sessoes_${new Date().toISOString().split('T')[0]}.txt`;
        break;

      case 'evolution':
        data = `Relatório de Evolução - ${authState.user?.name}\n\n` +
          `Humor Médio Geral: ${averageMood.toFixed(1)}/10\n` +
          `Sessões Realizadas: ${state.sessions.length}\n` +
          `Pacientes Ativos: ${patientsWithSessions.length}\n\n` +
          `Evolução por Paciente:\n` +
          patientsWithSessions.map(patient => {
            const patientSessions = state.sessions.filter(s => s.patientId === patient.id);
            const firstMood = patientSessions[0]?.mood || 0;
            const lastMood = patientSessions[patientSessions.length - 1]?.mood || 0;
            const improvement = lastMood - firstMood;
            return `- ${patient.name}: ${firstMood}/10 → ${lastMood}/10 (${improvement > 0 ? '+' : ''}${improvement.toFixed(1)})`;
          }).join('\n');
        filename = `relatorio_evolucao_${new Date().toISOString().split('T')[0]}.txt`;
        break;
    }

    // Criar e baixar arquivo
    const blob = new Blob([data], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success(`Relatório ${reportType} exportado com sucesso!`);
  };

  const reports = [
    {
      id: '1',
      title: 'Relatório Financeiro',
      description: 'Análise de receitas, despesas e lucratividade do consultório',
      icon: DollarSign,
      color: theme.colors.status.success,
      stats: [
        { label: 'Receita Total', value: `R$ ${totalRevenue.toLocaleString('pt-BR')}` },
        { label: 'Este Mês', value: `R$ ${revenueThisMonth.toLocaleString('pt-BR')}` },
        { label: 'Pendentes', value: pendingPayments.toString() }
      ]
    },
    {
      id: '2',
      title: 'Relatório de Pacientes',
      description: 'Estatísticas sobre pacientes ativos, novos e evolução do tratamento',
      icon: Users,
      color: theme.colors.primary,
      stats: [
        { label: 'Total', value: state.patients.length.toString() },
        { label: 'Com Sessões', value: patientsWithSessions.length.toString() },
        { label: 'Taxa Ativa', value: state.patients.length > 0 ? `${Math.round((patientsWithSessions.length / state.patients.length) * 100)}%` : '0%' }
      ]
    },
    {
      id: '3',
      title: 'Relatório de Sessões',
      description: 'Análise de frequência, tipos de sessão e evolução clínica',
      icon: Calendar,
      color: theme.colors.accent,
      stats: [
        { label: 'Total', value: state.sessions.length.toString() },
        { label: 'Este Mês', value: sessionsThisMonth.length.toString() },
        { label: 'Humor Médio', value: `${averageMood.toFixed(1)}/10` }
      ]
    },
    {
      id: '4',
      title: 'Relatório de Evolução',
      description: 'Acompanhamento do progresso dos pacientes e eficácia do tratamento',
      icon: TrendingUp,
      color: theme.colors.secondary,
      stats: [
        { label: 'Humor Médio', value: `${averageMood.toFixed(1)}/10` },
        { label: 'Pacientes Ativos', value: patientsWithSessions.length.toString() },
        { label: 'Sessões Totais', value: state.sessions.length.toString() }
      ]
    }
  ];

  return (
    <ReportsContainer>
      <PageHeader>
        <PageTitle>Relatórios</PageTitle>
        <HeaderActions>
          <Button variant="secondary">
            <Filter size={20} />
            Filtros
          </Button>
          <Button variant="primary">
            <Download size={20} />
            Exportar Todos
          </Button>
        </HeaderActions>
      </PageHeader>

      <ReportsGrid>
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <ReportCard key={report.id}>
              <ReportHeader>
                <div>
                  <ReportTitle>{report.title}</ReportTitle>
                  <ReportDescription>{report.description}</ReportDescription>
                </div>
                <ReportIcon color={report.color}>
                  <Icon size={24} />
                </ReportIcon>
              </ReportHeader>

              <ChartPlaceholder>
                Gráfico de {report.title.toLowerCase()}
              </ChartPlaceholder>

              <StatsGrid>
                {report.stats.map((stat, index) => (
                  <StatItem key={index}>
                    <StatValue>{stat.value}</StatValue>
                    <StatLabel>{stat.label}</StatLabel>
                  </StatItem>
                ))}
              </StatsGrid>

              <ReportActions>
                <ActionButton variant="secondary">
                  <Eye size={16} />
                  Visualizar
                </ActionButton>
                <ActionButton variant="primary" onClick={() => handleExportReport(report.id === '1' ? 'financial' : report.id === '2' ? 'patients' : report.id === '3' ? 'sessions' : 'evolution')}>
                  <Download size={16} />
                  Exportar
                </ActionButton>
              </ReportActions>
            </ReportCard>
          );
        })}
      </ReportsGrid>
    </ReportsContainer>
  );
};

export default Reports;
