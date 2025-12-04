import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Records from './pages/Records';
import Appointments from './pages/Appointments';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import PatientPortal from './pages/PatientPortal';
import Security from './pages/Security';
import Integrations from './pages/Integrations';
import UserManagement from './pages/UserManagement';

import { GlobalStyles } from './styles/GlobalStyles';

function AppRoutes() {
  const { state: authState, login } = useAuth();

  // Wrapper function to match expected signature
  const handleLogin = async (email: string, password: string): Promise<void> => {
    await login(email, password);
  };

  // Mostrar loading enquanto verifica autenticação
  if (authState.isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Carregando...
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return (
      <Login
        onLogin={handleLogin}
      />
    );
  }

  return (
    <AppProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/records" element={<Records />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/patient-portal" element={<PatientPortal />} />
          <Route path="/security" element={<Security />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/user-management" element={<UserManagement />} />
        </Routes>
      </Layout>
    </AppProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <GlobalStyles />
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
