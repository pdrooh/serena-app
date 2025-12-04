export interface Patient {
  id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  initialObservations: string;
  documents: Document[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  name: string;
  type: 'atestado' | 'encaminhamento' | 'outro';
  url: string;
  uploadedAt: Date;
}

export interface Session {
  id: string;
  patientId: string;
  date: Date;
  duration: number; // em minutos
  type: 'presencial' | 'online';
  notes: string;
  audioRecording?: string;
  attachments: Document[];
  mood: number; // escala de 1-10
  objectives: string[];
  techniques: string[];
  nextSessionGoals: string;
  createdAt: Date;
}

export interface Appointment {
  id: string;
  patientId: string;
  date: Date;
  duration: number;
  type: 'presencial' | 'online';
  status: 'agendado' | 'confirmado' | 'realizado' | 'cancelado';
  notes?: string;
  reminderSent: boolean;
  createdAt: Date;
}

export interface Payment {
  id: string;
  patientId: string;
  sessionId?: string;
  amount: number;
  date: Date;
  method: 'dinheiro' | 'pix' | 'cartao' | 'transferencia';
  status: 'pago' | 'pendente' | 'atrasado';
  receiptUrl?: string;
  notes?: string;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'psychologist' | 'admin' | 'super_admin';
  avatar?: string;
  preferences: UserPreferences;
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  reminderTime: number; // minutos antes da consulta
  defaultSessionDuration: number;
  currency: string;
}

export interface Comment {
  id: string;
  patientId: string;
  author: string;
  text: string;
  date: Date;
  createdAt: Date;
}

export interface DashboardStats {
  totalPatients: number;
  activePatients: number;
  sessionsThisMonth: number;
  revenueThisMonth: number;
  upcomingAppointments: number;
  pendingPayments: number;
}

export interface NotificationConfig {
  id: string;
  type: 'appointment' | 'payment' | 'birthday' | 'custom';
  title: string;
  message: string;
  scheduledFor: Date;
  patientId?: string;
  sent: boolean;
  method: 'browser' | 'email' | 'sms' | 'whatsapp';
  priority: 'low' | 'medium' | 'high';
}

export interface ReminderSettings {
  appointmentReminder: {
    enabled: boolean;
    timeBefore: number; // minutos antes
    methods: ('browser' | 'email' | 'sms' | 'whatsapp')[];
  };
  paymentReminder: {
    enabled: boolean;
    daysAfter: number; // dias após vencimento
    methods: ('browser' | 'email' | 'sms' | 'whatsapp')[];
  };
  birthdayReminder: {
    enabled: boolean;
    daysBefore: number; // dias antes do aniversário
    methods: ('browser' | 'email' | 'sms' | 'whatsapp')[];
  };
}
