import React, { createContext, useContext, useState, useEffect } from 'react';
import type { StoreSession } from '../types';
import { returnService } from '../services/returnService';

interface SessionContextType {
  session: StoreSession;
  isLoading: boolean;
  error: string | null;
  refreshSession: () => Promise<void>;
}

const fallbackSession: StoreSession = {
  storeName: 'Sucursal Providencia #104',
  register: 'Caja 03',
  shift: 'Turno Mañana',
  posVersion: 'v4.8.2',
  cashier: {
    id: '#8841',
    name: 'Carlos Mendoza',
    role: 'Cajero Líder',
  },
};

const SessionContext = createContext<SessionContextType>({
  session: fallbackSession,
  isLoading: false,
  error: null,
  refreshSession: async () => {},
});

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<StoreSession>(fallbackSession);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await returnService.getSession();
      setSession(data);
    } catch (err) {
      console.warn('No se pudo conectar con el endpoint de sesión, usando sesión local:', err);
      // Mantiene el fallbackSession para permitir desarrollo visual
      setError(err instanceof Error ? err.message : 'Error al cargar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return (
    <SessionContext.Provider
      value={{
        session,
        isLoading,
        error,
        refreshSession: fetchSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export function useSession(): SessionContextType {
  return useContext(SessionContext);
}
