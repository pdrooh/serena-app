import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import {
  Plus,
  Calendar,
  Clock,
  User,
  Video,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2
} from 'lucide-react';
import { theme } from '../styles/theme';
import { Appointment } from '../types';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal/Modal';
import AppointmentForm from '../components/Forms/AppointmentForm';

const AppointmentsContainer = styled.div`
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

const CalendarView = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.md};
  border: 1px solid ${theme.colors.border};
  margin-bottom: ${theme.spacing.xl};
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const MonthYear = styled.h2`
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const CalendarNavigation = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const NavButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${theme.colors.text.secondary};

  &:hover {
    background: ${theme.colors.primary};
    color: white;
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
`;

const CalendarDay = styled.div<{ isToday?: boolean; hasAppointment?: boolean; isOtherMonth?: boolean }>`
  background: ${props => props.isOtherMonth ? theme.colors.background : theme.colors.surface};
  padding: ${theme.spacing.md};
  min-height: 100px;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  cursor: pointer;
  transition: background-color 0.2s ease;

  ${props => props.isToday && `
    background: ${theme.colors.primary}10;
    border: 2px solid ${theme.colors.primary};
  `}

  ${props => props.hasAppointment && `
    background: ${theme.colors.secondary}10;
  `}

  &:hover {
    background: ${theme.colors.background};
  }
`;

const DayNumber = styled.div<{ isToday?: boolean }>`
  font-weight: ${props => props.isToday ? theme.typography.weights.bold : theme.typography.weights.medium};
  color: ${props => props.isToday ? theme.colors.primary : theme.colors.text.primary};
  font-size: ${theme.typography.sizes.sm};
`;

const AppointmentDot = styled.div<{ status: string }>`
  width: 8px;
  height: 8px;
  border-radius: ${theme.borderRadius.full};
  background: ${props => {
    switch (props.status) {
      case 'agendado': return theme.colors.primary;
      case 'confirmado': return theme.colors.status.success;
      case 'realizado': return theme.colors.text.secondary;
      case 'cancelado': return theme.colors.status.error;
      default: return theme.colors.text.light;
    }
  }};
`;

const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  margin-bottom: ${theme.spacing.sm};
`;

const WeekDay = styled.div`
  padding: ${theme.spacing.md};
  text-align: center;
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.sm};
  background: ${theme.colors.background};
`;

const AppointmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const AppointmentCard = styled.div<{ status: string }>`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.md};
  border: 1px solid ${theme.colors.border};
  border-left: 4px solid ${props => {
    switch (props.status) {
      case 'agendado': return theme.colors.primary;
      case 'confirmado': return theme.colors.status.success;
      case 'realizado': return theme.colors.text.secondary;
      case 'cancelado': return theme.colors.status.error;
      default: return theme.colors.text.light;
    }
  }};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const AppointmentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.md};
`;

const AppointmentInfo = styled.div`
  flex: 1;
`;

const PatientName = styled.h3`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.xs} 0;
`;

const AppointmentTime = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.sm};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const AppointmentStatus = styled.div<{ status: string }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.medium};

  ${props => {
    switch (props.status) {
      case 'agendado':
        return `
          background: ${theme.colors.primary}20;
          color: ${theme.colors.primary};
        `;
      case 'confirmado':
        return `
          background: ${theme.colors.status.success}20;
          color: ${theme.colors.status.success};
        `;
      case 'realizado':
        return `
          background: ${theme.colors.text.secondary}20;
          color: ${theme.colors.text.secondary};
        `;
      case 'cancelado':
        return `
          background: ${theme.colors.status.error}20;
          color: ${theme.colors.status.error};
        `;
      default:
        return `
          background: ${theme.colors.text.light}20;
          color: ${theme.colors.text.light};
        `;
    }
  }}
`;

const AppointmentActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'delete' }>`
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.full};
  background: ${props => props.variant === 'delete' ? theme.colors.status.error : theme.colors.background};
  border: 1px solid ${props => props.variant === 'delete' ? theme.colors.status.error : theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.variant === 'delete' ? 'white' : theme.colors.text.secondary};

  &:hover {
    background: ${props => props.variant === 'delete' ? theme.colors.status.error : theme.colors.primary};
    color: white;
  }
`;

const AppointmentType = styled.div<{ type: 'presencial' | 'online' }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  color: ${props => props.type === 'presencial' ? theme.colors.primary : theme.colors.secondary};
  font-size: ${theme.typography.sizes.sm};
  margin-top: ${theme.spacing.sm};
`;

const Appointments: React.FC = () => {
  const { state, addAppointment, updateAppointment, deleteAppointment, getPatientById } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [showAppointmentMenu, setShowAppointmentMenu] = useState<string | null>(null);

  const handleOpenModal = (appointment?: Appointment) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
    setShowAppointmentMenu(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(undefined);
  };

  const handleSubmitAppointment = async (data: any) => {
    setIsLoading(true);
    try {
      if (editingAppointment) {
        await updateAppointment(editingAppointment.id, {
          ...data,
          date: new Date(data.date),
          status: data.status || editingAppointment.status,
        });
        toast.success('Agendamento atualizado com sucesso!');
      } else {
        await addAppointment({
          ...data,
          date: new Date(data.date),
          status: 'agendado',
          reminderSent: false,
        });
        toast.success('Consulta agendada com sucesso!');
      }

      handleCloseModal();
    } catch (error: any) {
      console.error('Erro ao salvar agendamento:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Erro ao salvar agendamento';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.')) {
      try {
        setIsLoading(true);
        await deleteAppointment(appointmentId);
        toast.success('Agendamento excluído com sucesso!');
        setShowAppointmentMenu(null);
      } catch (error: any) {
        console.error('Erro ao deletar agendamento:', error);
        const errorMessage = error?.response?.data?.error || error?.message || 'Erro ao excluir agendamento';
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'agendado': return <AlertCircle size={16} />;
      case 'confirmado': return <CheckCircle size={16} />;
      case 'realizado': return <CheckCircle size={16} />;
      case 'cancelado': return <XCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'agendado': return 'Agendado';
      case 'confirmado': return 'Confirmado';
      case 'realizado': return 'Realizado';
      case 'cancelado': return 'Cancelado';
      default: return 'Desconhecido';
    }
  };

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const calendarDays = [];

  // Dias do mês anterior
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = new Date(currentYear, currentMonth, -i);
    calendarDays.push({ day, isOtherMonth: true });
  }

  // Dias do mês atual
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const hasAppointment = state.appointments.some(apt =>
      new Date(apt.date).toDateString() === date.toDateString()
    );
    calendarDays.push({
      day: date,
      isOtherMonth: false,
      hasAppointment,
      isToday: date.toDateString() === today.toDateString()
    });
  }

  // Dias do próximo mês para completar a grade
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(currentYear, currentMonth + 1, day);
    calendarDays.push({ day: date, isOtherMonth: true });
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  return (
    <AppointmentsContainer>
      <PageHeader>
        <PageTitle>Agenda</PageTitle>
        <HeaderActions>
          <Button variant="secondary">
            <Calendar size={20} />
            Visualização
          </Button>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            <Plus size={20} />
            Nova Consulta
          </Button>
        </HeaderActions>
      </PageHeader>

      <CalendarView>
        <CalendarHeader>
          <MonthYear>{months[currentMonth]} {currentYear}</MonthYear>
          <CalendarNavigation>
            <NavButton onClick={() => navigateMonth('prev')}>
              ←
            </NavButton>
            <NavButton onClick={() => navigateMonth('next')}>
              →
            </NavButton>
          </CalendarNavigation>
        </CalendarHeader>

        <WeekDays>
          {weekDays.map(day => (
            <WeekDay key={day}>{day}</WeekDay>
          ))}
        </WeekDays>

        <CalendarGrid>
          {calendarDays.map(({ day, isOtherMonth, hasAppointment, isToday }, index) => (
            <CalendarDay
              key={index}
              isOtherMonth={isOtherMonth}
              hasAppointment={hasAppointment}
              isToday={isToday}
            >
              <DayNumber isToday={isToday}>
                {day.getDate()}
              </DayNumber>
              {hasAppointment && (
                <AppointmentDot status="agendado" />
              )}
            </CalendarDay>
          ))}
        </CalendarGrid>
      </CalendarView>

      <AppointmentsList>
        <h2>Próximas Consultas</h2>
        {state.appointments.length > 0 ? (
          state.appointments
            .filter(apt => apt.status !== 'cancelado')
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((appointment) => {
              const patient = getPatientById(appointment.patientId);
              return (
                <AppointmentCard key={appointment.id} status={appointment.status}>
                  <AppointmentHeader>
                    <AppointmentInfo>
                      <PatientName>{patient?.name || 'Paciente não encontrado'}</PatientName>
                      <AppointmentTime>
                        <Clock size={16} />
                        {new Date(appointment.date).toLocaleDateString('pt-BR')} às {new Date(appointment.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </AppointmentTime>
                    </AppointmentInfo>
                    <AppointmentActions>
                      <AppointmentStatus status={appointment.status}>
                        {getStatusIcon(appointment.status)}
                        {getStatusText(appointment.status)}
                      </AppointmentStatus>
                      <ActionButton variant="edit" onClick={() => handleOpenModal(appointment)}>
                        <Edit size={16} />
                      </ActionButton>
                      <ActionButton variant="delete" onClick={() => handleDeleteAppointment(appointment.id)}>
                        <Trash2 size={16} />
                      </ActionButton>
                    </AppointmentActions>
                  </AppointmentHeader>

                  <AppointmentType type={appointment.type}>
                    {appointment.type === 'presencial' ? (
                      <>
                        <MapPin size={16} />
                        Presencial
                      </>
                    ) : (
                      <>
                        <Video size={16} />
                        Online
                      </>
                    )}
                  </AppointmentType>
                </AppointmentCard>
              );
            })
        ) : (
          <div style={{ textAlign: 'center', padding: theme.spacing.xl, color: theme.colors.text.secondary }}>
            Nenhuma consulta agendada
          </div>
        )}
      </AppointmentsList>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAppointment ? 'Editar Agendamento' : 'Nova Consulta'}
        size="medium"
      >
        <AppointmentForm
          appointment={editingAppointment}
          patients={state.patients}
          onSubmit={handleSubmitAppointment}
          onCancel={handleCloseModal}
          isLoading={isLoading}
        />
      </Modal>
    </AppointmentsContainer>
  );
};

export default Appointments;
