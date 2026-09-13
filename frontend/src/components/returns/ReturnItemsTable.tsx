import React from 'react';
import type { OrderItem } from '../../types';
import { ReturnItemRow } from './ReturnItemRow';

interface ReturnItemsTableProps {
  items: OrderItem[];
  selectedCount: number;
  onToggleItem: (id: string) => void;
  onToggleAll: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onUpdateReason: (id: string, reason: string) => void;
}

export const ReturnItemsTable: React.FC<ReturnItemsTableProps> = ({
  items,
  selectedCount,
  onToggleItem,
  onToggleAll,
  onUpdateQuantity,
  onUpdateReason,
}) => {
  const allSelected = items.length > 0 && items.every((i) => i.isSelected);

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
      {/* Table Header Bar */}
      <div className="px-space-5 py-space-4 bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-2">
        <div className="flex items-center gap-space-3">
          <span className="font-headline-sm text-headline-sm text-on-surface">
            Ítems a Recepcionar en Tienda
          </span>
          <span className="px-space-2 py-0.5 rounded-full text-label-sm font-label-sm bg-surface-container-high text-on-surface font-semibold">
            {items.length} productos en pedido
          </span>
        </div>
        <div className="flex items-center gap-space-2 text-label-sm font-label-sm text-on-surface-variant">
          <span className="inline-block w-2 h-2 rounded-full bg-primary" />
          <span>{selectedCount} ítems seleccionados para reembolso</span>
        </div>
      </div>

      {/* Clean POS Data Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left font-body-sm text-body-sm">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
              <th className="py-space-3 px-space-4 w-10 text-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                  title="Seleccionar Todos"
                  checked={allSelected}
                  onChange={onToggleAll}
                />
              </th>
              <th className="py-space-3 px-space-3 min-w-[220px]">Ítem &amp; SKU</th>
              <th className="py-space-3 px-space-3 text-right">Precio Unit.</th>
              <th className="py-space-3 px-space-3 text-center">Pedida</th>
              <th className="py-space-3 px-space-3 text-center min-w-[100px]">A Devolver</th>
              <th className="py-space-3 px-space-3 min-w-[140px]">Estado Físico</th>
              <th className="py-space-3 px-space-3 min-w-[190px]">Motivo Específico</th>
            </tr>
          </thead>
          <tbody className="text-on-surface">
            {items.map((item) => (
              <ReturnItemRow
                key={item.id}
                item={item}
                onToggle={onToggleItem}
                onUpdateQuantity={onUpdateQuantity}
                onUpdateReason={onUpdateReason}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Micro-footer */}
      <div className="px-space-5 py-space-3 bg-surface-container-low/70 flex flex-col sm:flex-row items-center justify-between gap-space-2 text-body-xs font-body-xs text-on-surface-variant">
        <div className="flex items-center gap-space-2">
          <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
          <span>
            Escaneo de sellos y lotes con código DataMatrix completado sin alertas de expiración.
          </span>
        </div>
        <button
          className="text-primary font-label-sm text-label-sm font-semibold hover:underline"
          type="button"
        >
          + Añadir ítem manual fuera de catálogo
        </button>
      </div>
    </div>
  );
};
