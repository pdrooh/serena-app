import { Patient, Session, Appointment, Payment, User } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('serena_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Converter strings de data para objetos Date
      return this.convertDates(data);
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  private convertDates(data: any): any {
    if (Array.isArray(data)) {
      return data.map(item => this.convertDates(item));
    }

    if (data && typeof data === 'object') {
      const converted: any = {};
      for (const key in data) {
        // Converter IDs numéricos para strings (compatibilidade com frontend)
        if ((key === 'id' || key === 'userId' || key === 'patientId' || key === 'sessionId') && typeof data[key] === 'number') {
          converted[key] = String(data[key]);
        }
        // Converter strings de data para objetos Date
        else if (key === 'date' || key === 'createdAt' || key === 'updatedAt' || key === 'scheduledFor' || key === 'uploadedAt') {
          converted[key] = data[key] ? new Date(data[key]) : null;
        } else if (Array.isArray(data[key])) {
          converted[key] = data[key].map((item: any) => this.convertDates(item));
        } else if (data[key] && typeof data[key] === 'object') {
          converted[key] = this.convertDates(data[key]);
        } else {
          converted[key] = data[key];
        }
      }
      return converted;
    }

    return data;
  }

  // Autenticação
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Converter o user da API para o tipo User esperado
    const user: User = {
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      role: response.user.role || 'psychologist',
      avatar: response.user.avatar,
      preferences: response.user.preferences || {
        theme: 'light',
        notifications: true,
        reminderTime: 60,
        defaultSessionDuration: 50,
        currency: 'BRL',
      },
    };

    this.token = response.token;
    localStorage.setItem('serena_token', response.token);
    return { token: response.token, user };
  }

  async register(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
    const response = await this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    // Converter o user da API para o tipo User esperado
    const user: User = {
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      role: response.user.role || 'psychologist',
      avatar: response.user.avatar,
      preferences: response.user.preferences || {
        theme: 'light',
        notifications: true,
        reminderTime: 60,
        defaultSessionDuration: 50,
        currency: 'BRL',
      },
    };

    this.token = response.token;
    localStorage.setItem('serena_token', response.token);
    return { token: response.token, user };
  }

  async verifyToken(): Promise<{ user: User }> {
    const response = await this.request<{ user: any }>('/auth/verify');

    // Converter o user da API para o tipo User esperado
    const user: User = {
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      role: response.user.role || 'psychologist',
      avatar: response.user.avatar,
      preferences: response.user.preferences || {
        theme: 'light',
        notifications: true,
        reminderTime: 60,
        defaultSessionDuration: 50,
        currency: 'BRL',
      },
    };

    return { user };
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('serena_token');
  }

  // Pacientes
  async getPatients(): Promise<Patient[]> {
    return this.request<Patient[]>('/patients');
  }

  async createPatient(patient: Omit<Patient, 'id'>): Promise<Patient> {
    const response = await this.request<{ message: string; patient: Patient }>('/patients', {
      method: 'POST',
      body: JSON.stringify(patient),
    });
    return response.patient;
  }

  async updatePatient(id: string, patient: Partial<Patient>): Promise<Patient> {
    const response = await this.request<{ message: string; patient: Patient }>(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patient),
    });
    return response.patient;
  }

  async getPatientStats(id: string): Promise<{ sessions: number; appointments: number; payments: number; total: number }> {
    return this.request<{ sessions: number; appointments: number; payments: number; total: number }>(`/patients/${id}/stats`);
  }

  async deletePatient(id: string): Promise<void> {
    return this.request<void>(`/patients/${id}`, {
      method: 'DELETE',
    });
  }

  // Sessões
  async getSessions(): Promise<Session[]> {
    return this.request<Session[]>('/sessions');
  }

  async createSession(session: Omit<Session, 'id'>): Promise<Session> {
    const response = await this.request<{ message: string; session: Session }>('/sessions', {
      method: 'POST',
      body: JSON.stringify(session),
    });
    return response.session;
  }

  async updateSession(id: string, session: Partial<Session>): Promise<Session> {
    const response = await this.request<{ message: string; session: Session }>(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(session),
    });
    return response.session;
  }

  async deleteSession(id: string): Promise<void> {
    return this.request<void>(`/sessions/${id}`, {
      method: 'DELETE',
    });
  }

  // Agendamentos
  async getAppointments(): Promise<Appointment[]> {
    return this.request<Appointment[]>('/appointments');
  }

  async createAppointment(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
    const response = await this.request<{ message: string; appointment: Appointment }>('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointment),
    });
    return response.appointment;
  }

  async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<Appointment> {
    const response = await this.request<{ message: string; appointment: Appointment }>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointment),
    });
    return response.appointment;
  }

  async deleteAppointment(id: string): Promise<void> {
    return this.request<void>(`/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  // Pagamentos
  async getPayments(): Promise<Payment[]> {
    return this.request<Payment[]>('/payments');
  }

  async createPayment(payment: Omit<Payment, 'id'>): Promise<Payment> {
    const response = await this.request<{ message: string; payment: Payment }>('/payments', {
      method: 'POST',
      body: JSON.stringify(payment),
    });
    return response.payment;
  }

  async updatePayment(id: string, payment: Partial<Payment>): Promise<Payment> {
    const response = await this.request<{ message: string; payment: Payment }>(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payment),
    });
    return response.payment;
  }

  async deletePayment(id: string): Promise<void> {
    return this.request<void>(`/payments/${id}`, {
      method: 'DELETE',
    });
  }

  // Relatórios
  async getReports(): Promise<any> {
    return this.request<any>('/reports');
  }

  // Usuários
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return this.request<void>('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<{ user: User }> {
    return this.request<{ user: User }>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // ============================================
  // MÉTODOS DE SUPER ADMIN - GERENCIAMENTO DE USUÁRIOS
  // ============================================

  // Listar todos os usuários
  async getAllUsers(): Promise<User[]> {
    return this.request<User[]>('/users/all');
  }

  // Criar novo usuário
  async createUser(userData: { name: string; email: string; password: string; role?: 'psychologist' | 'admin' | 'super_admin' }): Promise<{ user: User }> {
    return this.request<{ user: User }>('/users/create', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Atualizar usuário
  async updateUserByAdmin(userId: string, userData: Partial<User>): Promise<{ user: User }> {
    return this.request<{ user: User }>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Trocar senha de usuário
  async changeUserPassword(userId: string, newPassword: string): Promise<void> {
    return this.request<void>(`/users/${userId}/password`, {
      method: 'PUT',
      body: JSON.stringify({ newPassword }),
    });
  }

  // Deletar usuário (soft delete)
  async deleteUser(userId: string): Promise<void> {
    return this.request<void>(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Inspecionar usuário (ver dados completos)
  async inspectUser(userId: string): Promise<{
    user: User;
    stats: {
      patients: number;
      sessions: number;
      appointments: number;
      payments: number;
      totalRevenue: number;
    };
    recentPatients: any[];
    recentSessions: any[];
  }> {
    return this.request(`/users/${userId}/inspect`);
  }

  // Verificar se a API está disponível
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();
