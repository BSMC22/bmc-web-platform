import type { CountryId } from "../common";

/** See docs/domain/entity-catalog.md > Business Data > Country. Global catalog, no companyId. */
export interface Country {
  id: CountryId;
  isoCode2: string; // ISO 3166-1 alpha-2
  isoCode3: string; // ISO 3166-1 alpha-3
  name: string;
  region?: string;
}
