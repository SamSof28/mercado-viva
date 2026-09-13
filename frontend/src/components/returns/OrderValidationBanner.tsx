import React from 'react';
import type { ReturnOrder } from '../../types';
import { formatCurrency, formatDateShort } from '../../utils/formatters';

interface OrderValidationBannerProps {
  order: ReturnOrder;
}

export const OrderValidationBanner: React.FC<OrderValidationBannerProps> = ({ order }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-3 px-space-4 py-space-3 bg-secondary-container/30 rounded-lg text-on-secondary-container">
      <div className="flex items-center gap-space-3 min-w-0">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-on-secondary flex-shrink-0">
          <span className="material-symbols-outlined text-[16px]">check</span>
        </span>
        <div className="flex flex-wrap items-center gap-x-space-2 gap-y-0.5 font-body-sm text-body-sm">
          <span className="font-headline-sm text-headline-sm text-on-surface">
            Pedido Validado: {order.orderId}
          </span>
          <span className="text-outline-variant hidden sm:inline">•</span>
          <span className="font-label-md text-label-md text-on-surface">{order.customer.name}</span>
          <span className="font-data-mono text-data-mono text-on-surface-variant">
            {order.customer.phone}
          </span>
          {order.customer.isVerified && (
            <span className="px-space-2 py-0.5 rounded text-label-sm font-label-sm bg-secondary-container text-on-secondary-container font-medium">
              {order.customer.accountType || 'Cuenta Verificada Web'}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-space-3 text-body-xs font-body-xs text-on-surface-variant self-end md:self-auto">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[15px]">local_shipping</span>
          Despachado {formatDateShort(order.dispatchDate)}
        </span>
        <span>•</span>
        <span>Total Compra Original: {formatCurrency(order.originalTotal)}</span>
      </div>
    </div>
  );
};
