// === Sesión y Cajero ===
export interface Cashier {
  id: string;
  name: string;
  role: string;
}

export interface StoreSession {
  storeName: string;
  register: string;
  shift: string;
  posVersion: string;
  cashier: Cashier;
}

// === Cliente del pedido ===
export interface OrderCustomer {
  name: string;
  phone: string;
  isVerified: boolean;
  accountType: string;
}

// === Ítems del pedido ===
export type PhysicalStatus = 'damage' | 'restock' | 'not_received';

export interface OrderItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  imageUrl: string;
  unitPrice: number; // Entero en CLP
  quantityOrdered: number;
  quantityToReturn: number;
  physicalStatus: PhysicalStatus | null;
  returnReason: string;
  isSelected: boolean;
}

// === Medio de pago original ===
export interface OriginalPaymentMethod {
  type: string;
  provider: string;
  lastDigits: string;
  gateway: string;
}

// === Pedido de devolución completo ===
export interface ReturnOrder {
  code: string;
  orderId: string;
  customer: OrderCustomer;
  items: OrderItem[];
  dispatchDate: string;
  originalTotal: number;
  originalPayment: OriginalPaymentMethod;
}

// === Desglose financiero (calculado por el backend) ===
export interface FinancialBreakdown {
  selectedCount: number;
  subtotal: number;
  ivaAmount: number;
  totalRefund: number;
  shippingCost: number;
  isShippingRefundable: boolean;
  currency: string;
}

// === Reembolso ===
export type RefundMethod = 'original_card' | 'store_credit' | 'cash';

export interface RefundRequest {
  selectedItemIds: string[];
  refundMethod: RefundMethod;
  globalReason: string;
  cashierNotes: string;
}

export interface RefundResponse {
  success: boolean;
  transactionId: string;
  refundedAmount: number;
  creditNoteNumber: string;
  message: string;
}
