import type { ClientId, CountryId, VesselId } from "../common";

export type VesselStatus = "active" | "inactive";

/** See docs/domain/entity-catalog.md > Business Data > Vessel. */
export interface Vessel {
  id: VesselId;
  name: string;
  imoNumber?: string; // unique when present - not all smaller vessels have one
  vesselType: string;
  status: VesselStatus;
  flagCountryId?: CountryId;
  yearBuilt?: number;
  grossTonnage?: number;
  ownerClientId?: ClientId;
}

export interface CreateVesselInput {
  name: string;
  imoNumber?: string;
  vesselType: string;
  flagCountryId?: CountryId;
  yearBuilt?: number;
  grossTonnage?: number;
  ownerClientId?: ClientId;
}
