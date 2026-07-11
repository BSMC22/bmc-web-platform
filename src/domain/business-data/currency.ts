import type { CurrencyCode } from "../common";

export type CurrencyStatus = "active" | "inactive";

/**
 * ISO 4217 catalog entry. See docs/domain/entity-catalog.md > Business
 * Data > Currency and docs/domain/financial-model.md for why `minorUnits`
 * matters (CLP has 0, most others have 2).
 */
export interface Currency {
  code: CurrencyCode;
  name: string;
  minorUnits: number;
  status: CurrencyStatus;
  symbol?: string;
}
