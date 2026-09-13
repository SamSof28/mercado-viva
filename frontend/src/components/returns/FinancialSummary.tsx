import React from 'react';
import type { FinancialBreakdown } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface FinancialSummaryProps {
  financials: FinancialBreakdown | null;
  isCalculating: boolean;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  financials,
  isCalculating,
}) => {
  const selectedCount = financials?.selectedCount ?? 0;
  const subtotal = financials?.subtotal ?? 0;
  const ivaAmount = financials?.ivaAmount ?? 0;
  const shippingCost = financials?.shippingCost ?? 0;
  const totalRefund = financials?.totalRefund ?? 0;
  const currency = financials?.currency ?? 'CLP';

  return (
    <div className="flex flex-col gap-space-3">
      <div className="flex items-center justify-between">
        <span className="font-headline-sm text-headline-sm text-on-surface">
          Resumen de Liquidación
        </span>
        <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
      </div>

      <div className={`flex flex-col gap-space-2 pt-space-2 ${isCalculating ? 'opacity-60' : ''}`}>
        <div className="flex justify-between items-center text-body-sm font-body-sm text-on-surface-variant">
          <span>
            Subtotal ítems seleccionados ({selectedCount} {selectedCount === 1 ? 'ítem' : 'ítems'})
          </span>
          <span className="font-data-mono text-data-mono text-on-surface">
            {formatCurrency(subtotal)}
          </span>
        </div>

        <div className="flex justify-between items-center text-body-sm font-body-sm text-on-surface-variant">
          <span className="flex items-center gap-1">
            Reversión proporcional IVA (19%)
            <span
              className="material-symbols-outlined text-[14px]"
              title="Impuesto al valor agregado recalculado automáticamente por el backend"
            >
              info
            </span>
          </span>
          <span className="font-data-mono text-data-mono text-on-surface">
            Incluido ({formatCurrency(ivaAmount)})
          </span>
        </div>

        <div className="flex justify-between items-center text-body-sm font-body-sm text-on-surface-variant">
          <span>Costo de envío original</span>
          <span className="font-data-mono text-data-mono text-on-surface">
            {formatCurrency(shippingCost)} (No reembolsable)
          </span>
        </div>

        <div className="pt-space-3 mt-space-1 bg-surface-container-low rounded-lg p-space-3 flex items-baseline justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
              Total a Reembolsar
            </span>
            <span className="font-body-xs text-body-xs text-on-surface-variant">
              Sincronizado con pasarela
            </span>
          </div>
          <div className="text-right">
            <span className="font-display-sm text-display-sm text-primary font-bold tracking-tight">
              {formatCurrency(totalRefund)}
            </span>
            <span className="block font-data-mono text-body-xs text-on-surface-variant">
              {currency}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
