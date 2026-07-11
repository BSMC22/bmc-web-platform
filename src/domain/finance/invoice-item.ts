import type { InvoiceId, InvoiceItemId, QuotationItemId, ServiceTypeId } from "../common";
import type { Money } from "../common";

/** See docs/domain/entity-catalog.md > Finance > InvoiceItem. */
export interface InvoiceItem {
  id: InvoiceItemId;
  invoiceId: InvoiceId;
  description: string;
  quantity: number;
  unitPrice: Money;
  /** Derived: quantity * unitPrice. */
  lineTotal: Money;
  sourceQuotationItemId?: QuotationItemId;
  serviceTypeId?: ServiceTypeId;
}

export interface CreateInvoiceItemInput {
  invoiceId: InvoiceId;
  description: string;
  quantity: number;
  unitPrice: Money;
  sourceQuotationItemId?: QuotationItemId;
  serviceTypeId?: ServiceTypeId;
}
