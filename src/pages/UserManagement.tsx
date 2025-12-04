import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Key,
  User as UserIcon,
  Mail,
  Shield,
  Calendar,
  X,
  Save,
  Users
} from 'lucide-react';
import { theme } from '../styles/theme';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/realApiService';

const UserManagementContainer = styled.div`
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
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};

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

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.weights.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  border: none;
  font-size: ${theme.typography.sizes.base};

  ${props => {
    if (props.variant === 'primary') {
      return `
        background: ${theme.colors.primary};
        color: white;

        &:hover {
          background: ${theme.colors.accent};
        }

        &:disabled {
          background: ${theme.colors.border};
          cursor: not-allowed;
        }
      `;
    } else if (props.variant === 'danger') {
      return `
        background: ${theme.colors.status.error};
        color: white;

        &:hover {
          background: ${theme.colors.status.error}dd;
        }
      `;
    } else {
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

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.typography.sizes.sm};
    flex: 1;
  }
`;

const SearchBar = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.base};
  background: ${theme.colors.surface};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const UsersTable = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${theme.shadows.md};
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 1.5fr 1fr 1.5fr 1fr;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  background: ${theme.colors.background};
  border-bottom: 1px solid ${theme.colors.border};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.sizes.sm};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 2fr 2fr 1fr 1fr;
    display: none;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 1.5fr 1fr 1.5fr 1fr;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
  align-items: center;
  transition: background 0.2s ease;

  &:hover {
    background: ${theme.colors.background};
  }

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 2fr 2fr 1fr 1fr;
    grid-template-rows: auto auto;
    gap: ${theme.spacing.sm};
  }
`;

const TableCell = styled.div`
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.sizes.base};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.typography.sizes.sm};
  }
`;

const RoleBadge = styled.span<{ role: string }>`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.medium};
  text-transform: uppercase;

  ${props => {
    if (props.role === 'super_admin') {
      return `
        background: ${theme.colors.status.error}20;
        color: ${theme.colors.status.error};
      `;
    } else if (props.role === 'admin') {
      return `
        background: ${theme.colors.status.warning}20;
        color: ${theme.colors.status.warning};
      `;
    } else {
      return `
        background: ${theme.colors.primary}20;
        color: ${theme.colors.primary};
      `;
    }
  }}
`;

const StatusBadge = styled.span<{ active: boolean }>`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.sizes.xs};
  font-weight: ${theme.typography.weights.medium};

  ${props => props.active ? `
    background: ${theme.colors.status.success}20;
    color: ${theme.colors.status.success};
  ` : `
    background: ${theme.colors.text.secondary}20;
    color: ${theme.colors.text.secondary};
  `}
`;

const ActionsCell = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  justify-content: flex-end;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-column: 1 / -1;
    justify-content: center;
    margin-top: ${theme.spacing.sm};
  }
`;

const ActionButton = styled.button`
  padding: ${theme.spacing.sm};
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: ${theme.borderRadius.sm};
  color: ${theme.colors.text.secondary};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${theme.colors.background};
    color: ${theme.colors.primary};
  }
`;

const Modal = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm};
    align-items: flex-start;
    padding-top: ${theme.spacing.xl};
  }
`;

const ModalContent = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${theme.shadows.xl};
  position: relative;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.lg};
    max-height: 95vh;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
  border-bottom: 1px solid ${theme.colors.border};
  padding-bottom: ${theme.spacing.lg};
`;

const ModalTitle = styled.h2`
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.text.secondary};
  padding: ${theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${theme.colors.text.primary};
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${theme.spacing.sm};
  font-weight: ${theme.typography.weights.medium};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.sizes.base};
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.base};
  background: ${theme.colors.surface};
  color: ${theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.sizes.base};
  background: ${theme.colors.surface};
  color: ${theme.colors.text.primary};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${theme.spacing.xl};
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.border};
`;

const InspectModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${theme.spacing.md};
`;

const StatCard = styled.div`
  background: ${theme.colors.background};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border};
`;

const StatValue = styled.div`
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text.secondary};
`;

const Section = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const SectionTitle = styled.h3`
  font-size: ${theme.typography.sizes.lg};
  font-weight: ${theme.typography.weights.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing['3xl']};
  color: ${theme.colors.text.secondary};
`;

const UserManagement: React.FC = () => {
  const { isSuperAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [inspectData, setInspectData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'psychologist' as 'psychologist' | 'admin' | 'super_admin',
    isActive: true
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!isSuperAdmin()) {
      toast.error('Acesso negado. Apenas super administradores podem acessar esta página.');
      return;
    }
    loadUsers();
  }, [isSuperAdmin]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const allUsers = await apiService.getAllUsers();
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'psychologist',
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      isActive: user.isActive ?? true
    });
    setIsModalOpen(true);
  };

  const handleSaveUser = async () => {
    try {
      if (!formData.name || !formData.email) {
        toast.error('Nome e email são obrigatórios');
        return;
      }

      if (!selectedUser && !formData.password) {
        toast.error('Senha é obrigatória para novos usuários');
        return;
      }

      if (selectedUser) {
        // Atualizar usuário
        await apiService.updateUserByAdmin(selectedUser.id, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          isActive: formData.isActive
        });
        toast.success('Usuário atualizado com sucesso');
      } else {
        // Criar usuário
        await apiService.createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
        toast.success('Usuário criado com sucesso');
      }

      setIsModalOpen(false);
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar usuário');
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`Tem certeza que deseja desativar o usuário ${user.name}?`)) {
      return;
    }

    try {
      await apiService.deleteUser(user.id);
      toast.success('Usuário desativado com sucesso');
      loadUsers();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao desativar usuário');
    }
  };

  const handleInspectUser = async (user: User) => {
    try {
      setIsLoading(true);
      const data = await apiService.inspectUser(user.id);
      setInspectData(data);
      setSelectedUser(user);
      setIsInspectModalOpen(true);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao carregar dados do usuário');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
        toast.error('Senha deve ter pelo menos 6 caracteres');
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error('As senhas não coincidem');
        return;
      }

      if (!selectedUser) return;

      await apiService.changeUserPassword(selectedUser.id, passwordData.newPassword);
      toast.success('Senha alterada com sucesso');
      setIsPasswordModalOpen(false);
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.message || 'Erro ao alterar senha');
    }
  };

  const openPasswordModal = (user: User) => {
    setSelectedUser(user);
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setIsPasswordModalOpen(true);
  };

  if (!isSuperAdmin()) {
    return (
      <UserManagementContainer>
        <EmptyState>
          <Shield size={48} style={{ marginBottom: theme.spacing.md }} />
          <p>Acesso negado. Apenas super administradores podem acessar esta página.</p>
        </EmptyState>
      </UserManagementContainer>
    );
  }

  return (
    <UserManagementContainer>
      <PageHeader>
        <PageTitle>
          <Users size={32} />
          Gerenciamento de Usuários
        </PageTitle>
        <HeaderActions>
          <Button variant="primary" onClick={handleCreateUser}>
            <Plus size={20} />
            Novo Usuário
          </Button>
        </HeaderActions>
      </PageHeader>

      <SearchBar>
        <SearchInput
          type="text"
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchBar>

      {isLoading ? (
        <EmptyState>
          <p>Carregando usuários...</p>
        </EmptyState>
      ) : filteredUsers.length === 0 ? (
        <EmptyState>
          <Users size={48} style={{ marginBottom: theme.spacing.md }} />
          <p>Nenhum usuário encontrado</p>
        </EmptyState>
      ) : (
        <UsersTable>
          <TableHeader>
            <TableCell>Nome</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Data de Criação</TableCell>
            <TableCell>Ações</TableCell>
          </TableHeader>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <UserIcon size={20} />
                {user.name}
              </TableCell>
              <TableCell>
                <Mail size={16} />
                {user.email}
              </TableCell>
              <TableCell>
                <RoleBadge role={user.role}>
                  {user.role === 'super_admin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'Psicólogo'}
                </RoleBadge>
              </TableCell>
              <TableCell>
                <StatusBadge active={user.isActive ?? true}>
                  {user.isActive ? 'Ativo' : 'Inativo'}
                </StatusBadge>
              </TableCell>
              <TableCell>
                <Calendar size={16} />
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
              </TableCell>
              <ActionsCell>
                <ActionButton onClick={() => handleInspectUser(user)} title="Inspecionar">
                  <Eye size={18} />
                </ActionButton>
                <ActionButton onClick={() => handleEditUser(user)} title="Editar">
                  <Edit size={18} />
                </ActionButton>
                <ActionButton onClick={() => openPasswordModal(user)} title="Trocar Senha">
                  <Key size={18} />
                </ActionButton>
                <ActionButton onClick={() => handleDeleteUser(user)} title="Desativar" style={{ color: theme.colors.status.error }}>
                  <Trash2 size={18} />
                </ActionButton>
              </ActionsCell>
            </TableRow>
          ))}
        </UsersTable>
      )}

      {/* Modal de Criar/Editar Usuário */}
      <Modal isOpen={isModalOpen} onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>{selectedUser ? 'Editar Usuário' : 'Novo Usuário'}</ModalTitle>
            <CloseButton onClick={() => setIsModalOpen(false)}>
              <X size={24} />
            </CloseButton>
          </ModalHeader>

          <FormGroup>
            <Label>Nome *</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome completo"
            />
          </FormGroup>

          <FormGroup>
            <Label>Email *</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@exemplo.com"
            />
          </FormGroup>

          {!selectedUser && (
            <FormGroup>
              <Label>Senha *</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Mínimo 6 caracteres"
              />
            </FormGroup>
          )}

          <FormGroup>
            <Label>Role</Label>
            <Select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
            >
              <option value="psychologist">Psicólogo</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                style={{ marginRight: theme.spacing.sm }}
              />
              Usuário Ativo
            </Label>
          </FormGroup>

          <FormActions>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSaveUser}>
              <Save size={20} />
              Salvar
            </Button>
          </FormActions>
        </ModalContent>
      </Modal>

      {/* Modal de Inspeção */}
      <Modal isOpen={isInspectModalOpen} onClick={(e) => e.target === e.currentTarget && setIsInspectModalOpen(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
          <ModalHeader>
            <ModalTitle>
              <Eye size={24} style={{ marginRight: theme.spacing.sm }} />
              Inspeção: {selectedUser?.name}
            </ModalTitle>
            <CloseButton onClick={() => setIsInspectModalOpen(false)}>
              <X size={24} />
            </CloseButton>
          </ModalHeader>

          {inspectData && (
            <InspectModalContent>
              <Section>
                <SectionTitle>Informações do Usuário</SectionTitle>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md }}>
                  <div>
                    <Label>Nome</Label>
                    <div style={{ padding: theme.spacing.sm, background: theme.colors.background, borderRadius: theme.borderRadius.sm }}>
                      {inspectData.user.name}
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div style={{ padding: theme.spacing.sm, background: theme.colors.background, borderRadius: theme.borderRadius.sm }}>
                      {inspectData.user.email}
                    </div>
                  </div>
                  <div>
                    <Label>Role</Label>
                    <div style={{ padding: theme.spacing.sm, background: theme.colors.background, borderRadius: theme.borderRadius.sm }}>
                      <RoleBadge role={inspectData.user.role}>
                        {inspectData.user.role === 'super_admin' ? 'Super Admin' : inspectData.user.role === 'admin' ? 'Admin' : 'Psicólogo'}
                      </RoleBadge>
                    </div>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div style={{ padding: theme.spacing.sm, background: theme.colors.background, borderRadius: theme.borderRadius.sm }}>
                      <StatusBadge active={inspectData.user.isActive}>
                        {inspectData.user.isActive ? 'Ativo' : 'Inativo'}
                      </StatusBadge>
                    </div>
                  </div>
                </div>
              </Section>

              <Section>
                <SectionTitle>Estatísticas</SectionTitle>
                <StatsGrid>
                  <StatCard>
                    <StatValue>{inspectData.stats.patients}</StatValue>
                    <StatLabel>Pacientes</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{inspectData.stats.sessions}</StatValue>
                    <StatLabel>Sessões</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{inspectData.stats.appointments}</StatValue>
                    <StatLabel>Agendamentos</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{inspectData.stats.payments}</StatValue>
                    <StatLabel>Pagamentos</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>R$ {inspectData.stats.totalRevenue.toFixed(2)}</StatValue>
                    <StatLabel>Receita Total</StatLabel>
                  </StatCard>
                </StatsGrid>
              </Section>

              {inspectData.recentPatients && inspectData.recentPatients.length > 0 && (
                <Section>
                  <SectionTitle>
                    <UserIcon size={20} />
                    Últimos Pacientes
                  </SectionTitle>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
                    {inspectData.recentPatients.map((patient: any) => (
                      <div key={patient.id} style={{ padding: theme.spacing.md, background: theme.colors.background, borderRadius: theme.borderRadius.sm }}>
                        <div style={{ fontWeight: theme.typography.weights.medium }}>{patient.name}</div>
                        <div style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.text.secondary }}>
                          {patient.email} • {patient.phone}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </InspectModalContent>
          )}
        </ModalContent>
      </Modal>

      {/* Modal de Trocar Senha */}
      <Modal isOpen={isPasswordModalOpen} onClick={(e) => e.target === e.currentTarget && setIsPasswordModalOpen(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>
              <Key size={24} style={{ marginRight: theme.spacing.sm }} />
              Trocar Senha: {selectedUser?.name}
            </ModalTitle>
            <CloseButton onClick={() => setIsPasswordModalOpen(false)}>
              <X size={24} />
            </CloseButton>
          </ModalHeader>

          <FormGroup>
            <Label>Nova Senha *</Label>
            <Input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              placeholder="Mínimo 6 caracteres"
            />
          </FormGroup>

          <FormGroup>
            <Label>Confirmar Nova Senha *</Label>
            <Input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              placeholder="Digite a senha novamente"
            />
          </FormGroup>

          <FormActions>
            <Button variant="secondary" onClick={() => setIsPasswordModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleChangePassword}>
              <Save size={20} />
              Alterar Senha
            </Button>
          </FormActions>
        </ModalContent>
      </Modal>
    </UserManagementContainer>
  );
};

export default UserManagement;

