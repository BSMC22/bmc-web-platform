import type { CountryId, IanaTimezone, PortId } from "../common";

export type PortStatus = "active" | "inactive";

/** See docs/domain/entity-catalog.md > Business Data > Port. Global catalog, no companyId. */
export interface Port {
  id: PortId;
  name: string;
  countryId: CountryId;
  unlocode?: string; // unique when present
  status: PortStatus;
  timezone?: IanaTimezone;
  latitude?: number;
  longitude?: number;
}
