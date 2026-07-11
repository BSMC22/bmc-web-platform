import type { ServiceTypeId } from "../common";

export type ServiceTypeCategory = "inspection" | "audit" | "consulting" | "survey" | "other";

/**
 * See docs/domain/entity-catalog.md > Business Data > ServiceType. Global
 * catalog today; a per-company override may be needed later (see
 * domain-overview.md multi-company table) - not implemented in this phase.
 */
export interface ServiceType {
  id: ServiceTypeId;
  name: string;
  category: ServiceTypeCategory;
  isActive: boolean;
  description?: string;
  defaultDurationHours?: number;
}
