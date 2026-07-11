import type { CompanyId, CompanySettingsId } from "../common";
import type { CurrencyCode } from "../common";

/** See docs/domain/entity-catalog.md > Organization > CompanySettings. */
export interface CompanySettings {
  id: CompanySettingsId;
  companyId: CompanyId; // 1:1 with Company
  jobCodeFormat: string;
  invoiceNumberFormat: string;
  reportingCurrency: CurrencyCode;
  fiscalYearStartMonth?: number; // 1-12
  defaultPaymentTermsDays?: number;
  logoForDocuments?: string;
}

export interface UpdateCompanySettingsInput {
  jobCodeFormat?: string;
  invoiceNumberFormat?: string;
  reportingCurrency?: CurrencyCode;
  fiscalYearStartMonth?: number;
  defaultPaymentTermsDays?: number;
  logoForDocuments?: string;
}
