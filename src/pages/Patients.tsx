import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import { theme } from '../styles/theme';
import { Patient } from '../types';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/realApiService';
import Modal from '../components/Modal/Modal';
import PatientForm from '../components/Forms/PatientForm';
import PatientDetailModal from '../components/PatientDetail/PatientDetailModal';

const PatientsContainer = styled.div`
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

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
    justify-content: stretch;
  }
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

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.typography.sizes.sm};
    flex: 1;
  }
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

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm};
    font-size: ${theme.typography.sizes.sm};
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

const PatientsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: ${theme.spacing.md};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.sm};
  }
`;

const PatientCard = styled.div`
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

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.lg};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
  }
`;

const PatientHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.md};
`;

const PatientInfo = styled.div`
  flex: 1;
`;

const PatientName = styled.h3`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.xs} 0;
`;

const PatientAge = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.sm};
  margin: 0;
`;

const PatientActions = styled.div`
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

const PatientDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.sm};
`;

const PatientStatus = styled.div<{ status: 'active' | 'inactive' }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.medium};

  ${props => props.status === 'active' ? `
    background: ${theme.colors.status.success}20;
    color: ${theme.colors.status.success};
  ` : `
    background: ${theme.colors.status.error}20;
    color: ${theme.colors.status.error};
  `}
`;

const LastSession = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.sm};
  margin-top: ${theme.spacing.md};
  padding-top: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.border};
`;

const Patients: React.FC = () => {
  const { state, addPatient, updatePatient, deletePatient } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [showPatientMenu, setShowPatientMenu] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredPatients = state.patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (patient?: Patient) => {
    setEditingPatient(patient);
    setIsModalOpen(true);
    setShowPatientMenu(null);
  };

  const handleOpenDetailModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDetailModalOpen(true);
    setShowPatientMenu(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPatient(undefined);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedPatient(null);
  };

  const handleSubmitPatient = async (data: any) => {
    setIsLoading(true);
    try {
      if (editingPatient) {
        await updatePatient(editingPatient.id, data);
        toast.success('Paciente atualizado com sucesso!');
      } else {
        await addPatient(data);
        toast.success('Paciente cadastrado com sucesso!');
      }

      handleCloseModal();
    } catch (error: any) {
      console.error('Erro ao salvar paciente:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Erro ao salvar paciente';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    try {
      // Buscar estatísticas de registros associados
      const stats = await apiService.getPatientStats(patientId);

      // Montar mensagem de confirmação
      let confirmMessage = 'Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.';

      if (stats.total > 0) {
        const details: string[] = [];
        if (stats.sessions > 0) details.push(`${stats.sessions} sessão(ões)`);
        if (stats.appointments > 0) details.push(`${stats.appointments} agendamento(s)`);
        if (stats.payments > 0) details.push(`${stats.payments} pagamento(s)`);

        confirmMessage += `\n\nTambém serão excluídos: ${details.join(', ')}.`;
      }

      if (window.confirm(confirmMessage)) {
        setIsLoading(true);
        await deletePatient(patientId);
        toast.success('Paciente excluído com sucesso!');
        setShowPatientMenu(null);
      }
    } catch (error: any) {
      console.error('Erro ao deletar paciente:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Erro ao excluir paciente';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getLastSessionDate = (patientId: string) => {
    const patientSessions = state.sessions.filter(s => s.patientId === patientId);
    if (patientSessions.length === 0) return 'Nenhuma sessão';

    const lastSession = patientSessions.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
    return new Date(lastSession.date).toLocaleDateString('pt-BR');
  };

  return (
    <PatientsContainer>
      <PageHeader>
        <PageTitle>Pacientes</PageTitle>
        <HeaderActions>
          <Button variant="secondary">
            <Filter size={20} />
            Filtros
          </Button>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            <Plus size={20} />
            Novo Paciente
          </Button>
        </HeaderActions>
      </PageHeader>

      <SearchAndFilter>
        <SearchInput
          type="text"
          placeholder="Buscar pacientes por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterButton>
          <Search size={20} />
        </FilterButton>
      </SearchAndFilter>

      <PatientsGrid>
        {filteredPatients.map((patient) => (
          <PatientCard key={patient.id}>
            <PatientHeader>
              <PatientInfo>
                <PatientName>{patient.name}</PatientName>
                <PatientAge>{patient.age} anos</PatientAge>
              </PatientInfo>
              <PatientActions>
                <ActionButton onClick={() => setShowPatientMenu(showPatientMenu === patient.id ? null : patient.id)}>
                  <MoreVertical size={16} />
                </ActionButton>
                {showPatientMenu === patient.id && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    background: 'white',
                    border: '1px solid #E1E8ED',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    zIndex: 10,
                    minWidth: '120px'
                  }}>
                    <button
                      onClick={() => handleOpenDetailModal(patient)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: 'none',
                        background: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Eye size={16} />
                      Ver Ficha
                    </button>
                    <button
                      onClick={() => handleOpenModal(patient)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: 'none',
                        background: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Edit size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeletePatient(patient.id)}
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
                        color: '#E74C3C'
                      }}
                    >
                      <Trash2 size={16} />
                      Excluir
                    </button>
                  </div>
                )}
              </PatientActions>
            </PatientHeader>

            <PatientDetails>
              <DetailItem>
                <Phone size={16} />
                {patient.phone}
              </DetailItem>
              <DetailItem>
                <Mail size={16} />
                {patient.email}
              </DetailItem>
              <DetailItem>
                <Calendar size={16} />
                Cadastrado em {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível'}
              </DetailItem>
            </PatientDetails>

            <PatientStatus status="active">
              Paciente Ativo
            </PatientStatus>

            <LastSession>
              Última sessão: {getLastSessionDate(patient.id)}
            </LastSession>
          </PatientCard>
        ))}
      </PatientsGrid>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPatient ? 'Editar Paciente' : 'Novo Paciente'}
        size="large"
      >
        <PatientForm
          patient={editingPatient}
          onSubmit={handleSubmitPatient}
          onCancel={handleCloseModal}
          isLoading={isLoading}
        />
      </Modal>

      <PatientDetailModal
        patient={selectedPatient}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </PatientsContainer>
  );
};

export default Patients;
