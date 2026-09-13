import React from 'react';
import type { RefundMethod, OriginalPaymentMethod } from '../../types';

interface RefundMethodSelectorProps {
  selectedMethod: RefundMethod;
  onSelectMethod: (method: RefundMethod) => void;
  originalPayment: OriginalPaymentMethod;
}

export const RefundMethodSelector: React.FC<RefundMethodSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
  originalPayment,
}) => {
  return (
    <div className="flex flex-col gap-space-3 pt-space-3">
      <label className="font-label-md text-label-md text-on-surface flex items-center justify-between">
        <span>Método de Reembolso</span>
        <span className="text-label-sm font-label-sm text-primary font-medium">Recomendado</span>
      </label>

      <div className="flex flex-col gap-space-2">
        {/* Option 1: Reversión a Tarjeta */}
        <label
          className={`flex items-start gap-space-3 p-space-3 rounded-lg cursor-pointer transition-colors ${
            selectedMethod === 'original_card'
              ? 'bg-surface-container'
              : 'bg-surface-container-low hover:bg-surface-container'
          }`}
        >
          <input
            type="radio"
            name="refundMethod"
            className="mt-1 w-4 h-4 text-primary accent-primary cursor-pointer"
            checked={selectedMethod === 'original_card'}
            onChange={() => onSelectMethod('original_card')}
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-space-2">
              <span className="material-symbols-outlined text-[18px] text-primary">credit_card</span>
              <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                Reversión a {originalPayment.type}
              </span>
            </div>
            <span className="font-data-mono text-body-xs text-on-surface-variant mt-0.5">
              {originalPayment.provider} (**** {originalPayment.lastDigits}) vía {originalPayment.gateway}
            </span>
            <span className="text-body-xs font-body-xs text-secondary mt-0.5">
              Acreditación estimada: 24 - 48 hrs hábiles
            </span>
          </div>
        </label>

        {/* Option 2: Vale de Compra / Saldo en App */}
        <label
          className={`flex items-start gap-space-3 p-space-3 rounded-lg cursor-pointer transition-colors ${
            selectedMethod === 'store_credit'
              ? 'bg-surface-container'
              : 'bg-surface-container-low hover:bg-surface-container'
          }`}
        >
          <input
            type="radio"
            name="refundMethod"
            className="mt-1 w-4 h-4 text-primary accent-primary cursor-pointer"
            checked={selectedMethod === 'store_credit'}
            onChange={() => onSelectMethod('store_credit')}
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-space-2">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">wallet</span>
              <span className="font-label-md text-label-md text-on-surface">
                Vale de Compra / Saldo en App
              </span>
            </div>
            <span className="text-body-xs font-body-xs text-on-surface-variant mt-0.5">
              Inmediato + 5% extra de bonificación
            </span>
          </div>
        </label>

        {/* Option 3: Efectivo en Caja */}
        <label
          className={`flex items-start gap-space-3 p-space-3 rounded-lg cursor-pointer transition-colors ${
            selectedMethod === 'cash'
              ? 'bg-surface-container'
              : 'bg-surface-container-low hover:bg-surface-container'
          }`}
        >
          <input
            type="radio"
            name="refundMethod"
            className="mt-1 w-4 h-4 text-primary accent-primary cursor-pointer"
            checked={selectedMethod === 'cash'}
            onChange={() => onSelectMethod('cash')}
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-space-2">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                point_of_sale
              </span>
              <span className="font-label-md text-label-md text-on-surface">Efectivo en Caja</span>
            </div>
            <span className="text-body-xs font-body-xs text-on-surface-variant mt-0.5">
              Apertura automática de gaveta
            </span>
          </div>
        </label>
      </div>
    </div>
  );
};
