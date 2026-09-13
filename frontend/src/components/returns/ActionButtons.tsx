import React from 'react';
import { formatCurrency } from '../../utils/formatters';

interface ActionButtonsProps {
  totalRefund: number;
  isDisabled: boolean;
  isProcessing: boolean;
  onApprove: () => void;
  onReject: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  totalRefund,
  isDisabled,
  isProcessing,
  onApprove,
  onReject,
}) => {
  return (
    <div className="flex flex-col gap-space-2 pt-space-2">
      <button
        id="approveBtn"
        type="button"
        className={`w-full py-space-3 px-space-6 bg-primary-container hover:opacity-95 text-on-primary-container font-label-lg text-label-lg font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-space-2 active:scale-[0.99] ${
          isDisabled ? 'opacity-50 pointer-events-none' : ''
        }`}
        onClick={onApprove}
        disabled={isDisabled || isProcessing}
      >
        {isProcessing ? (
          <>
            <span className="material-symbols-outlined animate-spin text-[20px]">
              progress_activity
            </span>
            <span>Emitiendo Nota de Crédito SII...</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[20px]">lock</span>
            <span>Aprobar Devolución y Reembolsar {formatCurrency(totalRefund)}</span>
          </>
        )}
      </button>

      <button
        type="button"
        className="w-full py-space-2 px-space-4 bg-surface-container hover:bg-error-container hover:text-on-error-container text-on-surface-variant font-label-md text-label-md rounded-lg transition-colors flex items-center justify-center gap-space-2 disabled:opacity-50"
        onClick={onReject}
        disabled={isProcessing}
      >
        <span className="material-symbols-outlined text-[18px]">cancel</span>
        <span>Rechazar Solicitud</span>
      </button>
    </div>
  );
};
