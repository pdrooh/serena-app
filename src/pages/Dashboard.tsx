import React from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  Plus,
  Eye
} from 'lucide-react';
import { theme } from '../styles/theme';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import DemoDataManager from '../components/DemoDataManager';
import AppointmentReminders from '../components/Notifications/AppointmentReminders';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.background};
  min-height: calc(100vh - 60px);

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
    gap: ${theme.spacing.lg};
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.spacing.sm};
  }
`;

const PageTitle = styled.h1`
  font-size: ${theme.typography.sizes['3xl']};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes['2xl']};
  }
`;

const WelcomeMessage = styled.p`
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.text.secondary};
  margin: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes.base};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.lg};
  }
`;

const StatCard = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.lg};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;

  &:hover {
    border-color: ${theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.xl};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.lg};
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const StatIcon = styled.div<{ color: string }>`
  background-color: ${props => props.color}20;
  color: ${props => props.color};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const StatValue = styled.span`
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.text.primary};
`;

const StatLabel = styled.span`
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.weights.medium};
`;

const StatChange = styled.div<{ positive?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.typography.sizes.sm};
  color: ${props => props.positive ? theme.colors.status.success : theme.colors.text.secondary};
  font-weight: ${theme.typography.weights.medium};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
  }
`;

const Section = styled.section`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.lg};
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.spacing.sm};
  }
`;

const SectionTitle = styled.h2`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const ActionButton = styled.button`
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.secondary};
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md};
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${theme.colors.primary}10;
    border-color: ${theme.colors.primary};
  }
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const ItemTitle = styled.span`
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.text.primary};
`;

const ItemSubtitle = styled.span`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.secondary};
`;

const ItemStatus = styled.span<{ status: string }>`
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  color: ${props => {
    switch (props.status) {
      case 'agendado': return theme.colors.status.info;
      case 'confirmado': return theme.colors.status.success;
      case 'realizado': return theme.colors.primary;
      case 'cancelado': return theme.colors.status.error;
      case 'pago': return theme.colors.status.success;
      case 'pendente': return theme.colors.status.warning;
      case 'atrasado': return theme.colors.status.error;
      default: return theme.colors.text.secondary;
    }
  }};
  text-transform: capitalize;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.text.secondary};
  font-style: italic;
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.sm};
    margin-top: ${theme.spacing.lg};
  }
`;

const QuickActionCard = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.lg};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;

  &:hover {
    border-color: ${theme.colors.primary};
    transform: translateY(-2px);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
  }
`;

const QuickActionIcon = styled.div`
  background: ${theme.colors.primary}20;
  color: ${theme.colors.primary};
  border-radius: ${theme.borderRadius.full};
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 50px;
    height: 50px;
  }
`;

const QuickActionTitle = styled.h3`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.sm} 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes.base};
  }
`;

const QuickActionDescription = styled.p`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.secondary};
  margin: 0;
`;


const Dashboard: React.FC = () => {
  const { state } = useApp();
  const { state: authState } = useAuth();
  const navigate = useNavigate();

  // Verificação de segurança para evitar erros quando state ainda não foi carregado
  if (!state || !state.patients || !state.sessions || !state.payments || !state.appointments) {
    return (
      <DashboardContainer>
        <PageHeader>
          <PageTitle>Dashboard</PageTitle>
        </PageHeader>
        <div style={{ textAlign: 'center', padding: '2rem', color: theme.colors.text.secondary }}>
          <p>Carregando dashboard...</p>
        </div>
      </DashboardContainer>
    );
  }

  // Calcular estatísticas
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

  const upcomingAppointments = state.appointments
    .filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= new Date() &&
        (appointment.status === 'agendado' || appointment.status === 'confirmado');
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const pendingPayments = state.payments
    .filter(payment => payment.status === 'pendente' || payment.status === 'atrasado')
    .slice(0, 5);

  const stats = {
    totalPatients: state.patients.length,
    activePatients: state.patients.length,
    sessionsThisMonth: sessionsThisMonth.length,
    revenueThisMonth: revenueThisMonth
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'Novo Paciente':
        navigate('/patients');
        break;
      case 'Nova Sessão':
        navigate('/records');
        break;
      case 'Agendar Consulta':
        navigate('/appointments');
        break;
      case 'Registrar Pagamento':
        navigate('/payments');
        break;
      case 'Agendamentos':
        navigate('/appointments');
        break;
      case 'Pagamentos':
        navigate('/payments');
        break;
      default:
        toast.info(`Funcionalidade ${action} será implementada em breve!`);
    }
  };

  const handleCardClick = (cardType: string) => {
    switch (cardType) {
      case 'patients':
        navigate('/patients');
        break;
      case 'sessions':
        navigate('/records');
        break;
      case 'appointments':
        navigate('/appointments');
        break;
      case 'payments':
        navigate('/payments');
        break;
      default:
        break;
    }
  };

  return (
    <DashboardContainer>
      <PageHeader>
        <div>
          <PageTitle>Dashboard</PageTitle>
          <WelcomeMessage>
            Bem-vinda de volta, {authState.user?.name || 'Dra.'}! Aqui está um resumo do seu consultório.
          </WelcomeMessage>
        </div>
      </PageHeader>

      <DemoDataManager />

      <StatsGrid>
        <StatCard onClick={() => handleCardClick('patients')}>
          <StatHeader>
            <StatIcon color={theme.colors.primary}>
              <Users size={24} />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.totalPatients}</StatValue>
              <StatLabel>Total de Pacientes</StatLabel>
            </StatContent>
          </StatHeader>
          <StatChange positive>
            <TrendingUp size={16} />
            {stats.totalPatients > 0 ? 'Crescendo' : 'Sem pacientes'}
          </StatChange>
        </StatCard>

        <StatCard onClick={() => handleCardClick('sessions')}>
          <StatHeader>
            <StatIcon color={theme.colors.status.success}>
              <Calendar size={24} />
            </StatIcon>
            <StatContent>
              <StatValue>{stats.sessionsThisMonth}</StatValue>
              <StatLabel>Sessões Este Mês</StatLabel>
            </StatContent>
          </StatHeader>
          <StatChange positive>
            <TrendingUp size={16} />
            {stats.sessionsThisMonth > 0 ? 'Em andamento' : 'Sem sessões'}
          </StatChange>
        </StatCard>

        <StatCard onClick={() => handleCardClick('appointments')}>
          <StatHeader>
            <StatIcon color={theme.colors.accent}>
              <Clock size={24} />
            </StatIcon>
            <StatContent>
              <StatValue>{upcomingAppointments.length}</StatValue>
              <StatLabel>Próximas Consultas</StatLabel>
            </StatContent>
          </StatHeader>
          <StatChange positive>
            <TrendingUp size={16} />
            {upcomingAppointments.length > 0 ? 'Agendadas' : 'Sem agendamentos'}
          </StatChange>
        </StatCard>

        <StatCard onClick={() => handleCardClick('payments')}>
          <StatHeader>
            <StatIcon color={theme.colors.status.success}>
              <DollarSign size={24} />
            </StatIcon>
            <StatContent>
              <StatValue>R$ {stats.revenueThisMonth.toLocaleString('pt-BR')}</StatValue>
              <StatLabel>Receita Este Mês</StatLabel>
            </StatContent>
          </StatHeader>
          <StatChange positive>
            <TrendingUp size={16} />
            {stats.revenueThisMonth > 0 ? 'Crescendo' : 'Sem receita'}
          </StatChange>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <Section>
          <SectionHeader>
            <SectionTitle>Próximas Consultas</SectionTitle>
            <ActionButton onClick={() => handleQuickAction('Agendamentos')}>
              <Plus size={16} />
              Nova Consulta
            </ActionButton>
          </SectionHeader>

          {upcomingAppointments.length > 0 ? (
            <List>
              {upcomingAppointments.map((appointment) => {
                const patient = state.patients.find(p => p.id === appointment.patientId);
                return (
                  <ListItem
                    key={appointment.id}
                    onClick={() => navigate('/appointments')}
                  >
                    <ItemInfo>
                      <ItemTitle>{patient?.name || 'Paciente não encontrado'}</ItemTitle>
                      <ItemSubtitle>
                        {new Date(appointment.date).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(appointment.date).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {appointment.type}
                      </ItemSubtitle>
                    </ItemInfo>
                    <ItemStatus status={appointment.status}>
                      {appointment.status}
                    </ItemStatus>
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <EmptyState>Nenhuma consulta agendada</EmptyState>
          )}
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>Pagamentos Pendentes</SectionTitle>
            <ActionButton onClick={() => handleQuickAction('Pagamentos')}>
              <Eye size={16} />
              Ver Todos
            </ActionButton>
          </SectionHeader>

          {pendingPayments.length > 0 ? (
            <List>
              {pendingPayments.map((payment) => {
                const patient = state.patients.find(p => p.id === payment.patientId);
                return (
                  <ListItem
                    key={payment.id}
                    onClick={() => navigate('/payments')}
                  >
                    <ItemInfo>
                      <ItemTitle>{patient?.name || 'Paciente não encontrado'}</ItemTitle>
                      <ItemSubtitle>
                        R$ {payment.amount.toLocaleString('pt-BR')} - {payment.method}
                      </ItemSubtitle>
                    </ItemInfo>
                    <ItemStatus status={payment.status}>
                      {payment.status}
                    </ItemStatus>
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <EmptyState>Nenhum pagamento pendente</EmptyState>
          )}
        </Section>
      </ContentGrid>

      <AppointmentReminders />

      <QuickActions>
        <QuickActionCard onClick={() => handleQuickAction('Novo Paciente')}>
          <QuickActionIcon>
            <Users size={24} />
          </QuickActionIcon>
          <QuickActionTitle>Novo Paciente</QuickActionTitle>
          <QuickActionDescription>
            Cadastre um novo paciente no sistema
          </QuickActionDescription>
        </QuickActionCard>

        <QuickActionCard onClick={() => handleQuickAction('Nova Sessão')}>
          <QuickActionIcon>
            <Calendar size={24} />
          </QuickActionIcon>
          <QuickActionTitle>Nova Sessão</QuickActionTitle>
          <QuickActionDescription>
            Registre uma nova sessão de terapia
          </QuickActionDescription>
        </QuickActionCard>

        <QuickActionCard onClick={() => handleQuickAction('Agendar Consulta')}>
          <QuickActionIcon>
            <Clock size={24} />
          </QuickActionIcon>
          <QuickActionTitle>Agendar Consulta</QuickActionTitle>
          <QuickActionDescription>
            Agende uma nova consulta com paciente
          </QuickActionDescription>
        </QuickActionCard>

        <QuickActionCard onClick={() => handleQuickAction('Registrar Pagamento')}>
          <QuickActionIcon>
            <DollarSign size={24} />
          </QuickActionIcon>
          <QuickActionTitle>Registrar Pagamento</QuickActionTitle>
          <QuickActionDescription>
            Registre um novo pagamento recebido
          </QuickActionDescription>
        </QuickActionCard>
      </QuickActions>

    </DashboardContainer>
  );
};

export default Dashboard;
