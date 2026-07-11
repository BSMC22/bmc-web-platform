import type { ClientId, CompanyId, IsoDate, InvoiceId, JobId } from "../common";
import type { CurrencyCode, Money } from "../common";

export type InvoiceStatus =
  | "draft"
  | "issued"
  | "sent"
  | "partially_paid"
  | "paid"
  | "overdue"
  | "voided";

/**
 * See docs/domain/entity-catalog.md > Finance > Invoice.
 *
 * NOTE (conflict with existing code): the existing `Invoice` in
 * src/lib/supabase/types.ts is inspector-fee-centric (inspection_id +
 * inspector_id, submitted by an inspector). This new `Invoice` is
 * client-facing (billed to a Client for a Job) - they represent different
 * real-world concepts that happen to share a name. See the Fase 2 final
 * report for the full conflict analysis.
 */
export interface Invoice {
  id: InvoiceId;
  companyId: CompanyId;
  clientId: ClientId;
  invoiceNumber: string;
  status: InvoiceStatus;
  currency: CurrencyCode;
  totalAmount: Money;
  issueDate: IsoDate;
  dueDate: IsoDate;
  /** Normally present; see business-rules.md and entity-catalog.md for the null-jobId exception. */
  jobId?: JobId;
  notes?: string;
  paymentTermsDays?: number;
}

export interface CreateInvoiceInput {
  companyId: CompanyId;
  clientId: ClientId;
  currency: CurrencyCode;
  issueDate: IsoDate;
  dueDate: IsoDate;
  jobId?: JobId;
  notes?: string;
  paymentTermsDays?: number;
}

export interface UpdateInvoiceInput {
  notes?: string;
  dueDate?: IsoDate;
  // totalAmount intentionally excluded once issued - see business-rules.md #19.
}
