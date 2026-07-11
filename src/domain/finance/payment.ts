import type { CompanyId, InvoiceId, IsoTimestamp, PaymentId } from "../common";
import type { Money } from "../common";

export type PaymentStatus = "pending" | "processing" | "paid" | "failed" | "refunded";

/**
 * See docs/domain/entity-catalog.md > Finance > Payment. Relates to an
 * Invoice, never modifies `Invoice.totalAmount` (business-rules.md #21).
 * An Invoice can have several Payments (partial payments).
 */
export interface Payment {
  id: PaymentId;
  companyId: CompanyId;
  invoiceId: InvoiceId;
  amount: Money;
  paidAt: IsoTimestamp;
  status: PaymentStatus;
  bankReference?: string;
  paymentMethod?: string;
  notes?: string;
}

export interface RecordPaymentInput {
  companyId: CompanyId;
  invoiceId: InvoiceId;
  amount: Money;
  paidAt: IsoTimestamp;
  bankReference?: string;
  paymentMethod?: string;
  notes?: string;
}
