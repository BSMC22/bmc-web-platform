import type { QuotationId, QuotationItemId, ServiceTypeId } from "../common";
import type { Money } from "../common";

/** See docs/domain/entity-catalog.md > Commercial > QuotationItem. */
export interface QuotationItem {
  id: QuotationItemId;
  quotationId: QuotationId;
  description: string;
  serviceTypeId?: ServiceTypeId;
  quantity: number;
  unitPrice: Money;
  /** Derived: quantity * unitPrice. Never stored inconsistently with its factors. */
  lineTotal: Money;
  notes?: string;
  sortOrder?: number;
}

export interface CreateQuotationItemInput {
  quotationId: QuotationId;
  description: string;
  serviceTypeId?: ServiceTypeId;
  quantity: number;
  unitPrice: Money;
  sortOrder?: number;
}
