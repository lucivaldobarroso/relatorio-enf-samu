
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PDV from './pages/PDV';
import Checkout from './pages/Checkout';
import Estoque from './pages/Estoque';
import OrderStatus from './pages/OrderStatus';
import SuccessPage from './pages/SuccessPage';
import ContractPage from './pages/ContractPage';
import LoginPage from './pages/LoginPage';
import FinancialPage from './pages/FinancialPage';
import UserTransactionsPage from './pages/UserTransactionsPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import { dataService } from './services/dataService';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PrivateRoute = ({ children }: { children?: React.ReactNode }) => {
  const auth = dataService.getState().auth;
  if (!auth.isAuthenticated) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/pdv" element={<PrivateRoute><PDV /></PrivateRoute>} />
        <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="/contrato" element={<PrivateRoute><ContractPage /></PrivateRoute>} />
        <Route path="/estoque" element={<PrivateRoute><Estoque /></PrivateRoute>} />
        <Route path="/status/:id" element={<PrivateRoute><OrderStatus /></PrivateRoute>} />
        <Route path="/sucesso/:id" element={<PrivateRoute><SuccessPage /></PrivateRoute>} />
        <Route path="/financas" element={<PrivateRoute><FinancialPage /></PrivateRoute>} /> 
        <Route path="/meus-pedidos" element={<PrivateRoute><UserTransactionsPage /></PrivateRoute>} />
        <Route path="/contato" element={<PrivateRoute><ContactPage /></PrivateRoute>} />
        <Route path="/privacidade" element={<PrivacyPage />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
