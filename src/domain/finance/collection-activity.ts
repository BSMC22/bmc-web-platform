import type { CollectionActivityId, InvoiceId, IsoDate, IsoTimestamp, UserId } from "../common";

export type CollectionActivityType = "reminder_sent" | "call" | "payment_promise" | "escalation";

/**
 * See docs/domain/entity-catalog.md > Finance > CollectionActivity.
 * AccountsReceivableEntry/AccountsPayableEntry are intentionally NOT
 * modeled as entities - AR/AP are derived read models (see
 * docs/domain/financial-model.md).
 */
export interface CollectionActivity {
  id: CollectionActivityId;
  invoiceId: InvoiceId;
  type: CollectionActivityType;
  occurredAt: IsoTimestamp;
  createdBy: UserId;
  notes?: string;
  promisedPaymentDate?: IsoDate;
}

export interface LogCollectionActivityInput {
  invoiceId: InvoiceId;
  type: CollectionActivityType;
  occurredAt: IsoTimestamp;
  notes?: string;
  promisedPaymentDate?: IsoDate;
}
