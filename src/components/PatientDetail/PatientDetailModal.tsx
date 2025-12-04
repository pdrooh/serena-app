import React, { useState } from 'react';
import styled from 'styled-components';
import {
  X,
  User,
  Calendar,
  DollarSign,
  Paperclip,
  MessageSquare,
  FileText,
  Download,
  Upload,
  Plus,
  Trash2,
  MapPin,
  Heart
} from 'lucide-react';
import { theme } from '../../styles/theme';
import { Patient } from '../../types';
import { useApp } from '../../context/AppContext';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: ${theme.spacing.lg};
`;

const ModalContent = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.xl};
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: ${theme.shadows.xl};
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: ${theme.spacing.xl};
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${theme.colors.primary};
  color: white;
`;

const ModalTitle = styled.h2`
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.bold};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.colors.border};
  background: ${theme.colors.background};
`;

const Tab = styled.button<{ active: boolean }>`
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  border: none;
  background: ${props => props.active ? theme.colors.surface : 'transparent'};
  color: ${props => props.active ? theme.colors.primary : theme.colors.text.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-weight: ${props => props.active ? theme.typography.weights.semibold : theme.typography.weights.medium};
  border-bottom: 2px solid ${props => props.active ? theme.colors.primary : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? theme.colors.surface : theme.colors.background};
    color: ${theme.colors.primary};
  }
`;

const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${theme.spacing.xl};
`;

const PatientInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const InfoSection = styled.div`
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  border: 1px solid ${theme.colors.border};
`;

const SectionTitle = styled.h3`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.md} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.sm};
  color: ${theme.colors.text.secondary};

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  font-weight: ${theme.typography.weights.medium};
  min-width: 120px;
`;

const InfoValue = styled.span`
  color: ${theme.colors.text.primary};
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.sizes.sm};
  font-weight: ${theme.typography.weights.medium};
  background: ${props => {
    switch (props.status) {
      case 'ativo': return theme.colors.status.success + '20';
      case 'inativo': return theme.colors.status.error + '20';
      case 'suspenso': return theme.colors.status.warning + '20';
      default: return theme.colors.text.secondary + '20';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'ativo': return theme.colors.status.success;
      case 'inativo': return theme.colors.status.error;
      case 'suspenso': return theme.colors.status.warning;
      default: return theme.colors.text.secondary;
    }
  }};
`;

const DataTable = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border};
  overflow: hidden;
`;

const TableHeader = styled.div`
  background: ${theme.colors.background};
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
`;

const TableRow = styled.div`
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: ${theme.spacing.md};
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${theme.colors.background};
  }
`;

const TableCell = styled.div`
  color: ${theme.colors.text.secondary};
`;

const TableCellPrimary = styled.div`
  color: ${theme.colors.text.primary};
  font-weight: ${theme.typography.weights.medium};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing['3xl']};
  color: ${theme.colors.text.secondary};
`;

const EmptyIcon = styled.div`
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.text.light};
`;

const AttachmentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.md};
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border};
  margin-bottom: ${theme.spacing.sm};

  &:last-child {
    margin-bottom: 0;
  }
`;

const AttachmentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const AttachmentActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: ${theme.spacing.sm};
  border: none;
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: ${theme.typography.sizes.sm};

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary};
          color: white;
          &:hover { background: ${theme.colors.primary}dd; }
        `;
      case 'danger':
        return `
          background: ${theme.colors.status.error};
          color: white;
          &:hover { background: ${theme.colors.status.error}dd; }
        `;
      default:
        return `
          background: ${theme.colors.background};
          color: ${theme.colors.text.secondary};
          border: 1px solid ${theme.colors.border};
          &:hover { background: ${theme.colors.surface}; }
        `;
    }
  }}
`;

const CommentItem = styled.div`
  padding: ${theme.spacing.lg};
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border};
  margin-bottom: ${theme.spacing.md};

  &:last-child {
    margin-bottom: 0;
  }
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.sm};
`;

const CommentDate = styled.span`
  color: ${theme.colors.text.light};
  font-size: ${theme.typography.sizes.sm};
`;

const CommentText = styled.p`
  color: ${theme.colors.text.primary};
  margin: 0;
  line-height: 1.6;
`;

const AddCommentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.lg};
`;

const TextArea = styled.textarea`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-family: inherit;
  font-size: ${theme.typography.sizes.base};
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border: none;
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-weight: ${theme.typography.weights.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  transition: all 0.2s ease;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary};
          color: white;
          &:hover { background: ${theme.colors.primary}dd; }
        `;
      default:
        return `
          background: ${theme.colors.background};
          color: ${theme.colors.text.secondary};
          border: 1px solid ${theme.colors.border};
          &:hover { background: ${theme.colors.surface}; }
        `;
    }
  }}
`;

interface PatientDetailModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
  patient,
  isOpen,
  onClose
}) => {
  const { state, addComment } = useApp();
  const [activeTab, setActiveTab] = useState('info');
  const [newComment, setNewComment] = useState('');

  if (!isOpen || !patient) return null;

  const patientSessions = state.sessions?.filter(session => session.patientId === patient.id) || [];
  // patientAppointments não utilizado - removido
  const patientPayments = state.payments?.filter(payment => payment.patientId === patient.id) || [];

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && patient) {
      try {
        await addComment(patient.id, newComment.trim(), 'Sistema');
        setNewComment('');
      } catch (error) {
        console.error('Erro ao adicionar comentário:', error);
      }
    }
  };

  const handleUploadFile = () => {
    // TODO: Implementar upload de arquivo
    console.log('Upload de arquivo');
  };

  const tabs = [
    { id: 'info', label: 'Ficha Técnica', icon: User },
    { id: 'sessions', label: 'Consultas', icon: Calendar },
    { id: 'financial', label: 'Financeiro', icon: DollarSign },
    { id: 'attachments', label: 'Anexos', icon: Paperclip },
    { id: 'comments', label: 'Comentários', icon: MessageSquare }
  ];

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <User size={24} />
            {patient.name}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <TabsContainer>
            {tabs.map(tab => (
              <Tab
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={18} />
                {tab.label}
              </Tab>
            ))}
          </TabsContainer>

          <TabContent>
            {activeTab === 'info' && (
              <div>
                <PatientInfo>
                  <InfoSection>
                    <SectionTitle>
                      <User size={20} />
                      Informações Pessoais
                    </SectionTitle>
                    <InfoItem>
                      <InfoLabel>Nome:</InfoLabel>
                      <InfoValue>{patient.name}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Email:</InfoLabel>
                      <InfoValue>{patient.email}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Telefone:</InfoLabel>
                      <InfoValue>{patient.phone}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Data de Nascimento:</InfoLabel>
                      <InfoValue>
                        {patient.age ? `${patient.age} anos` : 'Não informado'}
                      </InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>CPF:</InfoLabel>
                      <InfoValue>Não informado</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Status:</InfoLabel>
                      <StatusBadge status='ativo'>
                        Ativo
                      </StatusBadge>
                    </InfoItem>
                  </InfoSection>

                  <InfoSection>
                    <SectionTitle>
                      <MapPin size={20} />
                      Endereço
                    </SectionTitle>
                    <InfoItem>
                      <InfoLabel>Endereço:</InfoLabel>
                      <InfoValue>{patient.address || 'Não informado'}</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Cidade:</InfoLabel>
                      <InfoValue>Não informado</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>Estado:</InfoLabel>
                      <InfoValue>Não informado</InfoValue>
                    </InfoItem>
                    <InfoItem>
                      <InfoLabel>CEP:</InfoLabel>
                      <InfoValue>Não informado</InfoValue>
                    </InfoItem>
                  </InfoSection>
                </PatientInfo>

                <InfoSection>
                  <SectionTitle>
                    <Heart size={20} />
                    Informações Médicas
                  </SectionTitle>
                  <InfoItem>
                    <InfoLabel>Diagnóstico Principal:</InfoLabel>
                    <InfoValue>Não informado</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Medicações:</InfoLabel>
                    <InfoValue>Nenhuma</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Alergias:</InfoLabel>
                    <InfoValue>Nenhuma</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Observações:</InfoLabel>
                    <InfoValue>{patient.initialObservations || 'Nenhuma'}</InfoValue>
                  </InfoItem>
                </InfoSection>
              </div>
            )}

            {activeTab === 'sessions' && (
              <div>
                <DataTable>
                  <TableHeader>
                    <div>Data</div>
                    <div>Duração</div>
                    <div>Tipo</div>
                    <div>Status</div>
                  </TableHeader>
                  {patientSessions.length > 0 ? (
                    patientSessions
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map(session => (
                        <TableRow key={session.id}>
                          <TableCellPrimary>
                            {new Date(session.date).toLocaleDateString('pt-BR')}
                          </TableCellPrimary>
                          <TableCell>{session.duration} min</TableCell>
                          <TableCell>{session.type}</TableCell>
                          <TableCell>
                            <StatusBadge status='concluida'>
                              Concluída
                            </StatusBadge>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <EmptyState>
                      <EmptyIcon>
                        <Calendar size={48} />
                      </EmptyIcon>
                      <p>Nenhuma consulta encontrada</p>
                    </EmptyState>
                  )}
                </DataTable>
              </div>
            )}

            {activeTab === 'financial' && (
              <div>
                <DataTable>
                  <TableHeader>
                    <div>Data</div>
                    <div>Valor</div>
                    <div>Método</div>
                    <div>Status</div>
                  </TableHeader>
                  {patientPayments.length > 0 ? (
                    patientPayments
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map(payment => (
                        <TableRow key={payment.id}>
                          <TableCellPrimary>
                            {new Date(payment.date).toLocaleDateString('pt-BR')}
                          </TableCellPrimary>
                          <TableCell>R$ {payment.amount.toFixed(2)}</TableCell>
                          <TableCell>{payment.method}</TableCell>
                          <TableCell>
                            <StatusBadge status={payment.status}>
                              {payment.status}
                            </StatusBadge>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <EmptyState>
                      <EmptyIcon>
                        <DollarSign size={48} />
                      </EmptyIcon>
                      <p>Nenhum pagamento encontrado</p>
                    </EmptyState>
                  )}
                </DataTable>
              </div>
            )}

            {activeTab === 'attachments' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg }}>
                  <SectionTitle>
                    <Paperclip size={20} />
                    Anexos
                  </SectionTitle>
                  <Button variant="primary" onClick={handleUploadFile}>
                    <Upload size={16} />
                    Adicionar Anexo
                  </Button>
                </div>

                {patient.documents && patient.documents.length > 0 ? (
                  patient.documents.map((doc, index) => (
                    <AttachmentItem key={index}>
                      <AttachmentInfo>
                        <FileText size={20} />
                        <div>
                          <div style={{ fontWeight: theme.typography.weights.medium }}>
                            {doc.name}
                          </div>
                          <div style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.text.light }}>
                            {doc.type} • {new Date(doc.uploadedAt).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </AttachmentInfo>
                      <AttachmentActions>
                        <ActionButton variant="secondary">
                          <Eye size={16} />
                        </ActionButton>
                        <ActionButton variant="secondary">
                          <Download size={16} />
                        </ActionButton>
                        <ActionButton variant="danger">
                          <Trash2 size={16} />
                        </ActionButton>
                      </AttachmentActions>
                    </AttachmentItem>
                  ))
                ) : (
                  <EmptyState>
                    <EmptyIcon>
                      <Paperclip size={48} />
                    </EmptyIcon>
                    <p>Nenhum anexo encontrado</p>
                  </EmptyState>
                )}
              </div>
            )}

            {activeTab === 'comments' && (
              <div>
                <SectionTitle>
                  <MessageSquare size={20} />
                  Comentários
                </SectionTitle>

                {patient.comments && patient.comments.length > 0 ? (
                  patient.comments.map((comment, index) => (
                    <CommentItem key={comment.id || index}>
                      <CommentHeader>
                        <span style={{ fontWeight: theme.typography.weights.medium }}>
                          {comment.author}
                        </span>
                        <CommentDate>
                          {new Date(comment.date).toLocaleDateString('pt-BR')}
                        </CommentDate>
                      </CommentHeader>
                      <CommentText>{comment.text}</CommentText>
                    </CommentItem>
                  ))
                ) : (
                  <EmptyState>
                    <EmptyIcon>
                      <MessageSquare size={48} />
                    </EmptyIcon>
                    <p>Nenhum comentário encontrado</p>
                  </EmptyState>
                )}

                <AddCommentForm onSubmit={handleAddComment}>
                  <TextArea
                    placeholder="Adicione um comentário sobre o paciente..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button variant="primary" type="submit">
                    <Plus size={16} />
                    Adicionar Comentário
                  </Button>
                </AddCommentForm>
              </div>
            )}
          </TabContent>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default PatientDetailModal;
