import { Patient, Session, Appointment, Payment } from '../types';

// Criar datas do mês atual
const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Maria Silva',
    age: 28,
    email: 'maria.silva@email.com',
    phone: '(11) 99999-9999',
    address: 'São Paulo, SP',
    emergencyContact: 'João Silva',
    emergencyPhone: '(11) 88888-8888',
    initialObservations: 'Paciente com ansiedade generalizada, primeira consulta.',
    documents: [],
    comments: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'João Santos',
    age: 35,
    email: 'joao.santos@email.com',
    phone: '(11) 77777-7777',
    address: 'São Paulo, SP',
    emergencyContact: 'Ana Santos',
    emergencyPhone: '(11) 66666-6666',
    initialObservations: 'Paciente com depressão, em tratamento há 3 meses.',
    documents: [],
    comments: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '3',
    name: 'Ana Costa',
    age: 42,
    email: 'ana.costa@email.com',
    phone: '(11) 55555-5555',
    address: 'São Paulo, SP',
    emergencyContact: 'Carlos Costa',
    emergencyPhone: '(11) 44444-4444',
    initialObservations: 'Paciente com fobia social, iniciando tratamento.',
    documents: [],
    comments: [],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-15')
  }
];

export const mockSessions: Session[] = [
  {
    id: '1',
    patientId: '1',
    date: new Date(currentYear, currentMonth, 5), // 5 dias atrás
    duration: 50,
    type: 'presencial',
    notes: 'Paciente relatou melhora significativa na ansiedade. Trabalhamos técnicas de respiração e mindfulness. Ela demonstrou maior autocontrole em situações estressantes.',
    audioRecording: 'session_1_audio.mp3',
    attachments: [],
    mood: 8,
    objectives: ['Reduzir ansiedade', 'Melhorar autocontrole'],
    techniques: ['Respiração diafragmática', 'Mindfulness'],
    nextSessionGoals: 'Continuar práticas de mindfulness e trabalhar exposição gradual',
    createdAt: new Date(currentYear, currentMonth, 5)
  },
  {
    id: '2',
    patientId: '2',
    date: new Date(currentYear, currentMonth, 10), // 10 dias atrás
    duration: 45,
    type: 'online',
    notes: 'Sessão focada em identificação de pensamentos negativos. Paciente está mais consciente de seus padrões de pensamento. Trabalhamos reestruturação cognitiva.',
    attachments: [],
    mood: 6,
    objectives: ['Identificar pensamentos negativos', 'Reestruturação cognitiva'],
    techniques: ['Reestruturação cognitiva', 'Registro de pensamentos'],
    nextSessionGoals: 'Praticar técnicas de reestruturação cognitiva diariamente',
    createdAt: new Date(currentYear, currentMonth, 10)
  },
  {
    id: '3',
    patientId: '3',
    date: new Date(currentYear, currentMonth, 15), // 15 dias atrás
    duration: 50,
    type: 'presencial',
    notes: 'Primeira sessão com paciente. Avaliação inicial e estabelecimento de objetivos terapêuticos. Paciente demonstrou boa receptividade ao tratamento.',
    attachments: [],
    mood: 7,
    objectives: ['Avaliação inicial', 'Estabelecer rapport'],
    techniques: ['Entrevista clínica', 'Avaliação psicológica'],
    nextSessionGoals: 'Desenvolver plano de tratamento personalizado',
    createdAt: new Date(currentYear, currentMonth, 15)
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    date: new Date(currentYear, currentMonth, currentDate.getDate() + 2), // 2 dias no futuro
    duration: 50,
    type: 'presencial',
    status: 'agendado',
    notes: 'Sessão de acompanhamento',
    reminderSent: false,
    createdAt: new Date(currentYear, currentMonth, currentDate.getDate() - 5)
  },
  {
    id: '2',
    patientId: '2',
    date: new Date(currentYear, currentMonth, currentDate.getDate() + 5), // 5 dias no futuro
    duration: 45,
    type: 'online',
    status: 'confirmado',
    notes: 'Sessão de acompanhamento',
    reminderSent: true,
    createdAt: new Date(currentYear, currentMonth, currentDate.getDate() - 3)
  },
  {
    id: '3',
    patientId: '3',
    date: new Date(currentYear, currentMonth, currentDate.getDate() + 7), // 7 dias no futuro
    duration: 50,
    type: 'presencial',
    status: 'agendado',
    notes: 'Continuidade do tratamento',
    reminderSent: false,
    createdAt: new Date(currentYear, currentMonth, currentDate.getDate() - 2)
  }
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    patientId: '1',
    sessionId: '1',
    amount: 150,
    date: new Date(currentYear, currentMonth, 5), // 5 dias atrás
    method: 'pix',
    status: 'pago',
    receiptUrl: 'receipt_1.pdf',
    notes: 'Pagamento realizado via PIX',
    createdAt: new Date(currentYear, currentMonth, 5)
  },
  {
    id: '2',
    patientId: '2',
    sessionId: '2',
    amount: 180,
    date: new Date(currentYear, currentMonth, 10), // 10 dias atrás
    method: 'dinheiro',
    status: 'pago',
    notes: 'Pagamento em dinheiro',
    createdAt: new Date(currentYear, currentMonth, 10)
  },
  {
    id: '3',
    patientId: '3',
    amount: 200,
    date: new Date(currentYear, currentMonth, 15), // 15 dias atrás
    method: 'cartao',
    status: 'pago',
    notes: 'Pagamento via cartão de crédito',
    createdAt: new Date(currentYear, currentMonth, 15)
  },
  {
    id: '4',
    patientId: '1',
    amount: 150,
    date: new Date(currentYear, currentMonth, 20), // 5 dias atrás
    method: 'pix',
    status: 'pendente',
    notes: 'Aguardando confirmação do PIX',
    createdAt: new Date(currentYear, currentMonth, 20)
  },
  {
    id: '5',
    patientId: '2',
    amount: 180,
    date: new Date(currentYear, currentMonth - 1, 25), // Mês passado
    method: 'dinheiro',
    status: 'atrasado',
    notes: 'Pagamento em atraso',
    createdAt: new Date(currentYear, currentMonth - 1, 25)
  }
];

// Exportar todos os dados mockados
export const mockData = {
  patients: mockPatients,
  sessions: mockSessions,
  appointments: mockAppointments,
  payments: mockPayments
};
