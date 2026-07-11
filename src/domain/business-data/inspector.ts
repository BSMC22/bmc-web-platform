import type { InspectorId, UserId } from "../common";
import type { CurrencyCode } from "../common";

export type InspectorStatus = "active" | "inactive" | "blacklisted";
export type InspectorType = "individual" | "company";

/**
 * See docs/domain/entity-catalog.md > Business Data > Inspector, and
 * docs/domain/domain-overview.md ("no mezclar") - an Inspector is NOT a
 * User. `userId` is an optional, unidirectional link to a User only when
 * this inspector also has Inspector Portal access.
 */
export interface Inspector {
  id: InspectorId;
  fullName: string;
  isActive: boolean;
  status: InspectorStatus;
  inspectorType: InspectorType;
  userId?: UserId;
  email?: string;
  phone?: string;
  baseLocation?: string;
  feeCurrency?: CurrencyCode;
}

export interface CreateInspectorInput {
  fullName: string;
  inspectorType: InspectorType;
  email?: string;
  phone?: string;
  baseLocation?: string;
  feeCurrency?: CurrencyCode;
}

export interface UpdateInspectorInput {
  fullName?: string;
  email?: string;
  phone?: string;
  baseLocation?: string;
  feeCurrency?: CurrencyCode;
}
