import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import { POSLayout } from './components/layout/POSLayout';
import { ReturnsPage } from './pages/ReturnsPage';
import { LoginPage } from './pages/LoginPage';
import { ClientOrderPage } from './pages/ClientOrderPage';

export const App: React.FC = () => {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route - Login */}
          <Route path="/" element={<LoginPage />} />

          {/* Protected Route - Cashier POS */}
          <Route path="/pos" element={<POSLayout />}>
            <Route path="" element={<Navigate to="devoluciones-omnicanal" replace />} />
            <Route path="devoluciones-omnicanal" element={<ReturnsPage />} />
            <Route path="*" element={<Navigate to="devoluciones-omnicanal" replace />} />
          </Route>

          {/* Protected Route - Client */}
          <Route path="/cliente">
            <Route path="" element={<Navigate to="pedidos" replace />} />
            <Route path="pedidos" element={<ClientOrderPage />} />
            <Route path="*" element={<Navigate to="pedidos" replace />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  );
};

export default App;
