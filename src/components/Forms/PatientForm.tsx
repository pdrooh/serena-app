import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Patient } from '../../types';
import { theme } from '../../styles/theme';
import { formatPhoneNumber } from '../../utils/phoneFormatter';

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

const TextArea = styled.textarea<{ hasError?: boolean }>`
  padding: ${theme.spacing.md};
  border: 1px solid ${props => props.hasError ? theme.colors.status.error : theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.base};
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
    outline: none;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm};
    font-size: ${theme.typography.sizes.sm};
    min-height: 80px;
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

interface PatientFormData {
  name: string;
  age: number;
  email: string;
  phone: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  initialObservations: string;
}

interface PatientFormProps {
  patient?: Patient;
  onSubmit: (data: PatientFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({
  patient,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<PatientFormData>();

  // Função para formatar telefone automaticamente
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue('phone', formatted);
  };

  // Função para formatar telefone de emergência
  const handleEmergencyPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue('emergencyPhone', formatted);
  };


  useEffect(() => {
    if (patient) {
      reset({
        name: patient.name,
        age: patient.age,
        email: patient.email,
        phone: patient.phone,
        address: patient.address,
        emergencyContact: patient.emergencyContact,
        emergencyPhone: patient.emergencyPhone,
        initialObservations: patient.initialObservations,
      });
    }
  }, [patient, reset]);

  const handleFormSubmit = (data: PatientFormData) => {
    onSubmit(data);
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <SectionTitle>Dados Pessoais</SectionTitle>

      <FormRow>
        <FormGroup>
          <Label htmlFor="name">Nome Completo *</Label>
          <Input
            id="name"
            type="text"
            {...register('name', { required: 'Nome é obrigatório' })}
            hasError={!!errors.name}
            placeholder="Digite o nome completo"
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="age">Idade *</Label>
          <Input
            id="age"
            type="number"
            min="1"
            max="120"
            {...register('age', {
              required: 'Idade é obrigatória',
              min: { value: 1, message: 'Idade deve ser maior que 0' },
              max: { value: 120, message: 'Idade deve ser menor que 120' }
            })}
            hasError={!!errors.age}
            placeholder="Digite a idade"
          />
          {errors.age && <ErrorMessage>{errors.age.message}</ErrorMessage>}
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            type="email"
            {...register('email', {
              required: 'E-mail é obrigatório',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'E-mail inválido'
              }
            })}
            hasError={!!errors.email}
            placeholder="Digite o e-mail"
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="phone">Telefone *</Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone', {
              required: 'Telefone é obrigatório',
              pattern: {
                value: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
                message: 'Formato: (11) 99999-9999'
              }
            })}
            hasError={!!errors.phone}
            placeholder="(11) 99999-9999"
            onChange={handlePhoneChange}
            maxLength={15}
          />
          {errors.phone && <ErrorMessage>{errors.phone.message}</ErrorMessage>}
        </FormGroup>
      </FormRow>

      <FormGroup>
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          type="text"
          {...register('address')}
          placeholder="Digite o endereço completo"
        />
      </FormGroup>

      <SectionTitle>Contato de Emergência</SectionTitle>

      <FormRow>
        <FormGroup>
          <Label htmlFor="emergencyContact">Nome do Contato *</Label>
          <Input
            id="emergencyContact"
            type="text"
            {...register('emergencyContact', { required: 'Nome do contato de emergência é obrigatório' })}
            hasError={!!errors.emergencyContact}
            placeholder="Digite o nome do contato"
          />
          {errors.emergencyContact && <ErrorMessage>{errors.emergencyContact.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="emergencyPhone">Telefone do Contato *</Label>
          <Input
            id="emergencyPhone"
            type="tel"
            {...register('emergencyPhone', {
              required: 'Telefone do contato é obrigatório',
              pattern: {
                value: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
                message: 'Formato: (11) 99999-9999'
              }
            })}
            hasError={!!errors.emergencyPhone}
            placeholder="(11) 99999-9999"
            onChange={handleEmergencyPhoneChange}
            maxLength={15}
          />
          {errors.emergencyPhone && <ErrorMessage>{errors.emergencyPhone.message}</ErrorMessage>}
        </FormGroup>
      </FormRow>

      <SectionTitle>Observações Iniciais</SectionTitle>

      <FormGroup>
        <Label htmlFor="initialObservations">Observações</Label>
        <TextArea
          id="initialObservations"
          {...register('initialObservations')}
          placeholder="Digite observações iniciais sobre o paciente..."
        />
      </FormGroup>

      <ButtonGroup>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Salvando...' : patient ? 'Atualizar Paciente' : 'Cadastrar Paciente'}
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default PatientForm;
