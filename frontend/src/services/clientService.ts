import { ClientOrder, CreateReturnRequest, CreateReturnResponse } from '../types';
import { api } from './api';

export const clientService = {
  /**
   * Obtener pedidos del cliente
   * GET /api/get_request (Usamos este endpoint según requerimiento)
   */
  async getClientOrder(clientId: string): Promise<ClientOrder> {
    return api.get<ClientOrder>(`/get_request?clientId=${clientId}`);
  },

  /**
   * Crear solicitud de devolución desde el cliente
   * POST /api/create_return
   */
  async createReturn(payload: CreateReturnRequest): Promise<CreateReturnResponse> {
    return api.post<CreateReturnResponse>('/create_return', payload);
  }
};
