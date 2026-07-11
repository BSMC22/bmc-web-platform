import type { InspectorAvailabilityId, InspectorId, IsoDate } from "../common";

export type InspectorAvailabilityStatus = "available" | "unavailable";

/**
 * See docs/domain/entity-catalog.md > Business Data > InspectorAvailability.
 * This is the one domain entity with a direct 1:1 equivalent already in
 * production today (`Availability` in src/lib/supabase/types.ts) - no
 * conceptual conflict, just a rename/reshape for Fase 3.
 */
export interface InspectorAvailability {
  id: InspectorAvailabilityId;
  inspectorId: InspectorId;
  startDate: IsoDate;
  endDate: IsoDate;
  status: InspectorAvailabilityStatus;
  notes?: string;
}

export interface CreateInspectorAvailabilityInput {
  inspectorId: InspectorId;
  startDate: IsoDate;
  endDate: IsoDate;
  status: InspectorAvailabilityStatus;
  notes?: string;
}
