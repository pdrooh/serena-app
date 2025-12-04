import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Session, Patient } from '../../types';
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
  min-height: 120px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
    outline: none;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm};
    font-size: ${theme.typography.sizes.sm};
    min-height: 100px;
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

const MoodSlider = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const Slider = styled.input`
  flex: 1;
  height: 6px;
  border-radius: ${theme.borderRadius.sm};
  background: ${theme.colors.border};
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${theme.colors.primary};
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${theme.colors.primary};
    cursor: pointer;
    border: none;
  }
`;

const MoodValue = styled.span<{ mood: number }>`
  font-weight: ${theme.typography.weights.bold};
  color: ${props => {
    if (props.mood >= 7) return theme.colors.status.success;
    if (props.mood >= 4) return theme.colors.status.warning;
    return theme.colors.status.error;
  }};
  min-width: 30px;
  text-align: center;
`;

const MoodLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.text.secondary};
`;

const TagsInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  min-height: 50px;
  align-items: flex-start;
`;

const Tag = styled.span`
  background: ${theme.colors.primary}20;
  color: ${theme.colors.primary};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.sizes.sm};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const TagInput = styled.input`
  border: none;
  outline: none;
  flex: 1;
  min-width: 100px;
  font-size: ${theme.typography.sizes.sm};
`;

const RemoveTag = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;

  &:hover {
    background: ${theme.colors.primary};
    color: white;
  }
`;

interface SessionFormData {
  patientId: string;
  date: string;
  duration: number;
  type: 'presencial' | 'online';
  notes: string;
  mood: number;
  objectives: string[];
  techniques: string[];
  nextSessionGoals: string;
}

interface SessionFormProps {
  session?: Session;
  patients: Patient[];
  onSubmit: (data: SessionFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const SessionForm: React.FC<SessionFormProps> = ({
  session,
  patients,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<SessionFormData>();
  const [objectives, setObjectives] = useState<string[]>([]);
  const [techniques, setTechniques] = useState<string[]>([]);
  const [objectiveInput, setObjectiveInput] = useState('');
  const [techniqueInput, setTechniqueInput] = useState('');
  const mood = watch('mood', 5);

  useEffect(() => {
    if (session) {
      reset({
        patientId: session.patientId || '',
        date: new Date(session.date).toISOString().split('T')[0],
        duration: session.duration || 50,
        type: session.type || 'presencial',
        notes: session.notes || '',
        mood: session.mood || 5,
        nextSessionGoals: session.nextSessionGoals || '',
      });
      setObjectives(session.objectives || []);
      setTechniques(session.techniques || []);
    } else {
      reset({
        date: new Date().toISOString().split('T')[0],
        duration: 50,
        type: 'presencial',
        mood: 5,
      });
    }
  }, [session, reset]);

  const handleFormSubmit = (data: SessionFormData) => {
    onSubmit({
      ...data,
      objectives,
      techniques,
    });
  };

  const addObjective = () => {
    if (objectiveInput.trim() && !objectives.includes(objectiveInput.trim())) {
      setObjectives([...objectives, objectiveInput.trim()]);
      setObjectiveInput('');
    }
  };

  const removeObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const addTechnique = () => {
    if (techniqueInput.trim() && !techniques.includes(techniqueInput.trim())) {
      setTechniques([...techniques, techniqueInput.trim()]);
      setTechniqueInput('');
    }
  };

  const removeTechnique = (index: number) => {
    setTechniques(techniques.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <SectionTitle>Informações da Sessão</SectionTitle>

      <FormRow>
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

        <FormGroup>
          <Label htmlFor="date">Data da Sessão *</Label>
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
          <Label htmlFor="duration">Duração (minutos) *</Label>
          <Input
            id="duration"
            type="number"
            min="15"
            max="120"
            {...register('duration', {
              required: 'Duração é obrigatória',
              min: { value: 15, message: 'Duração mínima é 15 minutos' },
              max: { value: 120, message: 'Duração máxima é 120 minutos' }
            })}
            hasError={!!errors.duration}
          />
          {errors.duration && <ErrorMessage>{errors.duration.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="type">Tipo de Sessão *</Label>
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

      <SectionTitle>Avaliação da Sessão</SectionTitle>

      <FormGroup>
        <Label>Humor do Paciente (1-10)</Label>
        <MoodSlider>
          <SliderContainer>
            <span>😞</span>
            <Slider
              type="range"
              min="1"
              max="10"
              step="1"
              {...register('mood', {
                required: 'Avaliação do humor é obrigatória',
                min: { value: 1, message: 'Valor mínimo é 1' },
                max: { value: 10, message: 'Valor máximo é 10' }
              })}
            />
            <span>😊</span>
            <MoodValue mood={mood}>{mood}</MoodValue>
          </SliderContainer>
          <MoodLabels>
            <span>Muito baixo</span>
            <span>Muito alto</span>
          </MoodLabels>
        </MoodSlider>
      </FormGroup>

      <FormGroup>
        <Label>Objetivos da Sessão</Label>
        <TagsInput>
          {objectives.map((objective, index) => (
            <Tag key={index}>
              {objective}
              <RemoveTag onClick={() => removeObjective(index)}>×</RemoveTag>
            </Tag>
          ))}
          <TagInput
            value={objectiveInput}
            onChange={(e) => setObjectiveInput(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, addObjective)}
            placeholder="Digite um objetivo e pressione Enter"
          />
        </TagsInput>
      </FormGroup>

      <FormGroup>
        <Label>Técnicas Aplicadas</Label>
        <TagsInput>
          {techniques.map((technique, index) => (
            <Tag key={index}>
              {technique}
              <RemoveTag onClick={() => removeTechnique(index)}>×</RemoveTag>
            </Tag>
          ))}
          <TagInput
            value={techniqueInput}
            onChange={(e) => setTechniqueInput(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, addTechnique)}
            placeholder="Digite uma técnica e pressione Enter"
          />
        </TagsInput>
      </FormGroup>

      <SectionTitle>Observações</SectionTitle>

      <FormGroup>
        <Label htmlFor="notes">Notas da Sessão *</Label>
        <TextArea
          id="notes"
          {...register('notes', { required: 'Notas são obrigatórias' })}
          hasError={!!errors.notes}
          placeholder="Descreva o que foi trabalhado na sessão..."
        />
        {errors.notes && <ErrorMessage>{errors.notes.message}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="nextSessionGoals">Objetivos para Próxima Sessão</Label>
        <TextArea
          id="nextSessionGoals"
          {...register('nextSessionGoals')}
          placeholder="Defina os objetivos para a próxima sessão..."
        />
      </FormGroup>

      <ButtonGroup>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Salvando...' : session ? 'Atualizar Sessão' : 'Registrar Sessão'}
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default SessionForm;
