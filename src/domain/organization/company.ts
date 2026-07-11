import type { CompanyId } from "../common";
import type { CurrencyCode } from "../common";

export type CompanyStatus = "active" | "inactive";

/** See docs/domain/entity-catalog.md > Organization > Company. */
export interface Company {
  id: CompanyId;
  legalName: string;
  /** Unique, immutable - used in visible codes (see docs/domain/identifiers.md). */
  shortCode: string;
  defaultCurrency: CurrencyCode;
  isActive: boolean;
  status: CompanyStatus;
  taxId?: string;
  address?: string;
  logoUrl?: string;
  timezone?: string;
}

export interface CreateCompanyInput {
  legalName: string;
  shortCode: string;
  defaultCurrency: CurrencyCode;
  taxId?: string;
  address?: string;
}

export interface UpdateCompanyInput {
  legalName?: string;
  address?: string;
  logoUrl?: string;
  timezone?: string;
  // shortCode intentionally excluded - immutable once issued.
}
