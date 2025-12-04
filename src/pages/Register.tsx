import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, User, Lock, Mail } from 'lucide-react';
import { theme } from '../styles/theme';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${theme.colors.primary}20, ${theme.colors.accent}20);
  padding: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm};
    align-items: flex-start;
    padding-top: ${theme.spacing.xl};
  }
`;

const RegisterCard = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing['3xl']};
  box-shadow: ${theme.shadows.xl};
  width: 100%;
  max-width: 400px;
  border: 1px solid ${theme.colors.border};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.xl};
    max-width: 100%;
    border-radius: ${theme.borderRadius.lg};
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing['2xl']};
`;

const LogoIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent});
  border-radius: ${theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${theme.typography.weights.bold};
  font-size: ${theme.typography.sizes['2xl']};
`;

const LogoText = styled.h1`
  font-size: ${theme.typography.sizes['3xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const Title = styled.h2`
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
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

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: ${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.md} 3rem;
  border: 1px solid ${props => props.hasError ? theme.colors.status.error : theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.base};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
    outline: none;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: ${theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.text.secondary};
  pointer-events: none;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: ${theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.text.secondary};
  padding: ${theme.spacing.xs};

  &:hover {
    color: ${theme.colors.text.primary};
  }
`;

const ErrorMessage = styled.span`
  color: ${theme.colors.status.error};
  font-size: ${theme.typography.sizes.sm};
  margin-top: ${theme.spacing.xs};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  width: 100%;
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
`;

const SwitchMode = styled.div`
  text-align: center;
  margin-top: ${theme.spacing.lg};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.sm};
`;

const SwitchLink = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary};
  cursor: pointer;
  font-weight: ${theme.typography.weights.medium};
  text-decoration: underline;

  &:hover {
    color: ${theme.colors.accent};
  }
`;

const PasswordRequirements = styled.div`
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  margin-top: ${theme.spacing.sm};
`;

const Requirement = styled.div<{ valid: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.typography.sizes.sm};
  color: ${props => props.valid ? theme.colors.status.success : theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.xs};

  &:last-child {
    margin-bottom: 0;
  }
`;

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterProps {
  onSwitchToLogin: () => void;
  onRegister: (name: string, email: string, password: string) => Promise<void>;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin, onRegister }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch('password', '');

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      return;
    }
    setIsLoading(true);
    try {
      await onRegister(data.name, data.email, data.password);
    } catch (error) {
      console.error('Erro no registro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isPasswordValid = (password: string) => {
    return {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
    };
  };

  const passwordValidation = isPasswordValid(password);

  return (
    <RegisterContainer>
      <RegisterCard>
        <Logo>
          <LogoIcon>S</LogoIcon>
          <LogoText>Serena</LogoText>
        </Logo>

        <Title>Criar sua conta</Title>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label htmlFor="name">Nome Completo</Label>
            <InputContainer>
              <InputIcon>
                <User size={20} />
              </InputIcon>
              <Input
                id="name"
                type="text"
                placeholder="Digite seu nome completo"
                {...register('name', {
                  required: 'Nome é obrigatório',
                  minLength: {
                    value: 2,
                    message: 'Nome deve ter pelo menos 2 caracteres'
                  }
                })}
                hasError={!!errors.name}
              />
            </InputContainer>
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">E-mail</Label>
            <InputContainer>
              <InputIcon>
                <Mail size={20} />
              </InputIcon>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                {...register('email', {
                  required: 'E-mail é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'E-mail inválido'
                  }
                })}
                hasError={!!errors.email}
              />
            </InputContainer>
            {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Senha</Label>
            <InputContainer>
              <InputIcon>
                <Lock size={20} />
              </InputIcon>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                {...register('password', {
                  required: 'Senha é obrigatória',
                  minLength: {
                    value: 6,
                    message: 'Senha deve ter pelo menos 6 caracteres'
                  }
                })}
                hasError={!!errors.password}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </PasswordToggle>
            </InputContainer>
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}

            {password && (
              <PasswordRequirements>
                <Requirement valid={passwordValidation.length}>
                  ✓ Pelo menos 6 caracteres
                </Requirement>
                <Requirement valid={passwordValidation.uppercase}>
                  ✓ Uma letra maiúscula
                </Requirement>
                <Requirement valid={passwordValidation.lowercase}>
                  ✓ Uma letra minúscula
                </Requirement>
                <Requirement valid={passwordValidation.number}>
                  ✓ Um número
                </Requirement>
              </PasswordRequirements>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <InputContainer>
              <InputIcon>
                <Lock size={20} />
              </InputIcon>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirme sua senha"
                {...register('confirmPassword', {
                  required: 'Confirmação de senha é obrigatória',
                  validate: (value) => value === password || 'Senhas não coincidem'
                })}
                hasError={!!errors.confirmPassword}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </PasswordToggle>
            </InputContainer>
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>}
          </FormGroup>

          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </Form>

        <SwitchMode>
          Já tem uma conta?{' '}
          <SwitchLink onClick={onSwitchToLogin}>
            Fazer login
          </SwitchLink>
        </SwitchMode>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;
