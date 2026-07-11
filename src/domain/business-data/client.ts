import type { ClientId, CompanyId, IsoTimestamp } from "../common";
import type { CurrencyCode } from "../common";

export type ClientStatus = "active" | "inactive";

/** See docs/domain/entity-catalog.md > Business Data > Client. */
export interface Client {
  id: ClientId;
  companyId: CompanyId;
  legalName: string;
  isActive: boolean;
  status: ClientStatus;
  createdAt: IsoTimestamp;
  taxId?: string;
  billingAddress?: string;
  defaultCurrency?: CurrencyCode;
  paymentTermsDays?: number;
  industry?: string;
}

export interface CreateClientInput {
  companyId: CompanyId;
  legalName: string;
  taxId?: string;
  billingAddress?: string;
  defaultCurrency?: CurrencyCode;
  paymentTermsDays?: number;
  industry?: string;
}

export interface UpdateClientInput {
  legalName?: string;
  taxId?: string;
  billingAddress?: string;
  defaultCurrency?: CurrencyCode;
  paymentTermsDays?: number;
  industry?: string;
}
