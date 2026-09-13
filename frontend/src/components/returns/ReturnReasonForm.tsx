import React from 'react';
import { globalReasons } from '../../config/returnReasons';

interface ReturnReasonFormProps {
  globalReason: string;
  onGlobalReasonChange: (reason: string) => void;
  cashierNotes: string;
  onCashierNotesChange: (notes: string) => void;
}

export const ReturnReasonForm: React.FC<ReturnReasonFormProps> = ({
  globalReason,
  onGlobalReasonChange,
  cashierNotes,
  onCashierNotesChange,
}) => {
  return (
    <div className="flex flex-col gap-space-3 pt-space-2">
      <div className="flex flex-col gap-1">
        <label
          className="font-label-md text-label-md text-on-surface flex items-center justify-between"
          htmlFor="globalReason"
        >
          <span>Motivo General de Devolución</span>
          <span className="text-label-sm font-label-sm text-error font-medium">*Requerido</span>
        </label>
        <select
          id="globalReason"
          className="w-full h-10 px-space-3 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-high cursor-pointer"
          value={globalReason}
          onChange={(e) => onGlobalReasonChange(e.target.value)}
        >
          {globalReasons.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-label-md text-label-md text-on-surface" htmlFor="cashierNotes">
          Notas Internas del Cajero
        </label>
        <textarea
          id="cashierNotes"
          className="w-full p-space-3 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm placeholder-on-surface-variant/60 focus:outline-none focus:bg-surface-container-high transition-colors resize-none"
          placeholder="Observaciones del estado de envases y sellos de seguridad..."
          rows={2}
          value={cashierNotes}
          onChange={(e) => onCashierNotesChange(e.target.value)}
        />
      </div>
    </div>
  );
};
