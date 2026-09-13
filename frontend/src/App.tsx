import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import { POSLayout } from './components/layout/POSLayout';
import { ReturnsPage } from './pages/ReturnsPage';

export const App: React.FC = () => {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<POSLayout />}>
            <Route path="/" element={<Navigate to="/devoluciones-omnicanal" replace />} />
            <Route path="/devoluciones-omnicanal" element={<ReturnsPage />} />
            <Route path="*" element={<Navigate to="/devoluciones-omnicanal" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  );
};

export default App;
