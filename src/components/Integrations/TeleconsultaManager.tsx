import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Video,
  Plus,
  Calendar,
  Clock,
  Users,
  ExternalLink,
  Copy,
  Check,
  X
} from 'lucide-react';
import { theme } from '../../styles/theme';
import { externalIntegrationsService, TeleconsultaMeeting } from '../../services/externalIntegrations';
import { useApp } from '../../context/AppContext';
import { toast } from 'react-toastify';

const TeleconsultaContainer = styled.div`
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

const HeaderIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.status.error}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.status.error};
`;

const HeaderTitle = styled.h2`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const MeetingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const MeetingCard = styled.div<{ status: 'upcoming' | 'live' | 'ended' }>`
  background: ${theme.colors.background};
  border: 2px solid ${props => {
    switch (props.status) {
      case 'upcoming': return theme.colors.border;
      case 'live': return theme.colors.status.success;
      case 'ended': return theme.colors.text.secondary;
    }
  }};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => {
    switch (props.status) {
      case 'upcoming': return theme.colors.primary;
      case 'live': return theme.colors.status.success;
      case 'ended': return theme.colors.text.secondary;
    }
  }};
    box-shadow: ${theme.shadows.sm};
  }
`;

const MeetingHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.md};
`;

const MeetingInfo = styled.div`
  flex: 1;
`;

const MeetingTitle = styled.h3`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.xs} 0;
`;

const MeetingPatient = styled.p`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.secondary};
  margin: 0;
`;

const MeetingStatus = styled.div<{ status: 'upcoming' | 'live' | 'ended' }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.medium};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};

  ${props => {
    switch (props.status) {
      case 'upcoming':
        return `
          background: ${theme.colors.status.warning}20;
          color: ${theme.colors.status.warning};
        `;
      case 'live':
        return `
          background: ${theme.colors.status.success}20;
          color: ${theme.colors.status.success};
        `;
      case 'ended':
        return `
          background: ${theme.colors.text.secondary}20;
          color: ${theme.colors.text.secondary};
        `;
    }
  }}
`;

const MeetingDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.secondary};
`;

const MeetingLink = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
`;

const LinkText = styled.p`
  font-size: ${theme.spacing.sm};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.xs} 0;
  word-break: break-all;
`;

const LinkActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const ActionButton = styled.button<{ variant: 'primary' | 'secondary' | 'success' }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.xs};
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

const CreateMeetingButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  transition: background 0.2s ease;
  margin-bottom: ${theme.spacing.lg};

  &:hover {
    background: ${theme.colors.primary}dd;
  }
`;

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  width: 90%;
  max-width: 500px;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.lg};
`;

const ModalTitle = styled.h3`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.md};

  &:hover {
    background: ${theme.colors.background};
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const FormLabel = styled.label`
  display: block;
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
`;

const FormSelect = styled.select`
  width: 100%;
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.primary};
  background: ${theme.colors.background};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  justify-content: flex-end;
  margin-top: ${theme.spacing.lg};
`;

const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
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
    }
  }}
`;

const TeleconsultaManager: React.FC = () => {
  const { state } = useApp();
  const [meetings, setMeetings] = useState<TeleconsultaMeeting[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    // Carregar reuniões existentes (simulado)
    const mockMeetings: TeleconsultaMeeting[] = [
      {
        id: '1',
        appointmentId: '1',
        meetingUrl: 'https://zoom.us/j/123456789',
        meetingId: '123456789',
        password: 'ABC123',
        startTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hora no futuro
        duration: 50
      },
      {
        id: '2',
        appointmentId: '2',
        meetingUrl: 'https://meet.google.com/abc-defg-hij',
        meetingId: 'abc-defg-hij',
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 horas no futuro
        duration: 50
      }
    ];
    setMeetings(mockMeetings);
  }, []);

  const onlineAppointments = state.appointments.filter(app => app.type === 'online');

  const handleCreateMeeting = async () => {
    if (!selectedAppointment) {
      toast.error('Selecione um agendamento');
      return;
    }

    const appointment = state.appointments.find(app => app.id === selectedAppointment);
    if (!appointment) {
      toast.error('Agendamento não encontrado');
      return;
    }

    try {
      const meeting = await externalIntegrationsService.createTeleconsultaMeeting(appointment);
      if (meeting) {
        setMeetings([...meetings, meeting]);
        toast.success('Reunião criada com sucesso!');
        setIsModalOpen(false);
        setSelectedAppointment('');
      }
    } catch (error) {
      toast.error('Erro ao criar reunião');
    }
  };

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(url);
      toast.success('Link copiado para a área de transferência!');
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (error) {
      toast.error('Erro ao copiar link');
    }
  };

  const handleJoinMeeting = (url: string) => {
    window.open(url, '_blank');
  };

  const getMeetingStatus = (meeting: TeleconsultaMeeting): 'upcoming' | 'live' | 'ended' => {
    const now = new Date();
    const startTime = new Date(meeting.startTime);
    const endTime = new Date(startTime.getTime() + meeting.duration * 60000);

    if (now < startTime) return 'upcoming';
    if (now >= startTime && now <= endTime) return 'live';
    return 'ended';
  };

  const getAppointmentInfo = (appointmentId: string) => {
    const appointment = state.appointments.find(app => app.id === appointmentId);
    const patient = appointment ? state.patients.find(p => p.id === appointment.patientId) : null;
    return { appointment, patient };
  };

  return (
    <TeleconsultaContainer>
      <SectionHeader>
        <HeaderIcon>
          <Video size={24} />
        </HeaderIcon>
        <HeaderTitle>Teleconsultas</HeaderTitle>
      </SectionHeader>

      <CreateMeetingButton onClick={() => setIsModalOpen(true)}>
        <Plus size={16} />
        Criar Nova Reunião
      </CreateMeetingButton>

      <MeetingsGrid>
        {meetings.map((meeting) => {
          const status = getMeetingStatus(meeting);
          const { appointment, patient } = getAppointmentInfo(meeting.appointmentId);

          return (
            <MeetingCard key={meeting.id} status={status}>
              <MeetingHeader>
                <MeetingInfo>
                  <MeetingTitle>
                    {appointment ? `Consulta - ${patient?.name || 'Paciente'}` : 'Reunião'}
                  </MeetingTitle>
                  <MeetingPatient>
                    {patient?.name || 'Paciente não encontrado'}
                  </MeetingPatient>
                </MeetingInfo>
                <MeetingStatus status={status}>
                  {status === 'upcoming' && <Clock size={12} />}
                  {status === 'live' && <Video size={12} />}
                  {status === 'ended' && <Calendar size={12} />}
                  {status === 'upcoming' && 'Agendada'}
                  {status === 'live' && 'Ao Vivo'}
                  {status === 'ended' && 'Finalizada'}
                </MeetingStatus>
              </MeetingHeader>

              <MeetingDetails>
                <DetailItem>
                  <Calendar size={14} />
                  {new Date(meeting.startTime).toLocaleDateString('pt-BR')}
                </DetailItem>
                <DetailItem>
                  <Clock size={14} />
                  {new Date(meeting.startTime).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })} - {meeting.duration} min
                </DetailItem>
                <DetailItem>
                  <Users size={14} />
                  ID: {meeting.meetingId}
                  {meeting.password && ` | Senha: ${meeting.password}`}
                </DetailItem>
              </MeetingDetails>

              <MeetingLink>
                <LinkText>{meeting.meetingUrl}</LinkText>
                <LinkActions>
                  <ActionButton
                    variant="primary"
                    onClick={() => handleJoinMeeting(meeting.meetingUrl)}
                  >
                    <ExternalLink size={12} />
                    Entrar
                  </ActionButton>
                  <ActionButton
                    variant="secondary"
                    onClick={() => handleCopyLink(meeting.meetingUrl)}
                  >
                    {copiedLink === meeting.meetingUrl ? (
                      <Check size={12} />
                    ) : (
                      <Copy size={12} />
                    )}
                    {copiedLink === meeting.meetingUrl ? 'Copiado' : 'Copiar'}
                  </ActionButton>
                </LinkActions>
              </MeetingLink>
            </MeetingCard>
          );
        })}
      </MeetingsGrid>

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Criar Nova Reunião</ModalTitle>
            <CloseButton onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </CloseButton>
          </ModalHeader>

          <FormGroup>
            <FormLabel>Selecionar Agendamento Online</FormLabel>
            <FormSelect
              value={selectedAppointment}
              onChange={(e) => setSelectedAppointment(e.target.value)}
            >
              <option value="">Selecione um agendamento...</option>
              {onlineAppointments.map((appointment) => {
                const patient = state.patients.find(p => p.id === appointment.patientId);
                return (
                  <option key={appointment.id} value={appointment.id}>
                    {patient?.name || 'Paciente'} - {new Date(appointment.date).toLocaleString('pt-BR')}
                  </option>
                );
              })}
            </FormSelect>
          </FormGroup>

          <ModalActions>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCreateMeeting}>
              <Video size={16} />
              Criar Reunião
            </Button>
          </ModalActions>
        </ModalContent>
      </Modal>
    </TeleconsultaContainer>
  );
};

export default TeleconsultaManager;
