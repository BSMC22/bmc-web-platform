import type { ClientId, CompanyId, IsoTimestamp, LeadId } from "../common";
import type { Money } from "../common";

export type LeadStatus = "new" | "contacted" | "qualified" | "disqualified" | "converted";

/** See docs/domain/entity-catalog.md > Commercial > Lead. */
export interface Lead {
  id: LeadId;
  companyId: CompanyId;
  name: string;
  source: string;
  status: LeadStatus;
  createdAt: IsoTimestamp;
  clientId?: ClientId;
  estimatedValue?: Money;
  notes?: string;
}

export interface CreateLeadInput {
  companyId: CompanyId;
  name: string;
  source: string;
  clientId?: ClientId;
  estimatedValue?: Money;
  notes?: string;
}

export interface UpdateLeadInput {
  name?: string;
  estimatedValue?: Money;
  notes?: string;
}
