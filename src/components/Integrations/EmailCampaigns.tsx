import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Mail,
  Plus,
  Send,
  Calendar,
  Users,
  Edit,
  Trash2,
  Eye,
  Clock,
  X,
  Save
} from 'lucide-react';
import { theme } from '../../styles/theme';
import { externalIntegrationsService, EmailCampaign } from '../../services/externalIntegrations';
import { useApp } from '../../context/AppContext';
import { toast } from 'react-toastify';

const CampaignsContainer = styled.div`
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
  justify-content: space-between;
  margin-bottom: ${theme.spacing.xl};
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const HeaderIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.status.warning}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.status.warning};
`;

const HeaderTitle = styled.h2`
  font-size: ${theme.typography.sizes.xl};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${theme.colors.primary}dd;
  }
`;

const CampaignsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const CampaignCard = styled.div`
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.colors.primary};
    box-shadow: ${theme.shadows.sm};
  }
`;

const CampaignHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.md};
`;

const CampaignInfo = styled.div`
  flex: 1;
`;

const CampaignTitle = styled.h3`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.xs} 0;
`;

const CampaignSubject = styled.p`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.secondary};
  margin: 0;
`;

const CampaignActions = styled.div`
  display: flex;
  gap: ${theme.spacing.xs};
`;

const ActionButton = styled.button<{ variant: 'primary' | 'secondary' | 'success' | 'danger' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary}20;
          color: ${theme.colors.primary};
          &:hover { background: ${theme.colors.primary}30; }
        `;
      case 'secondary':
        return `
          background: ${theme.colors.text.secondary}20;
          color: ${theme.colors.text.secondary};
          &:hover { background: ${theme.colors.text.secondary}30; }
        `;
      case 'success':
        return `
          background: ${theme.colors.status.success}20;
          color: ${theme.colors.status.success};
          &:hover { background: ${theme.colors.status.success}30; }
        `;
      case 'danger':
        return `
          background: ${theme.colors.status.error}20;
          color: ${theme.colors.status.error};
          &:hover { background: ${theme.colors.status.error}30; }
        `;
    }
  }}
`;

const CampaignStats = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.secondary};
`;

const CampaignContent = styled.div`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.secondary};
  line-height: 1.4;
  margin-bottom: ${theme.spacing.md};
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CampaignStatus = styled.div<{ status: 'draft' | 'scheduled' | 'sent' }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.medium};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};

  ${props => {
    switch (props.status) {
      case 'draft':
        return `
          background: ${theme.colors.text.secondary}20;
          color: ${theme.colors.text.secondary};
        `;
      case 'scheduled':
        return `
          background: ${theme.colors.status.warning}20;
          color: ${theme.colors.status.warning};
        `;
      case 'sent':
        return `
          background: ${theme.colors.status.success}20;
          color: ${theme.colors.status.success};
        `;
    }
  }}
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
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
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

const FormInput = styled.input`
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

const FormTextarea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.primary};
  background: ${theme.colors.background};
  transition: border-color 0.2s ease;
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
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

const EmailCampaigns: React.FC = () => {
  const { state } = useApp();
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<EmailCampaign | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    recipients: [] as string[],
    scheduledFor: ''
  });

  useEffect(() => {
    // Carregar campanhas existentes (simulado)
    const mockCampaigns: EmailCampaign[] = [
      {
        id: '1',
        name: 'Boas-vindas Novos Pacientes',
        subject: 'Bem-vindo ao Serena Psicologia',
        content: 'Olá! Bem-vindo ao nosso consultório. Estamos aqui para ajudá-lo em sua jornada de bem-estar mental.',
        recipients: state.patients.map(p => p.email),
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'Lembrete de Consulta',
        subject: 'Lembrete: Sua consulta está chegando',
        content: 'Este é um lembrete de que você tem uma consulta agendada. Por favor, confirme sua presença.',
        recipients: state.patients.map(p => p.email),
        scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      }
    ];
    setCampaigns(mockCampaigns);
  }, [state.patients]);

  const handleCreateCampaign = () => {
    setEditingCampaign(null);
    setFormData({
      name: '',
      subject: '',
      content: '',
      recipients: state.patients.map(p => p.email),
      scheduledFor: ''
    });
    setIsModalOpen(true);
  };

  const handleEditCampaign = (campaign: EmailCampaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      subject: campaign.subject,
      content: campaign.content,
      recipients: campaign.recipients,
      scheduledFor: campaign.scheduledFor ? new Date(campaign.scheduledFor).toISOString().slice(0, 16) : ''
    });
    setIsModalOpen(true);
  };

  const handleSaveCampaign = async () => {
    if (!formData.name || !formData.subject || !formData.content) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const campaign: EmailCampaign = {
      id: editingCampaign?.id || Date.now().toString(),
      name: formData.name,
      subject: formData.subject,
      content: formData.content,
      recipients: formData.recipients,
      scheduledFor: formData.scheduledFor ? new Date(formData.scheduledFor) : undefined
    };

    try {
      const success = await externalIntegrationsService.sendEmailCampaign(campaign);
      if (success) {
        if (editingCampaign) {
          setCampaigns(campaigns.map(c => c.id === campaign.id ? campaign : c));
          toast.success('Campanha atualizada com sucesso!');
        } else {
          setCampaigns([...campaigns, campaign]);
          toast.success('Campanha criada com sucesso!');
        }
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error('Erro ao salvar campanha');
    }
  };

  const handleDeleteCampaign = (campaignId: string) => {
    setCampaigns(campaigns.filter(c => c.id !== campaignId));
    toast.success('Campanha removida com sucesso!');
  };

  const handleSendNow = async (campaign: EmailCampaign) => {
    try {
      const success = await externalIntegrationsService.sendEmailCampaign(campaign);
      if (success) {
        toast.success('Campanha enviada com sucesso!');
      }
    } catch (error) {
      toast.error('Erro ao enviar campanha');
    }
  };

  const getCampaignStatus = (campaign: EmailCampaign): 'draft' | 'scheduled' | 'sent' => {
    if (campaign.scheduledFor && campaign.scheduledFor > new Date()) {
      return 'scheduled';
    }
    return 'draft';
  };

  return (
    <CampaignsContainer>
      <SectionHeader>
        <HeaderInfo>
          <HeaderIcon>
            <Mail size={24} />
          </HeaderIcon>
          <HeaderTitle>Campanhas de Email</HeaderTitle>
        </HeaderInfo>
        <CreateButton onClick={handleCreateCampaign}>
          <Plus size={16} />
          Nova Campanha
        </CreateButton>
      </SectionHeader>

      <CampaignsGrid>
        {campaigns.map((campaign) => {
          const status = getCampaignStatus(campaign);

          return (
            <CampaignCard key={campaign.id}>
              <CampaignHeader>
                <CampaignInfo>
                  <CampaignTitle>{campaign.name}</CampaignTitle>
                  <CampaignSubject>{campaign.subject}</CampaignSubject>
                </CampaignInfo>
                <CampaignActions>
                  <ActionButton
                    variant="secondary"
                    onClick={() => handleEditCampaign(campaign)}
                    title="Editar"
                  >
                    <Edit size={14} />
                  </ActionButton>
                  <ActionButton
                    variant="success"
                    onClick={() => handleSendNow(campaign)}
                    title="Enviar Agora"
                  >
                    <Send size={14} />
                  </ActionButton>
                  <ActionButton
                    variant="danger"
                    onClick={() => handleDeleteCampaign(campaign.id)}
                    title="Excluir"
                  >
                    <Trash2 size={14} />
                  </ActionButton>
                </CampaignActions>
              </CampaignHeader>

              <CampaignStats>
                <StatItem>
                  <Users size={14} />
                  {campaign.recipients.length} destinatários
                </StatItem>
                {campaign.scheduledFor && (
                  <StatItem>
                    <Calendar size={14} />
                    {campaign.scheduledFor ? new Date(campaign.scheduledFor).toLocaleDateString('pt-BR') : 'Não agendado'}
                  </StatItem>
                )}
              </CampaignStats>

              <CampaignContent>
                {campaign.content}
              </CampaignContent>

              <CampaignStatus status={status}>
                {status === 'draft' && <Edit size={12} />}
                {status === 'scheduled' && <Clock size={12} />}
                {status === 'sent' && <Send size={12} />}
                {status === 'draft' && 'Rascunho'}
                {status === 'scheduled' && 'Agendada'}
                {status === 'sent' && 'Enviada'}
              </CampaignStatus>
            </CampaignCard>
          );
        })}
      </CampaignsGrid>

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {editingCampaign ? 'Editar Campanha' : 'Nova Campanha'}
            </ModalTitle>
            <CloseButton onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </CloseButton>
          </ModalHeader>

          <FormGroup>
            <FormLabel>Nome da Campanha</FormLabel>
            <FormInput
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Digite o nome da campanha"
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Assunto</FormLabel>
            <FormInput
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Digite o assunto do email"
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Conteúdo</FormLabel>
            <FormTextarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Digite o conteúdo do email"
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Agendar Envio (Opcional)</FormLabel>
            <FormInput
              type="datetime-local"
              value={formData.scheduledFor}
              onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
            />
          </FormGroup>

          <ModalActions>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSaveCampaign}>
              <Save size={16} />
              {editingCampaign ? 'Atualizar' : 'Criar'} Campanha
            </Button>
          </ModalActions>
        </ModalContent>
      </Modal>
    </CampaignsContainer>
  );
};

export default EmailCampaigns;
