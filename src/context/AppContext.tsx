import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Patient, Session, Appointment, Payment, Comment } from '../types';
import { apiService } from '../services/realApiService';
import { externalIntegrationsService } from '../services/externalIntegrations';

interface AppState {
  patients: Patient[];
  sessions: Session[];
  appointments: Appointment[];
  payments: Payment[];
  isLoading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_DATA'; payload: { patients: Patient[]; sessions: Session[]; appointments: Appointment[]; payments: Payment[] } }
  | { type: 'ADD_PATIENT'; payload: Patient }
  | { type: 'UPDATE_PATIENT'; payload: Patient }
  | { type: 'DELETE_PATIENT'; payload: string }
  | { type: 'ADD_SESSION'; payload: Session }
  | { type: 'UPDATE_SESSION'; payload: Session }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'ADD_APPOINTMENT'; payload: Appointment }
  | { type: 'UPDATE_APPOINTMENT'; payload: Appointment }
  | { type: 'DELETE_APPOINTMENT'; payload: string }
  | { type: 'ADD_PAYMENT'; payload: Payment }
  | { type: 'UPDATE_PAYMENT'; payload: Payment }
  | { type: 'DELETE_PAYMENT'; payload: string }
  | { type: 'ADD_COMMENT'; payload: { patientId: string; comment: Comment } };

const initialState: AppState = {
  patients: [],
  sessions: [],
  appointments: [],
  payments: [],
  isLoading: false,
  error: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'LOAD_DATA':
      return {
        ...state,
        patients: action.payload.patients,
        sessions: action.payload.sessions,
        appointments: action.payload.appointments,
        payments: action.payload.payments,
        isLoading: false,
        error: null,
      };
    case 'ADD_PATIENT':
      return { ...state, patients: [...state.patients, action.payload] };
    case 'UPDATE_PATIENT':
      return {
        ...state,
        patients: state.patients.map(p => p.id === action.payload.id ? action.payload : p),
      };
    case 'DELETE_PATIENT':
      return {
        ...state,
        patients: state.patients.filter(p => p.id !== action.payload),
        sessions: state.sessions.filter(s => s.patientId !== action.payload),
        appointments: state.appointments.filter(a => a.patientId !== action.payload),
        payments: state.payments.filter(p => p.patientId !== action.payload),
      };
    case 'ADD_SESSION':
      return { ...state, sessions: [...state.sessions, action.payload] };
    case 'UPDATE_SESSION':
      return {
        ...state,
        sessions: state.sessions.map(s => s.id === action.payload.id ? action.payload : s),
      };
    case 'DELETE_SESSION':
      return { ...state, sessions: state.sessions.filter(s => s.id !== action.payload) };
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.payload] };
    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(a => a.id === action.payload.id ? action.payload : a),
      };
    case 'DELETE_APPOINTMENT':
      return { ...state, appointments: state.appointments.filter(a => a.id !== action.payload) };
    case 'ADD_PAYMENT':
      return { ...state, payments: [...state.payments, action.payload] };
    case 'UPDATE_PAYMENT':
      return {
        ...state,
        payments: state.payments.map(p => p.id === action.payload.id ? action.payload : p),
      };
    case 'DELETE_PAYMENT':
      return { ...state, payments: state.payments.filter(p => p.id !== action.payload) };
    case 'ADD_COMMENT':
      return {
        ...state,
        patients: state.patients.map(patient =>
          patient.id === action.payload.patientId
            ? { ...patient, comments: [...(patient.comments || []), action.payload.comment] }
            : patient
        ),
      };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Métodos para pacientes
  addPatient: (patient: Omit<Patient, 'id'>) => Promise<void>;
  updatePatient: (id: string, patient: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  getPatientById: (id: string) => Patient | undefined;
  // Métodos para sessões
  addSession: (session: Omit<Session, 'id'>) => Promise<void>;
  updateSession: (id: string, session: Partial<Session>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  // Métodos para agendamentos
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<Appointment>;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  // Métodos para pagamentos
  addPayment: (payment: Omit<Payment, 'id'>) => Promise<void>;
  updatePayment: (id: string, payment: Partial<Payment>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
  getTotalRevenue: () => number;
  getPendingPayments: () => Payment[];
  // Métodos para comentários
  addComment: (patientId: string, text: string, author: string) => Promise<void>;
  // Métodos de controle
  loadData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const loadData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const [patients, sessions, appointments, payments] = await Promise.all([
        apiService.getPatients(),
        apiService.getSessions(),
        apiService.getAppointments(),
        apiService.getPayments(),
      ]);

      dispatch({
        type: 'LOAD_DATA',
        payload: { patients, sessions, appointments, payments },
      });
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      const errorMessage = error?.message || 'Erro ao carregar dados. Verifique se o backend está rodando.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      // Não lançar erro para não quebrar a aplicação, mas logar para debug
      console.warn('Dados não foram carregados do backend. Verifique a conexão.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Carregar dados quando o componente montar
  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Métodos para pacientes
  const addPatient = async (patient: Omit<Patient, 'id'>) => {
    try {
      const newPatient = await apiService.createPatient(patient);
      dispatch({ type: 'ADD_PATIENT', payload: newPatient });
    } catch (error) {
      console.error('Erro ao adicionar paciente:', error);
      throw error;
    }
  };

  const updatePatient = async (id: string, patient: Partial<Patient>) => {
    try {
      const updatedPatient = await apiService.updatePatient(id, patient);
      dispatch({ type: 'UPDATE_PATIENT', payload: updatedPatient });
    } catch (error) {
      console.error('Erro ao atualizar paciente:', error);
      throw error;
    }
  };

  const deletePatient = async (id: string) => {
    try {
      await apiService.deletePatient(id);
      dispatch({ type: 'DELETE_PATIENT', payload: id });
    } catch (error) {
      console.error('Erro ao deletar paciente:', error);
      throw error;
    }
  };

  // Métodos para sessões
  const addSession = async (session: Omit<Session, 'id'>) => {
    try {
      const newSession = await apiService.createSession(session);
      dispatch({ type: 'ADD_SESSION', payload: newSession });
    } catch (error) {
      console.error('Erro ao adicionar sessão:', error);
      throw error;
    }
  };

  const updateSession = async (id: string, session: Partial<Session>) => {
    try {
      const updatedSession = await apiService.updateSession(id, session);
      dispatch({ type: 'UPDATE_SESSION', payload: updatedSession });
    } catch (error) {
      console.error('Erro ao atualizar sessão:', error);
      throw error;
    }
  };

  const deleteSession = async (id: string) => {
    try {
      await apiService.deleteSession(id);
      dispatch({ type: 'DELETE_SESSION', payload: id });
    } catch (error) {
      console.error('Erro ao deletar sessão:', error);
      throw error;
    }
  };

  // Métodos para agendamentos
  const addAppointment = async (appointment: Omit<Appointment, 'id'>) => {
    try {
      const newAppointment = await apiService.createAppointment(appointment);
      dispatch({ type: 'ADD_APPOINTMENT', payload: newAppointment });

      // Sincronizar com calendários externos
      try {
        await externalIntegrationsService.syncAppointmentToAllCalendars(newAppointment);
      } catch (syncError) {
        console.warn('Erro na sincronização de calendário:', syncError);
      }

      return newAppointment;
    } catch (error) {
      console.error('Erro ao adicionar agendamento:', error);
      throw error;
    }
  };

  const updateAppointment = async (id: string, appointment: Partial<Appointment>) => {
    try {
      const updatedAppointment = await apiService.updateAppointment(id, appointment);
      dispatch({ type: 'UPDATE_APPOINTMENT', payload: updatedAppointment });
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      throw error;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      await apiService.deleteAppointment(id);
      dispatch({ type: 'DELETE_APPOINTMENT', payload: id });
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error);
      throw error;
    }
  };

  // Métodos para pagamentos
  const addPayment = async (payment: Omit<Payment, 'id'>) => {
    try {
      const newPayment = await apiService.createPayment(payment);
      dispatch({ type: 'ADD_PAYMENT', payload: newPayment });
    } catch (error) {
      console.error('Erro ao adicionar pagamento:', error);
      throw error;
    }
  };

  const updatePayment = async (id: string, payment: Partial<Payment>) => {
    try {
      const updatedPayment = await apiService.updatePayment(id, payment);
      dispatch({ type: 'UPDATE_PAYMENT', payload: updatedPayment });
    } catch (error) {
      console.error('Erro ao atualizar pagamento:', error);
      throw error;
    }
  };

  const deletePayment = async (id: string) => {
    try {
      await apiService.deletePayment(id);
      dispatch({ type: 'DELETE_PAYMENT', payload: id });
    } catch (error) {
      console.error('Erro ao deletar pagamento:', error);
      throw error;
    }
  };

  // Métodos auxiliares
  const getPatientById = (id: string): Patient | undefined => {
    return state.patients.find(patient => patient.id === id);
  };

  const getTotalRevenue = (): number => {
    return state.payments
      .filter(payment => payment.status === 'pago')
      .reduce((total, payment) => total + payment.amount, 0);
  };

  const getPendingPayments = (): Payment[] => {
    return state.payments.filter(payment =>
      payment.status === 'pendente' || payment.status === 'atrasado'
    );
  };

  const addComment = async (patientId: string, text: string, author: string): Promise<void> => {
    const comment: Comment = {
      id: `comment_${Date.now()}`,
      patientId,
      author,
      text,
      date: new Date(),
      createdAt: new Date(),
    };

    dispatch({ type: 'ADD_COMMENT', payload: { patientId, comment } });
  };

  const value: AppContextType = {
    state,
    dispatch,
    addPatient,
    updatePatient,
    deletePatient,
    getPatientById,
    addSession,
    updateSession,
    deleteSession,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    addPayment,
    updatePayment,
    deletePayment,
    getTotalRevenue,
    getPendingPayments,
    addComment,
    loadData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
