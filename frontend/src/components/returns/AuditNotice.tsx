import React from 'react';

interface AuditNoticeProps {
  cashierId: string;
}

export const AuditNotice: React.FC<AuditNoticeProps> = ({ cashierId }) => {
  return (
    <div className="p-space-3 rounded-lg bg-surface-container-low text-on-surface-variant flex items-start gap-space-2 text-body-xs font-body-xs">
      <span className="material-symbols-outlined text-[16px] text-primary flex-shrink-0 mt-0.5">
        verified
      </span>
      <p className="leading-tight">
        Esta transacción quedará registrada bajo la firma digital del cajero ID{' '}
        <strong className="font-data-mono text-on-surface">{cashierId}</strong> con reversión
        contable automática en ERP SAP y emisión de Nota de Crédito Electrónica SII.
      </p>
    </div>
  );
};
