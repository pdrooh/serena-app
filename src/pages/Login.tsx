import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, User, Lock, Mail } from 'lucide-react';
import { theme } from '../styles/theme';

const LoginContainer = styled.div`
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

const LoginCard = styled.div`
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

  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.xl};
  }
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

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 50px;
    height: 50px;
    font-size: ${theme.typography.sizes.xl};
  }
`;

const LogoText = styled.h1`
  font-size: ${theme.typography.sizes['3xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.text.primary};
  margin: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes['2xl']};
  }
`;

const Title = styled.h2`
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes.xl};
    margin-bottom: ${theme.spacing.lg};
  }
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

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.sm} ${theme.spacing.sm} 2.5rem;
    font-size: ${theme.typography.sizes.sm};
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

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.typography.sizes.sm};
  }
`;

const SwitchMode = styled.div`
  text-align: center;
  margin-top: ${theme.spacing.lg};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.sm};
`;

const InfoText = styled.p`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.secondary};
  line-height: 1.5;
  margin: 0;
`;

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await onLogin(data.email, data.password);
    } catch (error) {
      console.error('Erro no login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>
          <LogoIcon>S</LogoIcon>
          <LogoText>Serena</LogoText>
        </Logo>

        <Title>Entrar na sua conta</Title>

        <Form onSubmit={handleSubmit(onSubmit)}>
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
                {...register('password', { required: 'Senha é obrigatória' })}
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
          </FormGroup>

          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Form>

        <SwitchMode>
          <InfoText>
            Apenas usuários autorizados podem acessar o sistema.
            <br />
            Para criar uma conta, entre em contato com o administrador.
          </InfoText>
        </SwitchMode>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
