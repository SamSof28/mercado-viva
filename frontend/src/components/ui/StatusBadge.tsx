import React from 'react';
import type { PhysicalStatus } from '../../types';

interface StatusBadgeProps {
  status: PhysicalStatus | null;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  if (!status) return null;

  switch (status) {
    case 'damage':
      return (
        <span className="inline-flex items-center gap-1 px-space-2 py-0.5 rounded text-label-sm font-label-sm bg-error-container text-on-error-container font-semibold">
          <span className="material-symbols-outlined text-[14px]">delete</span>
          Merma
        </span>
      );
    case 'restock':
      return (
        <span className="inline-flex items-center gap-1 px-space-2 py-0.5 rounded text-label-sm font-label-sm bg-secondary-container/50 text-on-secondary-container font-semibold">
          <span className="material-symbols-outlined text-[14px]">inventory</span>
          Reintegrable a Stock
        </span>
      );
    case 'not_received':
      return (
        <span className="inline-flex items-center gap-1 px-space-2 py-0.5 rounded text-label-sm font-label-sm bg-surface-container-highest text-on-surface-variant font-medium">
          No Recibido
        </span>
      );
    default:
      return null;
  }
};
