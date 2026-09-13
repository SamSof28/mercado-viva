import React from 'react';
import type { OrderItem } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { StatusBadge } from '../ui/StatusBadge';
import { defaultItemReasons } from '../../config/returnReasons';

interface ReturnItemRowProps {
  item: OrderItem;
  onToggle: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onUpdateReason: (id: string, reason: string) => void;
}

export const ReturnItemRow: React.FC<ReturnItemRowProps> = ({
  item,
  onToggle,
  onUpdateQuantity,
  onUpdateReason,
}) => {
  const isNotReceived = item.physicalStatus === 'not_received';
  const rowClasses = !item.isSelected
    ? 'bg-surface-container-low/40 opacity-70 hover:opacity-100 transition-opacity'
    : 'hover:bg-surface-container-low/50 transition-colors bg-surface-container-lowest';

  return (
    <tr className={rowClasses}>
      {/* 1. Checkbox */}
      <td className="py-space-4 px-space-4 text-center align-middle">
        <input
          type="checkbox"
          className="item-checkbox w-4 h-4 rounded text-primary accent-primary cursor-pointer"
          checked={item.isSelected}
          onChange={() => onToggle(item.id)}
        />
      </td>

      {/* 2. Ítem & SKU */}
      <td className="py-space-4 px-space-3 align-middle">
        <div className="flex items-center gap-space-3">
          <div
            className={`w-12 h-12 rounded-lg bg-surface-container-high overflow-hidden flex-shrink-0 ${
              !item.isSelected ? 'grayscale' : ''
            }`}
          >
            <img className="w-full h-full object-cover" src={item.imageUrl} alt={item.name} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-label-md text-label-md text-on-surface truncate font-semibold">
              {item.name}
            </span>
            <div className="flex items-center gap-space-2 text-body-xs font-body-xs text-on-surface-variant">
              <span className="font-data-mono text-data-mono">SKU: {item.sku}</span>
              <span>•</span>
              <span>{item.category}</span>
            </div>
          </div>
        </div>
      </td>

      {/* 3. Precio Unit. */}
      <td className="py-space-4 px-space-3 text-right font-data-mono text-data-mono text-on-surface align-middle whitespace-nowrap">
        {formatCurrency(item.unitPrice)}
        {item.quantityOrdered > 1 && (
          <span className="text-body-xs text-on-surface-variant font-normal block">c/u</span>
        )}
      </td>

      {/* 4. Pedida */}
      <td className="py-space-4 px-space-3 text-center font-data-mono text-data-mono text-on-surface-variant align-middle">
        {item.quantityOrdered}
      </td>

      {/* 5. A Devolver */}
      <td className="py-space-4 px-space-3 text-center align-middle">
        {isNotReceived ? (
          <span className="font-data-mono text-data-mono text-on-surface-variant">0</span>
        ) : item.quantityOrdered > 1 ? (
          <div className="inline-flex items-center rounded-lg bg-surface-container p-0.5">
            <button
              className="w-6 h-6 flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              title="Reducir cantidad"
              type="button"
              onClick={() => onUpdateQuantity(item.id, -1)}
              disabled={item.quantityToReturn <= 1}
            >
              -
            </button>
            <span className="w-6 text-center font-data-mono text-data-mono font-semibold text-on-surface">
              {item.quantityToReturn}
            </span>
            <button
              className="w-6 h-6 flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              title="Aumentar cantidad"
              type="button"
              onClick={() => onUpdateQuantity(item.id, 1)}
              disabled={item.quantityToReturn >= item.quantityOrdered}
            >
              +
            </button>
          </div>
        ) : (
          <div className="inline-flex items-center justify-center bg-surface-container rounded-lg px-2 py-1">
            <span className="font-data-mono text-data-mono font-semibold text-on-surface">
              {item.quantityToReturn}
            </span>
          </div>
        )}
      </td>

      {/* 6. Estado Físico */}
      <td className="py-space-4 px-space-3 align-middle">
        <StatusBadge status={item.physicalStatus} />
      </td>

      {/* 7. Motivo Específico */}
      <td className="py-space-4 px-space-3 align-middle">
        {isNotReceived ? (
          <span className="text-body-xs font-body-xs text-on-surface-variant italic">
            {item.returnReason || 'El cliente no trajo este producto'}
          </span>
        ) : (
          <select
            className="w-full h-9 px-space-2 rounded bg-surface-container text-on-surface font-body-xs text-body-xs focus:outline-none focus:bg-surface-container-low cursor-pointer"
            value={item.returnReason}
            onChange={(e) => onUpdateReason(item.id, e.target.value)}
          >
            {defaultItemReasons.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        )}
      </td>
    </tr>
  );
};
