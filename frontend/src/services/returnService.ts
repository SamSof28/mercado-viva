import { api } from './api';
import type {
  StoreSession,
  ReturnOrder,
  OrderItem,
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
    const order = await api.get<any>(`/api/returns/${encodeURIComponent(code)}`);
    return {
      code: order.codigo_retorno,
      orderId: order.id_pedido,
      customer: order.customer ?? {
        name: 'Cliente web',
        phone: '',
        isVerified: true,
        accountType: 'Cuenta Web',
      },
      items: (order.detalle_pedido ?? []).map((item: any): OrderItem => ({
        id: item.id_producto,
        sku: item.productos?.sku ?? item.id_producto,
        name: item.productos?.nombre ?? 'Producto sin nombre',
        category: 'Sin categoría',
        imageUrl: item.productos?.imagen_url ?? '',
        unitPrice: Number(item.precio_unitario),
        quantityOrdered: item.cantidad_comprada,
        quantityToReturn: item.cantidad_comprada,
        physicalStatus: null,
        returnReason: '',
        isSelected: item.productos?.es_devoluble === true,
      })),
      dispatchDate: order.fecha_compra,
      originalTotal: Number(order.total_pagado ?? 0),
      originalPayment: order.originalPayment ?? {
        type: 'Medio de pago original',
        provider: '',
        lastDigits: '',
        gateway: '',
      },
    };
  },

  /**
   * Solicita al backend el recálculo financiero (subtotal, IVA proporcional, total a reembolsar).
   * El frontend NUNCA calcula números internamente.
   */
  async calculateRefund(code: string, selectedItems: OrderItem[]): Promise<FinancialBreakdown> {
    return api.post<FinancialBreakdown>(`/api/returns/${encodeURIComponent(code)}/calculate`, {
      productos: selectedItems.map((item) => ({
        id_producto: item.id,
        cantidad_devuelta: item.quantityToReturn,
      })),
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
