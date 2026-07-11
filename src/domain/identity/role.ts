import type { RoleId } from "../common";

/**
 * The 8 system roles defined for Blueseas OS (see
 * docs/domain/roles-and-permissions.md). Kept as a closed union in
 * addition to the `Role` catalog entity below, because a lot of
 * application code needs to switch on role *key* without loading the
 * catalog - this mirrors `AppRole` in `src/lib/roles.ts`, which remains
 * the source of truth for the existing (non-domain) redirect logic and is
 * intentionally NOT replaced by this file (see docs/domain conflict
 * notes).
 */
export type SystemRoleKey =
  | "super_admin"
  | "admin"
  | "operations"
  | "commercial"
  | "finance"
  | "shareholder"
  | "inspector"
  | "client";

export type RoleStatus = "active" | "deprecated";

/** See docs/domain/entity-catalog.md > Identity & Access > Role. */
export interface Role {
  id: RoleId;
  key: SystemRoleKey | string; // string allows future custom, non-system roles
  label: string;
  isSystemRole: boolean;
  status: RoleStatus;
  description?: string;
}
