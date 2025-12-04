import apiService from './api';
import { mockData } from '../data/mockData';

class HybridApiService {
  private isBackendAvailable: boolean = false;
  private checkBackendPromise: Promise<boolean> | null = null;

  constructor() {
    this.checkBackendAvailability();
  }

  setToken(token: string | null) {
    // Para compatibilidade com o sistema de autenticação
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  private async checkBackendAvailability(): Promise<boolean> {
    if (this.checkBackendPromise) {
      return this.checkBackendPromise;
    }

    this.checkBackendPromise = this.performBackendCheck();
    return this.checkBackendPromise;
  }

  private async performBackendCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/health`, {
        method: 'GET',
        timeout: 3000,
      } as any);

      this.isBackendAvailable = response.ok;
      return this.isBackendAvailable;
    } catch (error) {
      console.log('Backend não disponível, usando dados locais');
      this.isBackendAvailable = false;
      return false;
    }
  }

  private async ensureBackendCheck(): Promise<boolean> {
    if (this.checkBackendPromise) {
      return this.checkBackendPromise;
    }
    return this.checkBackendAvailability();
  }

  // Auth methods
  async register(userData: any) {
    const isBackendAvailable = await this.ensureBackendCheck();

    if (isBackendAvailable) {
      try {
        return await apiService.register(userData);
      } catch (error) {
        console.log('Backend falhou, usando dados locais');
        return this.localRegister(userData);
      }
    }

    return this.localRegister(userData);
  }

  async login(credentials: any) {
    const isBackendAvailable = await this.ensureBackendCheck();

    if (isBackendAvailable) {
      try {
        return await apiService.login(credentials);
      } catch (error) {
        console.log('Backend falhou, usando dados locais');
        return this.localLogin(credentials);
      }
    }

    return this.localLogin(credentials);
  }

  async verifyToken() {
    const isBackendAvailable = await this.ensureBackendCheck();

    if (isBackendAvailable) {
      try {
        return await apiService.verifyToken();
      } catch (error) {
        console.log('Backend falhou, usando dados locais');
        return this.localVerifyToken();
      }
    }

    return this.localVerifyToken();
  }

  // Local storage methods
  private localRegister(userData: any) {
    const users = this.getLocalUsers();
    const existingUser = users.find((u: any) => u.email === userData.email);

    if (existingUser) {
      throw new Error('Usuário já existe');
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('serena_users', JSON.stringify(users));
    localStorage.setItem('serena_current_user', JSON.stringify(newUser));

    return {
      message: 'Usuário criado com sucesso',
      token: 'local_token_' + Date.now(),
      user: newUser
    };
  }

  private localLogin(credentials: any) {
    const users = this.getLocalUsers();
    const user = users.find((u: any) => u.email === credentials.email && u.password === credentials.password);

    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    localStorage.setItem('serena_current_user', JSON.stringify(user));

    return {
      message: 'Login realizado com sucesso',
      token: 'local_token_' + Date.now(),
      user
    };
  }

  private localVerifyToken() {
    const user = localStorage.getItem('serena_current_user');

    if (!user) {
      return { valid: false, user: null };
    }

    return {
      valid: true,
      user: JSON.parse(user)
    };
  }

  private getLocalUsers() {
    const users = localStorage.getItem('serena_users');
    return users ? JSON.parse(users) : [];
  }

  // Data methods - sempre usar dados locais para simplicidade
  async getPatients() {
    const isBackendAvailable = await this.ensureBackendCheck();

    if (isBackendAvailable) {
      try {
        return await apiService.getPatients();
      } catch (error) {
        console.log('Backend falhou, usando dados locais');
      }
    }

    return this.getLocalData('patients');
  }

  async getSessions() {
    const isBackendAvailable = await this.ensureBackendCheck();

    if (isBackendAvailable) {
      try {
        return await apiService.getSessions();
      } catch (error) {
        console.log('Backend falhou, usando dados locais');
      }
    }

    return this.getLocalData('sessions');
  }

  async getAppointments() {
    const isBackendAvailable = await this.ensureBackendCheck();

    if (isBackendAvailable) {
      try {
        return await apiService.getAppointments();
      } catch (error) {
        console.log('Backend falhou, usando dados locais');
      }
    }

    return this.getLocalData('appointments');
  }

  async getPayments() {
    const isBackendAvailable = await this.ensureBackendCheck();

    if (isBackendAvailable) {
      try {
        return await apiService.getPayments();
      } catch (error) {
        console.log('Backend falhou, usando dados locais');
      }
    }

    return this.getLocalData('payments');
  }

  // CRUD operations - sempre usar dados locais
  async createPatient(patientData: any) {
    return this.createLocalData('patients', patientData);
  }

  async updatePatient(id: string, patientData: any) {
    return this.updateLocalData('patients', id, patientData);
  }

  async deletePatient(id: string) {
    return this.deleteLocalData('patients', id);
  }

  async createSession(sessionData: any) {
    return this.createLocalData('sessions', sessionData);
  }

  async updateSession(id: string, sessionData: any) {
    return this.updateLocalData('sessions', id, sessionData);
  }

  async deleteSession(id: string) {
    return this.deleteLocalData('sessions', id);
  }

  async createAppointment(appointmentData: any) {
    return this.createLocalData('appointments', appointmentData);
  }

  async updateAppointment(id: string, appointmentData: any) {
    return this.updateLocalData('appointments', id, appointmentData);
  }

  async deleteAppointment(id: string) {
    return this.deleteLocalData('appointments', id);
  }

  async createPayment(paymentData: any) {
    return this.createLocalData('payments', paymentData);
  }

  async updatePayment(id: string, paymentData: any) {
    return this.updateLocalData('payments', id, paymentData);
  }

  async deletePayment(id: string) {
    return this.deleteLocalData('payments', id);
  }

  // Local data management
  private getLocalData(type: string) {
    const data = localStorage.getItem(`serena_${type}`);
    if (data) {
      return JSON.parse(data);
    }

    // Se não há dados, inicializar com dados de exemplo
    this.initializeLocalData();
    return (mockData as any)[type] || [];
  }

  private initializeLocalData() {
    // Criar usuário padrão se não existir (apenas para demonstração)
    if (!localStorage.getItem('serena_users')) {
      const defaultUser = {
        id: '1',
        name: 'Administrador',
        email: 'admin@serena.com',
        password: '123456',
        role: 'admin',
        preferences: {
          theme: 'light',
          notifications: true,
          reminderTime: 30,
          defaultSessionDuration: 50,
          currency: 'BRL'
        },
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('serena_users', JSON.stringify([defaultUser]));
    }

    // Inicializar dados vazios para novos usuários (sistema profissional)
    if (!localStorage.getItem('serena_patients')) {
      localStorage.setItem('serena_patients', JSON.stringify([]));
      localStorage.setItem('serena_sessions', JSON.stringify([]));
      localStorage.setItem('serena_appointments', JSON.stringify([]));
      localStorage.setItem('serena_payments', JSON.stringify([]));
    }
  }

  // Método para inicializar dados de demonstração (apenas para admin)
  public initializeDemoData() {
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.email === 'admin@serena.com') {
      localStorage.setItem('serena_patients', JSON.stringify(mockData.patients));
      localStorage.setItem('serena_sessions', JSON.stringify(mockData.sessions));
      localStorage.setItem('serena_appointments', JSON.stringify(mockData.appointments));
      localStorage.setItem('serena_payments', JSON.stringify(mockData.payments));
      return true;
    }
    return false;
  }

  // Método para limpar dados de demonstração
  public clearDemoData() {
    localStorage.setItem('serena_patients', JSON.stringify([]));
    localStorage.setItem('serena_sessions', JSON.stringify([]));
    localStorage.setItem('serena_appointments', JSON.stringify([]));
    localStorage.setItem('serena_payments', JSON.stringify([]));
  }

  private getCurrentUser() {
    const userStr = localStorage.getItem('serena_current_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  private createLocalData(type: string, data: any) {
    const items = this.getLocalData(type);
    const newItem = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
    };

    items.push(newItem);
    localStorage.setItem(`serena_${type}`, JSON.stringify(items));

    return {
      message: `${type} criado com sucesso`,
      [type.slice(0, -1)]: newItem
    };
  }

  private updateLocalData(type: string, id: string, data: any) {
    const items = this.getLocalData(type);
    const index = items.findIndex((item: any) => item.id === id);

    if (index === -1) {
      throw new Error(`${type} não encontrado`);
    }

    items[index] = {
      ...items[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(`serena_${type}`, JSON.stringify(items));

    return {
      message: `${type} atualizado com sucesso`,
      [type.slice(0, -1)]: items[index]
    };
  }

  private deleteLocalData(type: string, id: string) {
    const items = this.getLocalData(type);
    const filteredItems = items.filter((item: any) => item.id !== id);

    localStorage.setItem(`serena_${type}`, JSON.stringify(filteredItems));

    return {
      message: `${type} excluído com sucesso`
    };
  }

  // Reports
  async getDashboard() {
    const patients = await this.getPatients();
    const sessions = await this.getSessions();
    const appointments = await this.getAppointments();
    const payments = await this.getPayments();

    return {
      totalPatients: patients.length,
      totalSessions: sessions.length,
      totalAppointments: appointments.length,
      totalRevenue: payments.reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0),
      recentSessions: sessions.slice(-5),
      upcomingAppointments: appointments.filter((apt: any) => new Date(apt.date) > new Date()).slice(0, 5),
      pendingPayments: payments.filter((payment: any) => payment.status === 'pendente').slice(0, 5)
    };
  }

  // User profile
  async getUserProfile() {
    const user = localStorage.getItem('serena_current_user');
    return user ? JSON.parse(user) : null;
  }

  async updateUserProfile(profileData: any) {
    const user = localStorage.getItem('serena_current_user');
    if (!user) throw new Error('Usuário não encontrado');

    const updatedUser = { ...JSON.parse(user), ...profileData };
    localStorage.setItem('serena_current_user', JSON.stringify(updatedUser));

    // Atualizar também na lista de usuários
    const users = this.getLocalUsers();
    const userIndex = users.findIndex((u: any) => u.id === updatedUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('serena_users', JSON.stringify(users));
    }

    return {
      message: 'Perfil atualizado com sucesso',
      user: updatedUser
    };
  }

  async changePassword(passwordData: any) {
    const user = localStorage.getItem('serena_current_user');
    if (!user) throw new Error('Usuário não encontrado');

    const currentUser = JSON.parse(user);
    if (currentUser.password !== passwordData.currentPassword) {
      throw new Error('Senha atual incorreta');
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      throw new Error('Nova senha e confirmação não coincidem');
    }

    const updatedUser = { ...currentUser, password: passwordData.newPassword };
    localStorage.setItem('serena_current_user', JSON.stringify(updatedUser));

    // Atualizar também na lista de usuários
    const users = this.getLocalUsers();
    const userIndex = users.findIndex((u: any) => u.id === updatedUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('serena_users', JSON.stringify(users));
    }

    return {
      message: 'Senha alterada com sucesso'
    };
  }
}

export const hybridApiService = new HybridApiService();
export default hybridApiService;
