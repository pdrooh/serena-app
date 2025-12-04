import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Appointment, Patient } from '../../types';
import { theme } from '../../styles/theme';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const Label = styled.label`
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.sizes.sm};
`;

const Input = styled.input<{ hasError?: boolean }>`
  padding: ${theme.spacing.md};
  border: 1px solid ${props => props.hasError ? theme.colors.status.error : theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.base};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
    outline: none;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm};
    font-size: ${theme.typography.sizes.sm};
  }
`;

const Select = styled.select<{ hasError?: boolean }>`
  padding: ${theme.spacing.md};
  border: 1px solid ${props => props.hasError ? theme.colors.status.error : theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.base};
  background: white;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
    outline: none;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm};
    font-size: ${theme.typography.sizes.sm};
  }
`;

const TextArea = styled.textarea<{ hasError?: boolean }>`
  padding: ${theme.spacing.md};
  border: 1px solid ${props => props.hasError ? theme.colors.status.error : theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.base};
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
    outline: none;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm};
    font-size: ${theme.typography.sizes.sm};
    min-height: 60px;
  }
`;

const ErrorMessage = styled.span`
  color: ${theme.colors.status.error};
  font-size: ${theme.typography.sizes.sm};
  margin-top: ${theme.spacing.xs};
`;

const SectionTitle = styled.h3`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.md} 0;
  padding-bottom: ${theme.spacing.sm};
  border-bottom: 2px solid ${theme.colors.primary};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  border: none;
  font-size: ${theme.typography.sizes.base};

  ${props => props.variant === 'primary' ? `
    background: ${theme.colors.primary};
    color: white;

    &:hover {
      background: ${theme.colors.accent};
    }

    &:disabled {
      background: ${theme.colors.text.light};
      cursor: not-allowed;
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
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${theme.spacing.sm};
  }
`;

interface AppointmentFormData {
  patientId: string;
  date: string;
  time: string;
  duration: number;
  type: 'presencial' | 'online';
  status?: 'agendado' | 'confirmado' | 'realizado' | 'cancelado';
  notes?: string;
}

interface AppointmentFormProps {
  appointment?: Appointment;
  patients: Patient[];
  onSubmit: (data: AppointmentFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  appointment,
  patients,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<AppointmentFormData>();

  useEffect(() => {
    if (appointment) {
      const appointmentDate = new Date(appointment.date);
      const dateString = appointmentDate.toISOString().split('T')[0];
      const timeString = appointmentDate.toTimeString().split(' ')[0].substring(0, 5);

      reset({
        patientId: appointment.patientId,
        date: dateString,
        time: timeString,
        duration: appointment.duration,
        type: appointment.type,
        status: appointment.status,
        notes: appointment.notes || '',
      });
    } else {
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      reset({
        date: todayString,
        time: '09:00',
        duration: 50,
        type: 'presencial',
      });
    }
  }, [appointment, reset]);

  // Watch date for future use if needed
  watch('date');

  const handleFormSubmit = (data: AppointmentFormData) => {
    // Combinar data e hora
    const dateTime = new Date(`${data.date}T${data.time}`);
    onSubmit({
      ...data,
      date: dateTime.toISOString(),
    });
  };

  // Gerar opções de horário
  const generateTimeOptions = () => {
    const times = [];
    const startHour = 8;
    const endHour = 18;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <SectionTitle>Informações do Agendamento</SectionTitle>

      <FormGroup>
        <Label htmlFor="patientId">Paciente *</Label>
        <Select
          id="patientId"
          {...register('patientId', { required: 'Selecione um paciente' })}
          hasError={!!errors.patientId}
        >
          <option value="">Selecione um paciente</option>
          {patients.map(patient => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </Select>
        {errors.patientId && <ErrorMessage>{errors.patientId.message}</ErrorMessage>}
      </FormGroup>

      <FormRow>
        <FormGroup>
          <Label htmlFor="date">Data *</Label>
          <Input
            id="date"
            type="date"
            {...register('date', { required: 'Data é obrigatória' })}
            hasError={!!errors.date}
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.date && <ErrorMessage>{errors.date.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="time">Horário *</Label>
          <Select
            id="time"
            {...register('time', { required: 'Horário é obrigatório' })}
            hasError={!!errors.time}
          >
            {timeOptions.map(time => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </Select>
          {errors.time && <ErrorMessage>{errors.time.message}</ErrorMessage>}
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label htmlFor="duration">Duração (minutos) *</Label>
          <Select
            id="duration"
            {...register('duration', { required: 'Duração é obrigatória' })}
            hasError={!!errors.duration}
          >
            <option value="30">30 minutos</option>
            <option value="45">45 minutos</option>
            <option value="50">50 minutos</option>
            <option value="60">60 minutos</option>
            <option value="90">90 minutos</option>
          </Select>
          {errors.duration && <ErrorMessage>{errors.duration.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="type">Tipo de Consulta *</Label>
          <Select
            id="type"
            {...register('type', { required: 'Tipo é obrigatório' })}
            hasError={!!errors.type}
          >
            <option value="presencial">Presencial</option>
            <option value="online">Online</option>
          </Select>
          {errors.type && <ErrorMessage>{errors.type.message}</ErrorMessage>}
        </FormGroup>
      </FormRow>

      {appointment && (
        <FormGroup>
          <Label htmlFor="status">Status *</Label>
          <Select
            id="status"
            {...register('status', { required: 'Status é obrigatório' })}
            defaultValue={appointment.status}
          >
            <option value="agendado">Agendado</option>
            <option value="confirmado">Confirmado</option>
            <option value="realizado">Realizado</option>
            <option value="cancelado">Cancelado</option>
          </Select>
        </FormGroup>
      )}

      <SectionTitle>Observações</SectionTitle>

      <FormGroup>
        <Label htmlFor="notes">Observações</Label>
        <TextArea
          id="notes"
          {...register('notes')}
          placeholder="Observações sobre o agendamento..."
        />
      </FormGroup>

      <ButtonGroup>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Salvando...' : appointment ? 'Atualizar Agendamento' : 'Agendar Consulta'}
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default AppointmentForm;
