import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import {
  Calendar,
  Clock,
  Bell,
  BellOff,
  Settings,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { theme } from '../../styles/theme';
import { useApp } from '../../context/AppContext';
import { Appointment } from '../../types';
import { useNotifications } from '../../hooks/useNotifications';

const RemindersContainer = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.md};
  border: 1px solid ${theme.colors.border};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const ToggleButton = styled.button<{ isEnabled: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border};
  background: ${props => props.isEnabled ? theme.colors.primary : theme.colors.surface};
  color: ${props => props.isEnabled ? 'white' : theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};

  &:hover {
    background: ${props => props.isEnabled ? theme.colors.accent : theme.colors.background};
  }
`;

const RemindersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const ReminderItem = styled.div<{ isUpcoming: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border};
  transition: all 0.2s ease;

  ${props => props.isUpcoming && `
    border-color: ${theme.colors.primary};
    background: ${theme.colors.primary}05;
  `}

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.sm};
  }
`;

const ReminderIcon = styled.div<{ type: 'upcoming' | 'today' | 'overdue' }>`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;

  ${props => {
    switch (props.type) {
      case 'upcoming':
        return `background: ${theme.colors.primary};`;
      case 'today':
        return `background: ${theme.colors.status.warning};`;
      case 'overdue':
        return `background: ${theme.colors.status.error};`;
    }
  }}
`;

const ReminderContent = styled.div`
  flex: 1;
`;

const ReminderTitle = styled.h3`
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.xs} 0;
`;

const ReminderDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const ReminderText = styled.p`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.secondary};
  margin: 0;
`;

const ReminderTime = styled.span<{ isUrgent: boolean }>`
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  color: ${props => props.isUrgent ? theme.colors.status.error : theme.colors.text.secondary};
`;

const ReminderActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.surface};
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  &:hover {
    background: ${theme.colors.background};
    color: ${theme.colors.text.primary};
  }

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary};
          color: white;
          border-color: ${theme.colors.primary};
          &:hover {
            background: ${theme.colors.accent};
          }
        `;
      case 'danger':
        return `
          background: ${theme.colors.status.error};
          color: white;
          border-color: ${theme.colors.status.error};
          &:hover {
            background: ${theme.colors.status.error}dd;
          }
        `;
    }
  }}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.text.secondary};
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing.md};
  color: ${theme.colors.text.secondary};
`;

const SettingsModal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.2s ease;
`;

const SettingsContent = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  width: 90%;
  max-width: 400px;
`;

const SettingsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const SettingsTitle = styled.h3`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md} 0;
  border-bottom: 1px solid ${theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.label`
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.text.primary};
  cursor: pointer;
`;

const NumberInput = styled.input`
  width: 80px;
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.sizes.sm};
  text-align: center;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const AppointmentReminders: React.FC = () => {
  const { state } = useApp();
  const { settings, updateSettings, createNotification } = useNotifications();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [timeBefore, setTimeBefore] = useState(settings.appointmentReminder.timeBefore);

  // Verificação de segurança para evitar erros quando state ainda não foi carregado
  if (!state || !state.appointments) {
    return (
      <RemindersContainer>
        <SectionHeader>
          <SectionTitle>
            <Calendar size={24} />
            Lembretes de Consultas
          </SectionTitle>
        </SectionHeader>
        <EmptyState>
          <EmptyIcon>
            <Clock size={32} />
          </EmptyIcon>
          <p>Carregando lembretes...</p>
        </EmptyState>
      </RemindersContainer>
    );
  }

  const appointments = state.appointments || [];
  const now = new Date();

  // Filtrar consultas que precisam de lembretes
  const upcomingAppointments = appointments
    .filter((appointment: Appointment) => {
      if (appointment.status !== 'agendado' && appointment.status !== 'confirmado') {
        return false;
      }

      const appointmentTime = new Date(appointment.date);
      const reminderTime = new Date(appointmentTime.getTime() - (timeBefore * 60000));

      return now >= reminderTime && now <= appointmentTime;
    })
    .sort((a: Appointment, b: Appointment) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const todayAppointments = appointments.filter((appointment: Appointment) => {
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    return appointmentDate.toDateString() === today.toDateString() &&
      (appointment.status === 'agendado' || appointment.status === 'confirmado');
  });

  const overdueAppointments = appointments.filter((appointment: Appointment) => {
    const appointmentTime = new Date(appointment.date);
    return appointmentTime < now &&
      (appointment.status === 'agendado' || appointment.status === 'confirmado');
  });

  const handleToggleReminders = () => {
    updateSettings({
      appointmentReminder: {
        ...settings.appointmentReminder,
        enabled: !settings.appointmentReminder.enabled
      }
    });
  };

  const handleTimeChange = (newTime: number) => {
    setTimeBefore(newTime);
    updateSettings({
      appointmentReminder: {
        ...settings.appointmentReminder,
        timeBefore: newTime
      }
    });
  };

  const handleSendReminder = (appointment: Appointment) => {
    const patient = state.patients.find(p => p.id === appointment.patientId);
    const patientName = patient ? patient.name : 'Paciente';

    createNotification(
      'Lembrete de Consulta',
      `Você tem uma consulta com ${patientName} em ${new Date(appointment.date).toLocaleString('pt-BR')}`,
      new Date(),
      'browser'
    );
    toast.success('Lembrete enviado!');
  };

  const handleMarkAsCompleted = (appointment: Appointment) => {
    // Aqui você atualizaria o status da consulta para 'realizado'
    toast.success('Consulta marcada como realizada!');
  };

  const getReminderType = (appointment: Appointment) => {
    const appointmentTime = new Date(appointment.date);
    const today = new Date();

    if (appointmentTime.toDateString() === today.toDateString()) {
      return 'today';
    } else if (appointmentTime < now) {
      return 'overdue';
    } else {
      return 'upcoming';
    }
  };

  const getTimeUntilAppointment = (appointment: Appointment) => {
    const appointmentTime = new Date(appointment.date);
    const diff = appointmentTime.getTime() - now.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return 'Agora';
    }
  };

  const allReminders = [
    ...overdueAppointments.map((a: Appointment) => ({ ...a, reminderType: 'overdue' as const })),
    ...todayAppointments.map((a: Appointment) => ({ ...a, reminderType: 'today' as const })),
    ...upcomingAppointments.map((a: Appointment) => ({ ...a, reminderType: 'upcoming' as const }))
  ];

  return (
    <RemindersContainer>
      <SectionHeader>
        <SectionTitle>
          <Calendar size={24} />
          Lembretes de Consultas
        </SectionTitle>
        <div style={{ display: 'flex', gap: theme.spacing.sm }}>
          <ToggleButton
            isEnabled={settings.appointmentReminder.enabled}
            onClick={handleToggleReminders}
          >
            {settings.appointmentReminder.enabled ? <Bell size={16} /> : <BellOff size={16} />}
            {settings.appointmentReminder.enabled ? 'Ativo' : 'Inativo'}
          </ToggleButton>
          <ActionButton onClick={() => setIsSettingsOpen(true)}>
            <Settings size={16} />
            Configurar
          </ActionButton>
        </div>
      </SectionHeader>

      {allReminders.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <CheckCircle size={32} />
          </EmptyIcon>
          <p>Nenhum lembrete pendente</p>
          <p style={{ fontSize: theme.typography.sizes.sm, marginTop: theme.spacing.sm }}>
            Todas as consultas estão em dia!
          </p>
        </EmptyState>
      ) : (
        <RemindersList>
          {allReminders.map((appointment) => (
            <ReminderItem
              key={appointment.id}
              isUpcoming={appointment.reminderType === 'upcoming'}
            >
              <ReminderIcon type={appointment.reminderType}>
                {appointment.reminderType === 'overdue' ? <AlertTriangle size={20} /> : <Clock size={20} />}
              </ReminderIcon>

              <ReminderContent>
                <ReminderTitle>
                  Consulta com {state.patients.find(p => p.id === appointment.patientId)?.name || 'Paciente'}
                </ReminderTitle>
                <ReminderDetails>
                  <ReminderText>
                    {new Date(appointment.date).toLocaleString('pt-BR')}
                  </ReminderText>
                  <ReminderTime isUrgent={appointment.reminderType === 'overdue'}>
                    {appointment.reminderType === 'overdue'
                      ? 'Atrasada'
                      : appointment.reminderType === 'today'
                        ? 'Hoje'
                        : `Em ${getTimeUntilAppointment(appointment)}`
                    }
                  </ReminderTime>
                </ReminderDetails>
              </ReminderContent>

              <ReminderActions>
                {appointment.reminderType !== 'overdue' && (
                  <ActionButton
                    variant="primary"
                    onClick={() => handleSendReminder(appointment)}
                  >
                    <Bell size={14} />
                    Lembrar
                  </ActionButton>
                )}
                <ActionButton
                  variant="secondary"
                  onClick={() => handleMarkAsCompleted(appointment)}
                >
                  <CheckCircle size={14} />
                  Realizada
                </ActionButton>
              </ReminderActions>
            </ReminderItem>
          ))}
        </RemindersList>
      )}

      <SettingsModal isOpen={isSettingsOpen}>
        <SettingsContent>
          <SettingsHeader>
            <SettingsTitle>Configurações de Lembretes</SettingsTitle>
            <ActionButton onClick={() => setIsSettingsOpen(false)}>
              ✕
            </ActionButton>
          </SettingsHeader>

          <SettingItem>
            <SettingLabel>Minutos antes da consulta</SettingLabel>
            <NumberInput
              type="number"
              value={timeBefore}
              onChange={(e) => handleTimeChange(parseInt(e.target.value))}
              min="5"
              max="1440"
            />
          </SettingItem>

          <SettingItem>
            <SettingLabel>Ativar lembretes automáticos</SettingLabel>
            <input
              type="checkbox"
              checked={settings.appointmentReminder.enabled}
              onChange={handleToggleReminders}
            />
          </SettingItem>
        </SettingsContent>
      </SettingsModal>
    </RemindersContainer>
  );
};

export default AppointmentReminders;
