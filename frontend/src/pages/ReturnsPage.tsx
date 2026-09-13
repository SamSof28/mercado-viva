import React, { useEffect } from 'react';
import { useSession } from '../context/SessionContext';
import { useReturnOrder } from '../hooks/useReturnOrder';
import { ScannerInput } from '../components/returns/ScannerInput';
import { OrderValidationBanner } from '../components/returns/OrderValidationBanner';
import { ReturnItemsTable } from '../components/returns/ReturnItemsTable';
import { FinancialSummary } from '../components/returns/FinancialSummary';
import { RefundMethodSelector } from '../components/returns/RefundMethodSelector';
import { ReturnReasonForm } from '../components/returns/ReturnReasonForm';
import { ActionButtons } from '../components/returns/ActionButtons';
import { AuditNotice } from '../components/returns/AuditNotice';

export const ReturnsPage: React.FC = () => {
  const { session } = useSession();
  const {
    returnOrder,
    financials,
    refundMethod,
    globalReason,
    cashierNotes,
    isLoading,
    isCalculating,
    isProcessing,
    error,
    validateCode,
    toggleItem,
    toggleAll,
    updateQuantity,
    updateItemReason,
    setRefundMethod,
    setGlobalReason,
    setCashierNotes,
    processRefund,
    rejectReturn,
    resetOrder,
  } = useReturnOrder();

  // Carga inicial del pedido de ejemplo DEV-8492 para mantener fidelidad visual con el prototipo
  useEffect(() => {
    validateCode('DEV-8492');
  }, [validateCode]);

  const handleApprove = async () => {
    const res = await processRefund();
    if (res && res.message) {
      alert(res.message);
    }
  };

  const handleReject = async () => {
    if (confirm('¿Está seguro de que desea rechazar esta solicitud de devolución?')) {
      const ok = await rejectReturn();
      if (ok) {
        alert('Solicitud de devolución rechazada correctamente.');
        resetOrder();
      }
    }
  };

  return (
    <>
      {/* Operational Sub-Header & Live Metadata */}
      <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-space-4 pb-space-6">
        <div className="flex flex-col gap-space-1">
          <div className="flex items-center gap-space-3">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-container/20 text-primary">
              <span className="material-symbols-outlined text-[20px]">assignment_return</span>
            </span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              Devoluciones Omnicanal (Web-to-Store)
            </h1>
            <span className="px-space-2 py-0.5 rounded text-label-sm font-label-sm bg-primary/10 text-primary font-semibold">
              Live POS {session.posVersion}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-space-2 text-on-surface-variant font-body-sm text-body-sm">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              {session.shift}
            </span>
            <span className="text-outline-variant">•</span>
            <span>
              {session.register} — {session.storeName}
            </span>
            <span className="text-outline-variant">•</span>
            <span className="font-label-md text-label-md text-on-surface">
              Cajero: {session.cashier.name} ({session.cashier.id})
            </span>
          </div>
        </div>
      </div>

      {/* Primary Barcode / QR Scanner Input Banner */}
      <div className="w-full bg-surface-container-lowest rounded-xl p-space-5 shadow-sm flex flex-col gap-space-4">
        <ScannerInput onValidate={validateCode} isLoading={isLoading} />

        {error && (
          <div className="px-space-4 py-space-2 rounded-lg bg-error-container text-on-error-container text-body-sm">
            {error}
          </div>
        )}

        {returnOrder && <OrderValidationBanner order={returnOrder} />}
      </div>

      {/* Main Work Area: 2-Column POS Layout */}
      {returnOrder && (
        <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-space-6 mt-space-6 items-start">
          {/* Left Column: Verification Data Table (8 Cols) */}
          <div className="xl:col-span-8 flex flex-col gap-space-4">
            <ReturnItemsTable
              items={returnOrder.items}
              selectedCount={financials?.selectedCount ?? 0}
              onToggleItem={toggleItem}
              onToggleAll={toggleAll}
              onUpdateQuantity={updateQuantity}
              onUpdateReason={updateItemReason}
            />
          </div>

          {/* Right Column: Financial Settlement & Refund Authorization (4 Cols) */}
          <div className="xl:col-span-4 flex flex-col gap-space-4">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-5 flex flex-col gap-space-5">
              <FinancialSummary financials={financials} isCalculating={isCalculating} />

              <RefundMethodSelector
                selectedMethod={refundMethod}
                onSelectMethod={setRefundMethod}
                originalPayment={returnOrder.originalPayment}
              />

              <ReturnReasonForm
                globalReason={globalReason}
                onGlobalReasonChange={setGlobalReason}
                cashierNotes={cashierNotes}
                onCashierNotesChange={setCashierNotes}
              />

              <ActionButtons
                totalRefund={financials?.totalRefund ?? 0}
                isDisabled={!financials || financials.selectedCount === 0}
                isProcessing={isProcessing}
                onApprove={handleApprove}
                onReject={handleReject}
              />

              <AuditNotice cashierId={session.cashier.id} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
