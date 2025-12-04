import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Payment, Patient } from '../../types';
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

const CurrencyInput = styled.div`
  position: relative;
`;

const CurrencySymbol = styled.span`
  position: absolute;
  left: ${theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.weights.medium};
  pointer-events: none;
`;

const CurrencyInputField = styled(Input)`
  padding-left: 2.5rem;
`;

interface PaymentFormData {
  patientId: string;
  sessionId?: string;
  amount: number;
  date: string;
  method: 'dinheiro' | 'pix' | 'cartao' | 'transferencia';
  status: 'pago' | 'pendente' | 'atrasado';
  notes?: string;
}

interface PaymentFormProps {
  payment?: Payment;
  patients: Patient[];
  sessions?: any[];
  onSubmit: (data: PaymentFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  payment,
  patients,
  sessions = [],
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<PaymentFormData>();
  const [selectedPatient, setSelectedPatient] = useState<string>('');
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');

    // Aplica a máscara (11) 99999-9999
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  useEffect(() => {
    if (payment) {
      reset({
        patientId: payment.patientId,
        sessionId: payment.sessionId || '',
        amount: payment.amount,
        date: new Date(payment.date).toISOString().split('T')[0],
        method: payment.method,
        status: payment.status,
        notes: payment.notes || '',
      });
      setSelectedPatient(payment.patientId);
    } else {
      const today = new Date().toISOString().split('T')[0];
      reset({
        date: today,
        amount: 150,
        method: 'pix',
        status: 'pago',
      });
    }
  }, [payment, reset]);

  const watchedPatientId = watch('patientId');
  useEffect(() => {
    setSelectedPatient(watchedPatientId);
  }, [watchedPatientId]);

  const handleFormSubmit = (data: PaymentFormData) => {
    onSubmit({
      ...data,
      date: new Date(data.date).toISOString(),
    });
  };

  const patientSessions = sessions.filter(session => session.patientId === selectedPatient);

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <SectionTitle>Informações do Pagamento</SectionTitle>

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

      {selectedPatient && patientSessions.length > 0 && (
        <FormGroup>
          <Label htmlFor="sessionId">Sessão (opcional)</Label>
          <Select
            id="sessionId"
            {...register('sessionId')}
          >
            <option value="">Selecione uma sessão</option>
            {patientSessions.map(session => (
              <option key={session.id} value={session.id}>
                {new Date(session.date).toLocaleDateString('pt-BR')} - {session.duration}min
              </option>
            ))}
          </Select>
        </FormGroup>
      )}

      <FormRow>
        <FormGroup>
          <Label htmlFor="amount">Valor *</Label>
          <CurrencyInput>
            <CurrencySymbol>R$</CurrencySymbol>
            <CurrencyInputField
              id="amount"
              type="number"
              step="0.01"
              min="0"
              {...register('amount', {
                required: 'Valor é obrigatório',
                min: { value: 0.01, message: 'Valor deve ser maior que zero' }
              })}
              hasError={!!errors.amount}
              placeholder="0,00"
            />
          </CurrencyInput>
          {errors.amount && <ErrorMessage>{errors.amount.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="date">Data do Pagamento *</Label>
          <Input
            id="date"
            type="date"
            {...register('date', { required: 'Data é obrigatória' })}
            hasError={!!errors.date}
          />
          {errors.date && <ErrorMessage>{errors.date.message}</ErrorMessage>}
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label htmlFor="method">Método de Pagamento *</Label>
          <Select
            id="method"
            {...register('method', { required: 'Método é obrigatório' })}
            hasError={!!errors.method}
          >
            <option value="pix">PIX</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="cartao">Cartão</option>
            <option value="transferencia">Transferência</option>
          </Select>
          {errors.method && <ErrorMessage>{errors.method.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="status">Status *</Label>
          <Select
            id="status"
            {...register('status', { required: 'Status é obrigatório' })}
            hasError={!!errors.status}
          >
            <option value="pago">Pago</option>
            <option value="pendente">Pendente</option>
            <option value="atrasado">Atrasado</option>
          </Select>
          {errors.status && <ErrorMessage>{errors.status.message}</ErrorMessage>}
        </FormGroup>
      </FormRow>

      <SectionTitle>Observações</SectionTitle>

      <FormGroup>
        <Label htmlFor="notes">Observações</Label>
        <TextArea
          id="notes"
          {...register('notes')}
          placeholder="Observações sobre o pagamento..."
        />
      </FormGroup>

      <ButtonGroup>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Salvando...' : payment ? 'Atualizar Pagamento' : 'Registrar Pagamento'}
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default PaymentForm;
