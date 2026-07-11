import type { ClientId, CompanyId, IsoDate, IsoTimestamp, LeadId, OpportunityId, UserId } from "../common";
import type { Money } from "../common";

export type OpportunityStatus =
  | "open"
  | "qualification"
  | "proposal_requested"
  | "quotation_prepared"
  | "negotiation"
  | "won"
  | "lost"
  | "cancelled";

/** See docs/domain/entity-catalog.md > Commercial > Opportunity. */
export interface Opportunity {
  id: OpportunityId;
  companyId: CompanyId;
  clientId: ClientId;
  title: string;
  status: OpportunityStatus;
  estimatedValue: Money;
  createdAt: IsoTimestamp;
  leadId?: LeadId;
  expectedCloseDate?: IsoDate;
  probability?: number; // 0-100
  lostReason?: string;
  assignedToUserId?: UserId;
}

export interface CreateOpportunityInput {
  companyId: CompanyId;
  clientId: ClientId;
  title: string;
  estimatedValue: Money;
  leadId?: LeadId;
  expectedCloseDate?: IsoDate;
  assignedToUserId?: UserId;
}

export interface UpdateOpportunityInput {
  title?: string;
  estimatedValue?: Money;
  expectedCloseDate?: IsoDate;
  probability?: number;
  assignedToUserId?: UserId;
}
