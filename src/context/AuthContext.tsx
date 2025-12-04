import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { apiService } from '../services/realApiService';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'UPDATE_USER'; payload: User };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
};

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  verifyToken: () => Promise<boolean>;
  isSuperAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const verifyToken = async (): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await apiService.verifyToken();
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
      return true;
    } catch (error) {
      console.error('Token inválido:', error);
      dispatch({ type: 'LOGOUT' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Verificar token ao inicializar
  useEffect(() => {
    verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await apiService.login(email, password);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
      toast.success('Login realizado com sucesso!');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao fazer login.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await apiService.register(name, email, password);
      dispatch({ type: 'REGISTER_SUCCESS', payload: response.user });
      toast.success('Conta criada com sucesso!');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao criar conta.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    apiService.logout();
    dispatch({ type: 'LOGOUT' });
    toast.info('Você foi desconectado.');
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      await apiService.changePassword(currentPassword, newPassword);
      toast.success('Senha alterada com sucesso!');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao alterar senha.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await apiService.updateUser(state.user?.id || '', userData);
      dispatch({ type: 'UPDATE_USER', payload: response.user });
      toast.success('Perfil atualizado com sucesso!');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao atualizar perfil.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const isSuperAdmin = (): boolean => {
    return state.user?.role === 'super_admin';
  };

  const value: AuthContextType = {
    state,
    login,
    register,
    logout,
    changePassword,
    updateUser,
    verifyToken,
    isSuperAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
