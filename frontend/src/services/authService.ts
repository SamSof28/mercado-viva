import { AuthResponse } from '../types';
import { api } from './api';

export const authService = {
  /**
   * Autenticar usuario (Cajero o Cliente)
   * POST /api/session
   */
  async login(email: string, password?: string): Promise<AuthResponse> {
    // Usamos el wrapper api.post que ya existe
    const response = await api.post<AuthResponse>('/session', { email, password });
    if (typeof localStorage !== 'undefined') localStorage.setItem('mercado-viva-token', response.token);
    return response;
  }
};
