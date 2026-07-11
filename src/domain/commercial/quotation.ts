import type {
  ClientId,
  CompanyId,
  IsoDate,
  IsoTimestamp,
  JobId,
  OpportunityId,
  QuotationId,
} from "../common";
import type { CurrencyCode, Money } from "../common";

export type QuotationStatus =
  | "draft"
  | "under_review"
  | "approved_internally"
  | "sent"
  | "viewed"
  | "accepted"
  | "rejected"
  | "expired"
  | "cancelled"
  | "converted";

/** See docs/domain/entity-catalog.md > Commercial > Quotation. */
export interface Quotation {
  id: QuotationId;
  companyId: CompanyId;
  opportunityId: OpportunityId;
  clientId: ClientId;
  quotationNumber: string;
  revisionNumber: number;
  status: QuotationStatus;
  currency: CurrencyCode;
  totalAmount: Money;
  createdAt: IsoTimestamp;
  validUntil?: IsoDate;
  termsAndConditions?: string;
  sentAt?: IsoTimestamp;
  viewedAt?: IsoTimestamp;
  acceptedAt?: IsoTimestamp;
  rejectedReason?: string;
  /** Set once this Quotation generates a Job (status becomes "converted"). */
  generatedJobId?: JobId;
}

/** Only valid while status is "draft" - see lifecycle-and-statuses.md. */
export interface CreateQuotationInput {
  companyId: CompanyId;
  opportunityId: OpportunityId;
  clientId: ClientId;
  currency: CurrencyCode;
  validUntil?: IsoDate;
  termsAndConditions?: string;
}

export interface UpdateQuotationInput {
  validUntil?: IsoDate;
  termsAndConditions?: string;
  // No status/amount fields here - status transitions and totals are
  // computed/managed by dedicated operations (see business-rules.md #4).
}
