/**
 * Money value object - see docs/domain/financial-model.md for the full
 * rationale. Never represent money as a plain `number` in this domain:
 * floating point arithmetic is unsafe for currency math, and different
 * currencies have different numbers of decimal places (CLP has 0, most
 * others have 2), so a single "amount as a float" field silently corrupts
 * CLP values if treated the same as USD.
 */

/** ISO 4217 currency code. Extend as new currencies are catalogued. */
export type CurrencyCode = "USD" | "EUR" | "GBP" | "CLP";

/**
 * `amountMinor` is always an integer, expressed in the currency's minor
 * unit (cents for USD/EUR/GBP, whole units for CLP because it has 0 minor
 * units). Never a decimal. See `Currency.minorUnits` in
 * business-data/currency.ts for the per-currency decimal count.
 */
export interface Money {
  amountMinor: number;
  currency: CurrencyCode;
}

/**
 * Cross-currency amount, used on entities that record a transaction in one
 * currency but need to also express it in the company's reporting
 * currency (see docs/domain/financial-model.md, "Currency / Exchange rate
 * model"). `original` is always the legal source of truth; `converted` is
 * a convenience value that can be recalculated.
 */
export interface ConvertedMoney {
  original: Money;
  converted?: Money;
  fxRate?: number;
  fxRateDate?: string; // IsoDate
  fxRateSource?: string;
}
