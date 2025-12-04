import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import {
  Plus,
  Search,
  Filter,
  DollarSign,
  Calendar,
  User,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Edit,
  Trash2
} from 'lucide-react';
import { theme } from '../styles/theme';
import { Payment } from '../types';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal/Modal';
import PaymentForm from '../components/Forms/PaymentForm';

const PaymentsContainer = styled.div`
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

const SummaryCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${theme.spacing.md};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.sm};
  }
`;

const SummaryCard = styled.div`
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

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
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

const CardValue = styled.div`
  font-size: ${theme.typography.sizes['3xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
`;

const CardLabel = styled.div`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.weights.medium};
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

const PaymentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const PaymentCard = styled.div<{ status: string }>`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.md};
  border: 1px solid ${theme.colors.border};
  border-left: 4px solid ${props => {
    switch (props.status) {
      case 'pago': return theme.colors.status.success;
      case 'pendente': return theme.colors.status.warning;
      case 'atrasado': return theme.colors.status.error;
      default: return theme.colors.text.light;
    }
  }};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const PaymentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.md};
`;

const PaymentInfo = styled.div`
  flex: 1;
`;

const PatientName = styled.h3`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.xs} 0;
`;

const PaymentDate = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.sm};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const PaymentAmount = styled.div`
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const PaymentStatus = styled.div<{ status: string }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.medium};

  ${props => {
    switch (props.status) {
      case 'pago':
        return `
          background: ${theme.colors.status.success}20;
          color: ${theme.colors.status.success};
        `;
      case 'pendente':
        return `
          background: ${theme.colors.status.warning}20;
          color: ${theme.colors.status.warning};
        `;
      case 'atrasado':
        return `
          background: ${theme.colors.status.error}20;
          color: ${theme.colors.status.error};
        `;
      default:
        return `
          background: ${theme.colors.text.light}20;
          color: ${theme.colors.text.light};
        `;
    }
  }}
`;

const PaymentActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'delete' | 'download' }>`
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.full};
  background: ${props => {
    switch (props.variant) {
      case 'delete': return theme.colors.status.error;
      case 'download': return theme.colors.primary;
      default: return theme.colors.background;
    }
  }};
  border: 1px solid ${props => {
    switch (props.variant) {
      case 'delete': return theme.colors.status.error;
      case 'download': return theme.colors.primary;
      default: return theme.colors.border;
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => {
    switch (props.variant) {
      case 'delete': return 'white';
      case 'download': return 'white';
      default: return theme.colors.text.secondary;
    }
  }};

  &:hover {
    background: ${props => {
    switch (props.variant) {
      case 'delete': return theme.colors.status.error;
      case 'download': return theme.colors.accent;
      default: return theme.colors.primary;
    }
  }};
    color: white;
  }
`;

const PaymentDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
  padding-top: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.border};
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.sizes.sm};
`;

const PaymentMethod = styled.div<{ method: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.medium};
  background: ${theme.colors.background};
  color: ${theme.colors.text.secondary};
`;

const Payments: React.FC = () => {
  const { state, addPayment, updatePayment, deletePayment, getPatientById, getTotalRevenue, getPendingPayments } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [, setShowPaymentMenu] = useState<string | null>(null);

  const filteredPayments = state.payments.filter(payment => {
    const patient = getPatientById(payment.patientId);
    return (
      payment.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient && patient.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      payment.method.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleOpenModal = (payment?: Payment) => {
    setEditingPayment(payment);
    setIsModalOpen(true);
    setShowPaymentMenu(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPayment(undefined);
  };

  const handleSubmitPayment = async (data: any) => {
    setIsLoading(true);
    try {
      if (editingPayment) {
        await updatePayment(editingPayment.id, {
          ...data,
          date: new Date(data.date),
        });
        toast.success('Pagamento atualizado com sucesso!');
      } else {
        await addPayment({
          ...data,
          date: new Date(data.date),
        });
        toast.success('Pagamento registrado com sucesso!');
      }

      handleCloseModal();
    } catch (error: any) {
      console.error('Erro ao salvar pagamento:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Erro ao salvar pagamento';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este pagamento? Esta ação não pode ser desfeita.')) {
      try {
        setIsLoading(true);
        await deletePayment(paymentId);
        toast.success('Pagamento excluído com sucesso!');
        setShowPaymentMenu(null);
      } catch (error: any) {
        console.error('Erro ao deletar pagamento:', error);
        const errorMessage = error?.response?.data?.error || error?.message || 'Erro ao excluir pagamento';
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pago': return <CheckCircle size={16} />;
      case 'pendente': return <Clock size={16} />;
      case 'atrasado': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pago': return 'Pago';
      case 'pendente': return 'Pendente';
      case 'atrasado': return 'Atrasado';
      default: return 'Desconhecido';
    }
  };

  const getMethodText = (method: string) => {
    switch (method) {
      case 'pix': return 'PIX';
      case 'dinheiro': return 'Dinheiro';
      case 'cartao': return 'Cartão';
      case 'transferencia': return 'Transferência';
      default: return method;
    }
  };

  const totalRevenue = getTotalRevenue();
  const pendingPayments = getPendingPayments().filter((p: Payment) => p.status === 'pendente').length;
  const overduePayments = getPendingPayments().filter((p: Payment) => p.status === 'atrasado').length;

  return (
    <PaymentsContainer>
      <PageHeader>
        <PageTitle>Pagamentos</PageTitle>
        <HeaderActions>
          <Button variant="secondary">
            <Filter size={20} />
            Filtros
          </Button>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            <Plus size={20} />
            Novo Pagamento
          </Button>
        </HeaderActions>
      </PageHeader>

      <SummaryCards>
        <SummaryCard>
          <CardHeader>
            <CardIcon color={theme.colors.status.success}>
              <DollarSign size={24} />
            </CardIcon>
          </CardHeader>
          <CardValue>R$ {totalRevenue.toLocaleString('pt-BR')}</CardValue>
          <CardLabel>Receita Total</CardLabel>
        </SummaryCard>

        <SummaryCard>
          <CardHeader>
            <CardIcon color={theme.colors.status.warning}>
              <Clock size={24} />
            </CardIcon>
          </CardHeader>
          <CardValue>{pendingPayments}</CardValue>
          <CardLabel>Pagamentos Pendentes</CardLabel>
        </SummaryCard>

        <SummaryCard>
          <CardHeader>
            <CardIcon color={theme.colors.status.error}>
              <XCircle size={24} />
            </CardIcon>
          </CardHeader>
          <CardValue>{overduePayments}</CardValue>
          <CardLabel>Pagamentos Atrasados</CardLabel>
        </SummaryCard>
      </SummaryCards>

      <SearchAndFilter>
        <SearchInput
          type="text"
          placeholder="Buscar pagamentos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterButton>
          <Search size={20} />
        </FilterButton>
      </SearchAndFilter>

      <PaymentsList>
        {filteredPayments.length > 0 ? (
          filteredPayments.map((payment) => {
            const patient = getPatientById(payment.patientId);
            return (
              <PaymentCard key={payment.id} status={payment.status}>
                <PaymentHeader>
                  <PaymentInfo>
                    <PatientName>{patient?.name || 'Paciente não encontrado'}</PatientName>
                    <PaymentDate>
                      <Calendar size={16} />
                      {new Date(payment.date).toLocaleDateString('pt-BR')}
                    </PaymentDate>
                    <PaymentAmount>R$ {payment.amount.toLocaleString('pt-BR')}</PaymentAmount>
                  </PaymentInfo>
                  <PaymentActions>
                    <PaymentStatus status={payment.status}>
                      {getStatusIcon(payment.status)}
                      {getStatusText(payment.status)}
                    </PaymentStatus>
                    <ActionButton variant="download">
                      <Download size={16} />
                    </ActionButton>
                    <ActionButton variant="edit" onClick={() => handleOpenModal(payment)}>
                      <Edit size={16} />
                    </ActionButton>
                    <ActionButton variant="delete" onClick={() => handleDeletePayment(payment.id)}>
                      <Trash2 size={16} />
                    </ActionButton>
                  </PaymentActions>
                </PaymentHeader>

                <PaymentDetails>
                  <DetailItem>
                    <DollarSign size={16} />
                    Método: <PaymentMethod method={payment.method}>{getMethodText(payment.method)}</PaymentMethod>
                  </DetailItem>
                  <DetailItem>
                    <User size={16} />
                    Paciente: {patient?.name || 'Paciente não encontrado'}
                  </DetailItem>
                  {payment.notes && (
                    <DetailItem>
                      Observações: {payment.notes}
                    </DetailItem>
                  )}
                </PaymentDetails>
              </PaymentCard>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: theme.spacing.xl, color: theme.colors.text.secondary }}>
            {searchTerm ? 'Nenhum pagamento encontrado para a busca' : 'Nenhum pagamento registrado'}
          </div>
        )}
      </PaymentsList>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPayment ? 'Editar Pagamento' : 'Novo Pagamento'}
        size="medium"
      >
        <PaymentForm
          payment={editingPayment}
          patients={state.patients}
          sessions={state.sessions}
          onSubmit={handleSubmitPayment}
          onCancel={handleCloseModal}
          isLoading={isLoading}
        />
      </Modal>
    </PaymentsContainer>
  );
};

export default Payments;
