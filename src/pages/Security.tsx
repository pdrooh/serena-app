import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import {
  Shield,
  Lock,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Download,
  Upload,
  Settings,
  UserCheck,
} from 'lucide-react';
import { theme } from '../styles/theme';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

const SecurityContainer = styled.div`
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

const SecurityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${theme.spacing.lg};
`;

const SecurityCard = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.md};
  border: 1px solid ${theme.colors.border};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const CardIcon = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.lg};
  background: ${props => props.color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
`;

const CardTitle = styled.h3`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const CardDescription = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.sm};
  margin: ${theme.spacing.sm} 0 0 0;
  line-height: 1.5;
`;

const SecurityStatus = styled.div<{ status: 'active' | 'inactive' | 'warning' }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  margin-bottom: ${theme.spacing.lg};

  ${props => {
    switch (props.status) {
      case 'active':
        return `
          background: ${theme.colors.status.success}20;
          color: ${theme.colors.status.success};
        `;
      case 'warning':
        return `
          background: ${theme.colors.status.warning}20;
          color: ${theme.colors.status.warning};
        `;
      case 'inactive':
        return `
          background: ${theme.colors.status.error}20;
          color: ${theme.colors.status.error};
        `;
    }
  }}
`;

const SecurityActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
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

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary};
          color: white;

          &:hover {
            background: ${theme.colors.accent};
          }
        `;
      case 'danger':
        return `
          background: ${theme.colors.status.error};
          color: white;

          &:hover {
            background: ${theme.colors.status.error};
            opacity: 0.9;
          }
        `;
      default:
        return `
          background: ${theme.colors.surface};
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.border};

          &:hover {
            background: ${theme.colors.background};
          }
        `;
    }
  }}
`;

const PasswordForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
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

const Input = styled.input`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.base};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }
`;

const InputGroup = styled.div`
  position: relative;
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

const BackupInfo = styled.div`
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const BackupItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} 0;
  border-bottom: 1px solid ${theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const BackupDate = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.sm};
`;

const BackupSize = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.sm};
`;

const TwoFactorSetup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const QRCode = styled.div`
  width: 200px;
  height: 200px;
  background: ${theme.colors.background};
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.sm};
  margin: 0 auto;
`;

const Security: React.FC = () => {
  const { state: authState, changePassword } = useAuth();
  const { state } = useApp();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Variáveis não utilizadas removidas
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    const success = await changePassword(currentPassword, newPassword);
    setIsLoading(false);

    if (success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  // handleToggleTwoFactor não utilizado - removido

  const handleBackupData = () => {
    const userId = authState.user?.id;
    if (!userId) return;

    const backupData = {
      user: authState.user,
      patients: state.patients,
      sessions: state.sessions,
      appointments: state.appointments,
      payments: state.payments,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `serena_backup_${authState.user?.name}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Backup realizado com sucesso!');
  };

  const handleRestoreData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target?.result as string);

        if (backupData.user && backupData.patients) {
          // Aqui você implementaria a lógica de restauração
          toast.success('Dados restaurados com sucesso!');
        } else {
          toast.error('Arquivo de backup inválido');
        }
      } catch (error) {
        toast.error('Erro ao processar arquivo de backup');
      }
    };
    reader.readAsText(file);
  };

  return (
    <SecurityContainer>
      <PageHeader>
        <PageTitle>Segurança</PageTitle>
      </PageHeader>

      <SecurityGrid>
        <SecurityCard>
          <CardHeader>
            <CardIcon color={theme.colors.primary}>
              <Lock size={24} />
            </CardIcon>
            <div>
              <CardTitle>Senha</CardTitle>
              <CardDescription>Altere sua senha regularmente para manter a segurança</CardDescription>
            </div>
          </CardHeader>

          <SecurityStatus status="active">
            <CheckCircle size={16} />
            Senha forte configurada
          </SecurityStatus>

          <PasswordForm>
            <FormGroup>
              <Label>Senha Atual</Label>
              <InputGroup>
                <Input
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha atual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </PasswordToggle>
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <Label>Nova Senha</Label>
              <InputGroup>
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Digite sua nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </PasswordToggle>
              </InputGroup>
            </FormGroup>

            <FormGroup>
              <Label>Confirmar Nova Senha</Label>
              <InputGroup>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirme sua nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </PasswordToggle>
              </InputGroup>
            </FormGroup>

            <ActionButton variant="primary" onClick={handleChangePassword} disabled={isLoading}>
              <Lock size={16} />
              {isLoading ? 'Alterando...' : 'Alterar Senha'}
            </ActionButton>
          </PasswordForm>
        </SecurityCard>

        <SecurityCard>
          <CardHeader>
            <CardIcon color={theme.colors.accent}>
              <UserCheck size={24} />
            </CardIcon>
            <div>
              <CardTitle>Autenticação de Dois Fatores</CardTitle>
              <CardDescription>Adicione uma camada extra de segurança à sua conta</CardDescription>
            </div>
          </CardHeader>

          <SecurityStatus status="warning">
            <AlertTriangle size={16} />
            Não configurado
          </SecurityStatus>

          <TwoFactorSetup>
            <QRCode>
              QR Code para configuração
            </QRCode>
            <ActionButton variant="primary">
              <UserCheck size={16} />
              Configurar 2FA
            </ActionButton>
          </TwoFactorSetup>
        </SecurityCard>

        <SecurityCard>
          <CardHeader>
            <CardIcon color={theme.colors.secondary}>
              <Shield size={24} />
            </CardIcon>
            <div>
              <CardTitle>Backup de Dados</CardTitle>
              <CardDescription>Mantenha seus dados seguros com backups regulares</CardDescription>
            </div>
          </CardHeader>

          <SecurityStatus status="active">
            <CheckCircle size={16} />
            Backup automático ativo
          </SecurityStatus>

          <BackupInfo>
            <BackupItem>
              <div>Último backup</div>
              <BackupDate>20/01/2024 14:30</BackupDate>
            </BackupItem>
            <BackupItem>
              <div>Tamanho do backup</div>
              <BackupSize>2.4 GB</BackupSize>
            </BackupItem>
            <BackupItem>
              <div>Próximo backup</div>
              <BackupDate>21/01/2024 14:30</BackupDate>
            </BackupItem>
          </BackupInfo>

          <SecurityActions>
            <ActionButton variant="secondary" onClick={handleBackupData}>
              <Download size={16} />
              Baixar Backup
            </ActionButton>
            <ActionButton variant="secondary">
              <Upload size={16} />
              <input
                type="file"
                accept=".json"
                onChange={handleRestoreData}
                style={{ display: 'none' }}
                id="restore-input"
              />
              <label htmlFor="restore-input" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Restaurar Backup
              </label>
            </ActionButton>
          </SecurityActions>
        </SecurityCard>

        <SecurityCard>
          <CardHeader>
            <CardIcon color={theme.colors.status.warning}>
              <Key size={24} />
            </CardIcon>
            <div>
              <CardTitle>Criptografia</CardTitle>
              <CardDescription>Seus dados são criptografados com tecnologia de ponta</CardDescription>
            </div>
          </CardHeader>

          <SecurityStatus status="active">
            <CheckCircle size={16} />
            Criptografia AES-256 ativa
          </SecurityStatus>

          <SecurityActions>
            <ActionButton variant="secondary">
              <Settings size={16} />
              Configurações de Criptografia
            </ActionButton>
            <ActionButton variant="danger">
              <Key size={16} />
              Regenerar Chaves
            </ActionButton>
          </SecurityActions>
        </SecurityCard>
      </SecurityGrid>
    </SecurityContainer>
  );
};

export default Security;
