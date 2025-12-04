const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

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
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Auth endpoints
  async register(userData: {
    name: string;
    email: string;
    password: string;
    role?: 'psychologist' | 'admin';
  }) {
    return this.request<{
      message: string;
      token: string;
      user: any;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request<{
      message: string;
      token: string;
      user: any;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async verifyToken() {
    return this.request<{
      valid: boolean;
      user: any;
    }>('/auth/verify');
  }

  // Patients endpoints
  async getPatients() {
    return this.request<any[]>('/patients');
  }

  async getPatient(id: string) {
    return this.request<any>(`/patients/${id}`);
  }

  async createPatient(patientData: any) {
    return this.request<{
      message: string;
      patient: any;
    }>('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  }

  async updatePatient(id: string, patientData: any) {
    return this.request<{
      message: string;
      patient: any;
    }>(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    });
  }

  async deletePatient(id: string) {
    return this.request<{
      message: string;
    }>(`/patients/${id}`, {
      method: 'DELETE',
    });
  }

  async searchPatients(query: string) {
    return this.request<any[]>(`/patients/search/${encodeURIComponent(query)}`);
  }

  // Sessions endpoints
  async getSessions(params?: {
    patientId?: string;
    startDate?: string;
    endDate?: string;
    type?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });
    }

    const queryString = searchParams.toString();
    return this.request<any[]>(`/sessions${queryString ? `?${queryString}` : ''}`);
  }

  async getSession(id: string) {
    return this.request<any>(`/sessions/${id}`);
  }

  async createSession(sessionData: any) {
    return this.request<{
      message: string;
      session: any;
    }>('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async updateSession(id: string, sessionData: any) {
    return this.request<{
      message: string;
      session: any;
    }>(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    });
  }

  async deleteSession(id: string) {
    return this.request<{
      message: string;
    }>(`/sessions/${id}`, {
      method: 'DELETE',
    });
  }

  // Appointments endpoints
  async getAppointments(params?: {
    patientId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    type?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });
    }

    const queryString = searchParams.toString();
    return this.request<any[]>(`/appointments${queryString ? `?${queryString}` : ''}`);
  }

  async getAppointment(id: string) {
    return this.request<any>(`/appointments/${id}`);
  }

  async createAppointment(appointmentData: any) {
    return this.request<{
      message: string;
      appointment: any;
    }>('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async updateAppointment(id: string, appointmentData: any) {
    return this.request<{
      message: string;
      appointment: any;
    }>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData),
    });
  }

  async deleteAppointment(id: string) {
    return this.request<{
      message: string;
    }>(`/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  // Payments endpoints
  async getPayments(params?: {
    patientId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    method?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });
    }

    const queryString = searchParams.toString();
    return this.request<any[]>(`/payments${queryString ? `?${queryString}` : ''}`);
  }

  async getPayment(id: string) {
    return this.request<any>(`/payments/${id}`);
  }

  async createPayment(paymentData: any) {
    return this.request<{
      message: string;
      payment: any;
    }>('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async updatePayment(id: string, paymentData: any) {
    return this.request<{
      message: string;
      payment: any;
    }>(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paymentData),
    });
  }

  async deletePayment(id: string) {
    return this.request<{
      message: string;
    }>(`/payments/${id}`, {
      method: 'DELETE',
    });
  }

  async getPaymentStats(params?: {
    startDate?: string;
    endDate?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });
    }

    const queryString = searchParams.toString();
    return this.request<any>(`/payments/stats/summary${queryString ? `?${queryString}` : ''}`);
  }

  // Reports endpoints
  async getDashboard() {
    return this.request<any>('/reports/dashboard');
  }

  async getFinancialReport(params?: {
    startDate?: string;
    endDate?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });
    }

    const queryString = searchParams.toString();
    return this.request<any>(`/reports/financial${queryString ? `?${queryString}` : ''}`);
  }

  async getPatientsReport(params?: {
    startDate?: string;
    endDate?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });
    }

    const queryString = searchParams.toString();
    return this.request<any>(`/reports/patients${queryString ? `?${queryString}` : ''}`);
  }

  async getSessionsReport(params?: {
    startDate?: string;
    endDate?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });
    }

    const queryString = searchParams.toString();
    return this.request<any>(`/reports/sessions${queryString ? `?${queryString}` : ''}`);
  }

  async getAppointmentsReport(params?: {
    startDate?: string;
    endDate?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });
    }

    const queryString = searchParams.toString();
    return this.request<any>(`/reports/appointments${queryString ? `?${queryString}` : ''}`);
  }

  // User endpoints
  async getUserProfile() {
    return this.request<any>('/users/profile');
  }

  async updateUserProfile(profileData: any) {
    return this.request<{
      message: string;
      user: any;
    }>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    return this.request<{
      message: string;
    }>('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  async getUserStats() {
    return this.request<any>('/users/stats');
  }
}

export const apiService = new ApiService(API_BASE_URL);
export default apiService;
