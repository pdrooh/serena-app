import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import {
  Plus,
  Search,
  Filter,
  FileText,
  Calendar,
  User,
  Mic,
  Paperclip,
  Edit,
  Eye,
  Trash2
} from 'lucide-react';
import { theme } from '../styles/theme';
import { Session } from '../types';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal/Modal';
import SessionForm from '../components/Forms/SessionForm';

const RecordsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: ${theme.spacing.lg};
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.spacing.sm};
  }
`;

const PageTitle = styled.h1`
  font-size: ${theme.typography.sizes['3xl']};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes['2xl']};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  border: none;

  ${props => props.variant === 'primary' ? `
    background: ${theme.colors.primary};
    color: white;

    &:hover {
      background: ${theme.colors.accent};
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

const SearchAndFilter = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${theme.spacing.sm};
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.base};

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }
`;

const FilterButton = styled.button`
  padding: ${theme.spacing.md};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.text.secondary};

  &:hover {
    background: ${theme.colors.background};
  }
`;

const RecordsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const RecordCard = styled.div`
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

const RecordHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.md};
`;

const RecordInfo = styled.div`
  flex: 1;
`;

const PatientName = styled.h3`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.xs} 0;
`;

const SessionDate = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.sm};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const SessionType = styled.div<{ type: 'presencial' | 'online' }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.medium};
  background: ${props => props.type === 'presencial' ? `${theme.colors.primary}20` : `${theme.colors.secondary}20`};
  color: ${props => props.type === 'presencial' ? theme.colors.primary : theme.colors.secondary};
`;

const RecordActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  position: relative;
`;

const ActionButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${theme.colors.text.secondary};

  &:hover {
    background: ${theme.colors.primary};
    color: white;
  }
`;

const SessionNotes = styled.div`
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
  border-left: 4px solid ${theme.colors.primary};
`;

const NotesText = styled.p`
  color: ${theme.colors.text.primary};
  line-height: 1.6;
  margin: 0;
`;

const SessionDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.sm};
`;

const MoodIndicator = styled.div<{ mood: number }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.typography.sizes.sm};
  color: ${props => {
    if (props.mood >= 7) return theme.colors.status.success;
    if (props.mood >= 4) return theme.colors.status.warning;
    return theme.colors.status.error;
  }};
`;

const MoodBar = styled.div<{ mood: number }>`
  width: 60px;
  height: 4px;
  background: ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: ${props => props.mood * 10}%;
    height: 100%;
    background: ${props => {
    if (props.mood >= 7) return theme.colors.status.success;
    if (props.mood >= 4) return theme.colors.status.warning;
    return theme.colors.status.error;
  }};
    transition: width 0.3s ease;
  }
`;

const Attachments = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};
`;

const AttachmentItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.text.secondary};
`;

const Records: React.FC = () => {
  const { state, addSession, updateSession, deleteSession, getPatientById } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [showSessionMenu, setShowSessionMenu] = useState<string | null>(null);

  const filteredSessions = state.sessions.filter(session => {
    const patient = getPatientById(session.patientId);
    return (
      session.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.objectives.some(obj => obj.toLowerCase().includes(searchTerm.toLowerCase())) ||
      session.techniques.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (patient && patient.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleOpenModal = (session?: Session) => {
    setEditingSession(session);
    setIsModalOpen(true);
    setShowSessionMenu(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSession(undefined);
  };

  const handleSubmitSession = async (data: any) => {
    setIsLoading(true);
    try {
      if (editingSession) {
        await updateSession(editingSession.id, {
          ...data,
          date: new Date(data.date),
        });
        toast.success('Sessão atualizada com sucesso!');
      } else {
        await addSession({
          ...data,
          date: new Date(data.date),
          attachments: [],
        });
        toast.success('Sessão registrada com sucesso!');
      }

      handleCloseModal();
    } catch (error: any) {
      console.error('Erro ao salvar sessão:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Erro ao salvar sessão';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta sessão? Esta ação não pode ser desfeita.')) {
      try {
        setIsLoading(true);
        await deleteSession(sessionId);
        toast.success('Sessão excluída com sucesso!');
        setShowSessionMenu(null);
      } catch (error: any) {
        console.error('Erro ao deletar sessão:', error);
        const errorMessage = error?.response?.data?.error || error?.message || 'Erro ao excluir sessão';
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <RecordsContainer>
      <PageHeader>
        <PageTitle>Prontuários</PageTitle>
        <HeaderActions>
          <Button variant="secondary">
            <Filter size={20} />
            Filtros
          </Button>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            <Plus size={20} />
            Nova Sessão
          </Button>
        </HeaderActions>
      </PageHeader>

      <SearchAndFilter>
        <SearchInput
          type="text"
          placeholder="Buscar por notas, objetivos ou técnicas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterButton>
          <Search size={20} />
        </FilterButton>
      </SearchAndFilter>

      <RecordsList>
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => {
            const patient = getPatientById(session.patientId);
            return (
              <RecordCard key={session.id}>
                <RecordHeader>
                  <RecordInfo>
                    <PatientName>{patient?.name || 'Paciente não encontrado'}</PatientName>
                    <SessionDate>
                      <Calendar size={16} />
                      {new Date(session.date).toLocaleDateString('pt-BR')} - {session.duration}min
                    </SessionDate>
                  </RecordInfo>
                  <RecordActions>
                    <SessionType type={session.type}>
                      {session.type === 'presencial' ? 'Presencial' : 'Online'}
                    </SessionType>
                    <ActionButton onClick={() => setShowSessionMenu(showSessionMenu === session.id ? null : session.id)}>
                      <Edit size={16} />
                    </ActionButton>
                    {showSessionMenu === session.id && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '4px',
                        background: 'white',
                        border: '1px solid #E1E8ED',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000,
                        minWidth: '120px'
                      }}>
                        <button
                          onClick={() => handleOpenModal(session)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#f8f9fa'}
                          onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'transparent'}
                        >
                          <Edit size={16} />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#E74C3C',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#fef2f2'}
                          onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'transparent'}
                        >
                          <Trash2 size={16} />
                          Excluir
                        </button>
                      </div>
                    )}
                  </RecordActions>
                </RecordHeader>

                <SessionNotes>
                  <NotesText>{session.notes}</NotesText>
                </SessionNotes>

                <SessionDetails>
                  <DetailItem>
                    <User size={16} />
                    Humor:
                    <MoodIndicator mood={session.mood}>
                      {session.mood}/10
                      <MoodBar mood={session.mood} />
                    </MoodIndicator>
                  </DetailItem>
                  <DetailItem>
                    <FileText size={16} />
                    Objetivos: {session.objectives ? session.objectives.join(', ') : 'Nenhum objetivo definido'}
                  </DetailItem>
                  <DetailItem>
                    <Mic size={16} />
                    Técnicas: {session.techniques ? session.techniques.join(', ') : 'Nenhuma técnica registrada'}
                  </DetailItem>
                </SessionDetails>

                {session.audioRecording && (
                  <Attachments>
                    <AttachmentItem>
                      <Mic size={16} />
                      Gravação de áudio
                    </AttachmentItem>
                  </Attachments>
                )}

                {session.attachments && session.attachments.length > 0 && (
                  <Attachments>
                    {session.attachments.map((attachment, index) => (
                      <AttachmentItem key={index}>
                        <Paperclip size={16} />
                        {attachment.name}
                      </AttachmentItem>
                    ))}
                  </Attachments>
                )}
              </RecordCard>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: theme.spacing.xl, color: theme.colors.text.secondary }}>
            {searchTerm ? 'Nenhuma sessão encontrada para a busca' : 'Nenhuma sessão registrada'}
          </div>
        )}
      </RecordsList>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSession ? 'Editar Sessão' : 'Nova Sessão'}
        size="large"
      >
        <SessionForm
          session={editingSession}
          patients={state.patients}
          onSubmit={handleSubmitSession}
          onCancel={handleCloseModal}
          isLoading={isLoading}
        />
      </Modal>
    </RecordsContainer>
  );
};

export default Records;
