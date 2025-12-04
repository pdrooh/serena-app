import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import {
  User,
  Calendar,
  FileText,
  MessageCircle,
  Download,
  Eye,
  Plus,
  Settings,
} from 'lucide-react';
import { theme } from '../styles/theme';
import { useApp } from '../context/AppContext';

const PatientPortalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
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
    gap: ${theme.spacing.md};
    align-items: stretch;
  }
`;

const PageTitle = styled.h1`
  font-size: ${theme.typography.sizes['3xl']};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes['2xl']};
    text-align: center;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: center;

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${theme.spacing.sm};
  }
`;

const SearchInput = styled.input`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.base};
  min-width: 250px;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    min-width: 100%;
    font-size: ${theme.typography.sizes.sm};
    padding: ${theme.spacing.sm};
  }
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

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.typography.sizes.sm};
    justify-content: center;
  }
`;

const PortalGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: ${theme.spacing.md};
  }
`;

const PortalSection = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.md};
  border: 1px solid ${theme.colors.border};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.lg};
    border-radius: ${theme.borderRadius.md};
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

const PatientCard = styled.div`
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  border: 1px solid ${theme.colors.border};
`;

const PatientInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
`;

const PatientAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${theme.borderRadius.full};
  background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${theme.typography.weights.bold};
  font-size: ${theme.typography.sizes.lg};
`;

const PatientDetails = styled.div`
  flex: 1;
`;

const PatientName = styled.h3`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.xs} 0;
`;

const PatientEmail = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.sm};
  margin: 0;
`;

const AccessButton = styled.button`
  width: 100%;
  padding: ${theme.spacing.md};
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};

  &:hover {
    background: ${theme.colors.accent};
  }
`;

const UpcomingAppointments = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;


// Componentes não utilizados removidos

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
  border: none;
  font-size: ${theme.typography.sizes.sm};

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

// Componentes não utilizados removidos

// Modal de Detalhes do Paciente
const PatientDetailsModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  padding: ${theme.spacing.xl};
  overflow-y: auto;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm};
    padding-top: ${theme.spacing.xl};
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.md};
  max-width: 1600px;
  width: 98%;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${theme.spacing.sm};
    align-items: stretch;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    margin-bottom: ${theme.spacing.sm};
  }
`;

const ModalTitle = styled.h2`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes.lg};
    text-align: center;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.text.secondary};
  padding: ${theme.spacing.sm};
  font-size: ${theme.typography.sizes.lg};

  &:hover {
    color: ${theme.colors.status.error};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    align-self: flex-end;
  }
`;

const ModalContent = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  max-width: 1600px;
  width: 98%;
  max-height: calc(90vh - 100px);
  margin: 0 auto;
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    width: 100%;
    max-height: calc(90vh - 80px);
  }
`;

const ModalMainContent = styled.div`
  flex: 1;
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  overflow-y: auto;
  box-shadow: ${theme.shadows.xl};
  max-height: calc(90vh - 100px);
  display: flex;
  flex-direction: column;

  @media (max-width: ${theme.breakpoints.tablet}) {
    max-height: 50vh;
    padding: ${theme.spacing.md};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
    border-radius: ${theme.borderRadius.md};
    max-height: 40vh;
  }
`;

const ModalSidebar = styled.div`
  width: 320px;
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  box-shadow: ${theme.shadows.xl};
  max-height: calc(90vh - 100px);
  overflow-y: auto;

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 100%;
    max-height: calc(40vh - 20px);
    padding: ${theme.spacing.md};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
    border-radius: ${theme.borderRadius.md};
    max-height: 35vh;
  }
`;

const PatientInfoSection = styled.div`
  margin-bottom: ${theme.spacing.lg};

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoTitle = styled.h3`
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
  padding-bottom: ${theme.spacing.xs};
  border-bottom: 2px solid ${theme.colors.primary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  &::before {
    content: '';
    width: 3px;
    height: 16px;
    background: ${theme.colors.primary};
    border-radius: ${theme.borderRadius.sm};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes.sm};
    margin-bottom: ${theme.spacing.sm};
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${theme.spacing.sm};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.sm};
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.sm};
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.border};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.xs};
  }
`;

const InfoLabel = styled.span`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.weights.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.span`
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.text.primary};
  font-weight: ${theme.typography.weights.medium};
`;

const SessionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  max-height: 200px;
  overflow-y: auto;
`;

const SessionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.primary};
    box-shadow: 0 2px 8px rgba(74, 144, 226, 0.1);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.spacing.xs};
    padding: ${theme.spacing.sm};
  }
`;

const SessionDate = styled.span`
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.text.primary};
  font-weight: ${theme.typography.weights.medium};
`;

const SessionDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${theme.spacing.xs};

  @media (max-width: ${theme.breakpoints.mobile}) {
    align-items: flex-start;
    width: 100%;
  }
`;

const SessionMood = styled.span`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.primary};
  font-weight: ${theme.typography.weights.semibold};
  background: ${theme.colors.primary}20;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
`;

const SessionType = styled.span`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.secondary};
  text-transform: capitalize;
  font-weight: ${theme.typography.weights.medium};
`;

const AppointmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  max-height: 200px;
  overflow-y: auto;
`;

const AppointmentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.primary};
    box-shadow: 0 2px 8px rgba(74, 144, 226, 0.1);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.spacing.xs};
    padding: ${theme.spacing.sm};
  }
`;

const AppointmentDate = styled.span`
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.text.primary};
  font-weight: ${theme.typography.weights.medium};
`;

const AppointmentDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${theme.spacing.xs};

  @media (max-width: ${theme.breakpoints.mobile}) {
    align-items: flex-start;
    width: 100%;
  }
`;

const AppointmentStatus = styled.span<{ status: string }>`
  font-size: ${theme.typography.sizes.sm};
  color: ${props => {
    switch (props.status) {
      case 'agendado': return theme.colors.status.info;
      case 'confirmado': return theme.colors.status.success;
      case 'realizado': return theme.colors.primary;
      case 'cancelado': return theme.colors.status.error;
      default: return theme.colors.text.secondary;
    }
  }};
  font-weight: ${theme.typography.weights.semibold};
  text-transform: capitalize;
  background: ${props => {
    switch (props.status) {
      case 'agendado': return theme.colors.status.info + '20';
      case 'confirmado': return theme.colors.status.success + '20';
      case 'realizado': return theme.colors.primary + '20';
      case 'cancelado': return theme.colors.status.error + '20';
      default: return theme.colors.text.secondary + '20';
    }
  }};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
`;

const AppointmentType = styled.span`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.secondary};
  text-transform: capitalize;
  font-weight: ${theme.typography.weights.medium};
`;

const AppointmentTime = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
`;


const PaymentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  max-height: 200px;
  overflow-y: auto;
`;

const PaymentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.primary};
    box-shadow: 0 2px 8px rgba(74, 144, 226, 0.1);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.spacing.xs};
    padding: ${theme.spacing.sm};
  }
`;

const PaymentDate = styled.span`
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.text.primary};
  font-weight: ${theme.typography.weights.medium};
`;

const PaymentDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${theme.spacing.xs};

  @media (max-width: ${theme.breakpoints.mobile}) {
    align-items: flex-start;
    width: 100%;
  }
`;

const PaymentAmount = styled.span`
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.status.success};
  font-weight: ${theme.typography.weights.bold};
`;

const PaymentStatus = styled.span<{ status: string }>`
  font-size: ${theme.typography.sizes.sm};
  color: ${props => {
    switch (props.status) {
      case 'pago': return theme.colors.status.success;
      case 'pendente': return theme.colors.status.warning;
      case 'atrasado': return theme.colors.status.error;
      default: return theme.colors.text.secondary;
    }
  }};
  text-transform: capitalize;
  font-weight: ${theme.typography.weights.semibold};
  background: ${props => {
    switch (props.status) {
      case 'pago': return theme.colors.status.success + '20';
      case 'pendente': return theme.colors.status.warning + '20';
      case 'atrasado': return theme.colors.status.error + '20';
      default: return theme.colors.text.secondary + '20';
    }
  }};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.md};
  color: ${theme.colors.text.secondary};
  font-style: italic;
  font-size: ${theme.typography.sizes.sm};
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.sm};
  border: 1px dashed ${theme.colors.border};
  margin: ${theme.spacing.sm} 0;
`;


const SidebarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const SidebarTitle = styled.h3`
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const UpcomingAppointmentItem = styled.div`
  padding: ${theme.spacing.sm};
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.border};
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.text.primary};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${theme.spacing.sm};
  }
`;

const StatCard = styled.div`
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  text-align: center;
  border: 1px solid ${theme.colors.border};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm};
  }
`;

const StatValue = styled.div`
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.xs};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes.xl};
  }
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.weights.medium};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes.xs};
  }
`;


const PatientPortal: React.FC = () => {
  const { state } = useApp();
  // authState não utilizado - removido
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPatientDetails, setShowPatientDetails] = useState(false);

  const handleDownloadReport = (patientId: string) => {
    const patient = state.patients.find(p => p.id === patientId);
    if (!patient) return;

    const patientSessions = state.sessions.filter(s => s.patientId === patientId);
    const patientAppointments = state.appointments.filter(a => a.patientId === patientId);
    const patientPayments = state.payments.filter(p => p.patientId === patientId);

    const reportData = `Relatório do Paciente - ${patient.name}\n\n` +
      `Dados Pessoais:\n` +
      `- Nome: ${patient.name}\n` +
      `- Idade: ${patient.age} anos\n` +
      `- Email: ${patient.email}\n` +
      `- Telefone: ${patient.phone}\n` +
      `- Endereço: ${patient.address || 'Não informado'}\n\n` +
      `Sessões Realizadas: ${patientSessions.length}\n` +
      patientSessions.map(session =>
        `- ${new Date(session.date).toLocaleDateString('pt-BR')}: Humor ${session.mood}/10 - ${session.type}`
      ).join('\n') + '\n\n' +
      `Agendamentos: ${patientAppointments.length}\n` +
      patientAppointments.map(appointment =>
        `- ${new Date(appointment.date).toLocaleDateString('pt-BR')}: ${appointment.status} - ${appointment.type}`
      ).join('\n') + '\n\n' +
      `Pagamentos: ${patientPayments.length}\n` +
      patientPayments.map(payment =>
        `- ${new Date(payment.date).toLocaleDateString('pt-BR')}: R$ ${payment.amount.toLocaleString('pt-BR')} - ${payment.status}`
      ).join('\n');

    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_${patient.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success(`Relatório de ${patient.name} baixado com sucesso!`);
  };

  const handleViewPatientDetails = (patientId: string) => {
    setSelectedPatient(patientId);
    setShowPatientDetails(true);
  };

  const handleSendMessage = (patientId: string) => {
    const patient = state.patients.find(p => p.id === patientId);
    if (patient) {
      toast.success(`Mensagem enviada para ${patient.name}!`);
    }
  };

  const handleScheduleAppointment = (patientId: string) => {
    const patient = state.patients.find(p => p.id === patientId);
    if (patient) {
      toast.success(`Agendamento criado para ${patient.name}!`);
    }
  };

  const filteredPatients = state.patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedPatientData = selectedPatient ? state.patients.find(p => p.id === selectedPatient) : null;
  const selectedPatientSessions = selectedPatient ? state.sessions.filter(s => s.patientId === selectedPatient) : [];
  const selectedPatientAppointments = selectedPatient ? state.appointments.filter(a => a.patientId === selectedPatient) : [];
  const selectedPatientPayments = selectedPatient ? state.payments.filter(p => p.patientId === selectedPatient) : [];

  return (
    <PatientPortalContainer>
      <PageHeader>
        <PageTitle>Portal do Paciente</PageTitle>
        <HeaderActions>
          <SearchInput
            type="text"
            placeholder="Buscar pacientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="secondary">
            <Settings size={20} />
            Configurações
          </Button>
          <Button variant="primary">
            <Plus size={20} />
            Novo Portal
          </Button>
        </HeaderActions>
      </PageHeader>

      <PortalGrid>
        <PortalSection>
          <SectionTitle>
            <User size={24} />
            Pacientes com Portal Ativo
          </SectionTitle>

          {filteredPatients.map((patient) => (
            <PatientCard key={patient.id}>
              <PatientInfo>
                <PatientAvatar>{patient.name.charAt(0).toUpperCase()}</PatientAvatar>
                <PatientDetails>
                  <PatientName>{patient.name}</PatientName>
                  <PatientEmail>{patient.email}</PatientEmail>
                </PatientDetails>
              </PatientInfo>
              <AccessButton onClick={() => handleViewPatientDetails(patient.id)}>
                <Eye size={16} />
                Acessar Portal
              </AccessButton>
            </PatientCard>
          ))}
        </PortalSection>

        <PortalSection>
          <SectionTitle>
            <Calendar size={24} />
            Próximas Consultas
          </SectionTitle>

          <UpcomingAppointments>
            {state.appointments
              .filter(appointment => appointment.status === 'agendado' || appointment.status === 'confirmado')
              .slice(0, 3)
              .map((appointment) => {
                const patient = state.patients.find(p => p.id === appointment.patientId);
                return (
                  <AppointmentItem key={appointment.id}>
                    <AppointmentDate>{patient?.name || 'Paciente não encontrado'}</AppointmentDate>
                    <AppointmentTime>
                      {new Date(appointment.date).toLocaleDateString('pt-BR')} às {new Date(appointment.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - {appointment.type}
                    </AppointmentTime>
                  </AppointmentItem>
                );
              })}
          </UpcomingAppointments>
        </PortalSection>

        <PortalSection>
          <SectionTitle>
            <FileText size={24} />
            Estatísticas dos Pacientes
          </SectionTitle>

          <StatsGrid>
            <StatCard>
              <StatValue>{state.patients.length}</StatValue>
              <StatLabel>Total de Pacientes</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{state.sessions.length}</StatValue>
              <StatLabel>Sessões Realizadas</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{state.appointments.filter(a => a.status === 'agendado' || a.status === 'confirmado').length}</StatValue>
              <StatLabel>Consultas Agendadas</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>R$ {state.payments.filter(p => p.status === 'pago').reduce((total, payment) => total + payment.amount, 0).toLocaleString('pt-BR')}</StatValue>
              <StatLabel>Receita Total</StatLabel>
            </StatCard>
          </StatsGrid>
        </PortalSection>

        <PortalSection>
          <SectionTitle>
            <MessageCircle size={24} />
            Resumo de Sessões Recentes
          </SectionTitle>

          <SessionsList>
            {state.sessions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 3)
              .map((session) => {
                const patient = state.patients.find(p => p.id === session.patientId);
                return (
                  <SessionItem key={session.id}>
                    <SessionDate>{new Date(session.date).toLocaleDateString('pt-BR')}</SessionDate>
                    <SessionDetails>
                      <SessionMood>Humor: {session.mood}/10</SessionMood>
                      <SessionType>{session.type} - {patient?.name}</SessionType>
                    </SessionDetails>
                  </SessionItem>
                );
              })}
          </SessionsList>
        </PortalSection>
      </PortalGrid>

      {/* Modal de Detalhes do Paciente */}
      {showPatientDetails && selectedPatientData && (
        <PatientDetailsModal onClick={(e) => e.target === e.currentTarget && setShowPatientDetails(false)}>
          <ModalHeader>
            <ModalTitle>Detalhes do Paciente - {selectedPatientData.name}</ModalTitle>
            <CloseButton onClick={() => setShowPatientDetails(false)}>
              ✕
            </CloseButton>
          </ModalHeader>

          <ModalContent>
            <ModalMainContent>
              <PatientInfoSection>
                <InfoTitle>Informações Pessoais</InfoTitle>
                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>NOME:</InfoLabel>
                    <InfoValue>{selectedPatientData.name}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>IDADE:</InfoLabel>
                    <InfoValue>{selectedPatientData.age} anos</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>EMAIL:</InfoLabel>
                    <InfoValue>{selectedPatientData.email}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>TELEFONE:</InfoLabel>
                    <InfoValue>{selectedPatientData.phone}</InfoValue>
                  </InfoItem>
                </InfoGrid>
              </PatientInfoSection>

              <PatientInfoSection>
                <InfoTitle>Sessões Realizadas ({selectedPatientSessions.length})</InfoTitle>
                {selectedPatientSessions.length > 0 ? (
                  <SessionsList>
                    {selectedPatientSessions.map(session => (
                      <SessionItem key={session.id}>
                        <SessionDate>{new Date(session.date).toLocaleDateString('pt-BR')}</SessionDate>
                        <SessionDetails>
                          <SessionMood>Humor: {session.mood}/10</SessionMood>
                          <SessionType>{session.type}</SessionType>
                        </SessionDetails>
                      </SessionItem>
                    ))}
                  </SessionsList>
                ) : (
                  <EmptyMessage>Nenhuma sessão registrada</EmptyMessage>
                )}
              </PatientInfoSection>

              <PatientInfoSection>
                <InfoTitle>Agendamentos ({selectedPatientAppointments.length})</InfoTitle>
                {selectedPatientAppointments.length > 0 ? (
                  <AppointmentsList>
                    {selectedPatientAppointments.map(appointment => (
                      <AppointmentItem key={appointment.id}>
                        <AppointmentDate>{new Date(appointment.date).toLocaleDateString('pt-BR')}</AppointmentDate>
                        <AppointmentDetails>
                          <AppointmentStatus status={appointment.status}>{appointment.status}</AppointmentStatus>
                          <AppointmentType>{appointment.type}</AppointmentType>
                        </AppointmentDetails>
                      </AppointmentItem>
                    ))}
                  </AppointmentsList>
                ) : (
                  <EmptyMessage>Nenhum agendamento</EmptyMessage>
                )}
              </PatientInfoSection>

              <PatientInfoSection>
                <InfoTitle>Pagamentos ({selectedPatientPayments.length})</InfoTitle>
                {selectedPatientPayments.length > 0 ? (
                  <PaymentsList>
                    {selectedPatientPayments.map(payment => (
                      <PaymentItem key={payment.id}>
                        <PaymentDate>{new Date(payment.date).toLocaleDateString('pt-BR')}</PaymentDate>
                        <PaymentDetails>
                          <PaymentAmount>R$ {payment.amount.toLocaleString('pt-BR')}</PaymentAmount>
                          <PaymentStatus status={payment.status}>{payment.status}</PaymentStatus>
                        </PaymentDetails>
                      </PaymentItem>
                    ))}
                  </PaymentsList>
                ) : (
                  <EmptyMessage>Nenhum pagamento registrado</EmptyMessage>
                )}
              </PatientInfoSection>
            </ModalMainContent>

            <ModalSidebar>
              <SidebarSection>
                <ActionButton variant="secondary" onClick={() => {}}>
                  <Settings size={16} />
                  Configurações
                </ActionButton>
                <ActionButton variant="primary" onClick={() => {}}>
                  <Plus size={16} />
                  Novo Portal
                </ActionButton>
              </SidebarSection>

              <SidebarSection>
                <SidebarTitle>
                  <Calendar size={18} />
                  Próximos Agendamentos
                </SidebarTitle>
                {selectedPatientAppointments
                  .filter(apt => new Date(apt.date) >= new Date())
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 2)
                  .map(appointment => (
                    <UpcomingAppointmentItem key={appointment.id}>
                      {new Date(appointment.date).toLocaleDateString('pt-BR')} às {new Date(appointment.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - {appointment.type}
                    </UpcomingAppointmentItem>
                  ))}
                {selectedPatientAppointments.filter(apt => new Date(apt.date) >= new Date()).length === 0 && (
                  <EmptyMessage style={{ padding: theme.spacing.md, fontSize: theme.typography.sizes.sm }}>
                    Nenhum agendamento futuro
                  </EmptyMessage>
                )}
              </SidebarSection>

              <SidebarSection>
                <ActionButton variant="secondary" onClick={() => handleSendMessage(selectedPatientData.id)}>
                  <MessageCircle size={16} />
                  Enviar Mensagem
                </ActionButton>
                <ActionButton variant="secondary" onClick={() => handleScheduleAppointment(selectedPatientData.id)}>
                  <Calendar size={16} />
                  Agendar Consulta
                </ActionButton>
                <ActionButton variant="primary" onClick={() => handleDownloadReport(selectedPatientData.id)}>
                  <Download size={16} />
                  Baixar Relatório
                </ActionButton>
              </SidebarSection>
            </ModalSidebar>
          </ModalContent>
        </PatientDetailsModal>
      )}
    </PatientPortalContainer>
  );
};

export default PatientPortal;
