import { api } from './api';
import type {
  StoreSession,
  ReturnOrder,
  FinancialBreakdown,
  RefundRequest,
  RefundResponse,
} from '../types';

export const returnService = {
  /**
   * Obtiene los datos de la sesión activa del cajero y sucursal.
   */
  async getSession(): Promise<StoreSession> {
    return api.get<StoreSession>('/api/session');
  },

  /**
   * Valida un código de devolución ingresado o escaneado (ej. DEV-8492)
   * y obtiene la información del pedido correspondiente.
   */
  async validateReturnCode(code: string): Promise<ReturnOrder> {
    return api.get<ReturnOrder>(`/api/returns/${encodeURIComponent(code)}`);
  },

  /**
   * Solicita al backend el recálculo financiero (subtotal, IVA proporcional, total a reembolsar).
   * El frontend NUNCA calcula números internamente.
   */
  async calculateRefund(code: string, selectedItemIds: string[]): Promise<FinancialBreakdown> {
    return api.post<FinancialBreakdown>(`/api/returns/${encodeURIComponent(code)}/calculate`, {
      selectedItemIds,
    });
  },

  /**
   * Procesa la aprobación y reembolso de los ítems seleccionados.
   */
  async processRefund(code: string, data: RefundRequest): Promise<RefundResponse> {
    return api.post<RefundResponse>(`/api/returns/${encodeURIComponent(code)}/refund`, data);
  },

  /**
   * Registra el rechazo de la devolución en el sistema.
   */
  async rejectReturn(code: string, reason: string): Promise<{ success: boolean; message: string }> {
    return api.post<{ success: boolean; message: string }>(`/api/returns/${encodeURIComponent(code)}/reject`, {
      reason,
    });
  },
};
