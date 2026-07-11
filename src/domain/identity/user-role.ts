import type { CompanyMembershipId, IsoTimestamp, RoleId, UserId, UserRoleId } from "../common";

export type UserRoleStatus = "active" | "revoked";

/**
 * Assigns a Role to a User within a specific Company (via
 * CompanyMembership). A User can hold multiple active UserRole rows at
 * once (e.g. admin + finance) - see docs/domain/entity-catalog.md >
 * Identity & Access > UserRole. This is the piece that replaces the
 * single, rigid `ProfileRole` enum in src/lib/supabase/types.ts.
 */
export interface UserRole {
  id: UserRoleId;
  companyMembershipId: CompanyMembershipId;
  roleId: RoleId;
  status: UserRoleStatus;
  assignedAt: IsoTimestamp;
  assignedBy?: UserId;
  expiresAt?: IsoTimestamp;
}

export interface AssignUserRoleInput {
  companyMembershipId: CompanyMembershipId;
  roleId: RoleId;
  expiresAt?: IsoTimestamp;
}
