import type { CompanyId, CompanyMembershipId, IsoTimestamp, UserId } from "../common";

export type CompanyMembershipStatus = "invited" | "active" | "suspended" | "removed";

/** See docs/domain/entity-catalog.md > Identity & Access > CompanyMembership. */
export interface CompanyMembership {
  id: CompanyMembershipId;
  userId: UserId;
  companyId: CompanyId;
  status: CompanyMembershipStatus;
  joinedAt: IsoTimestamp;
  title?: string;
  invitedBy?: UserId;
}

export interface InviteCompanyMembershipInput {
  userId: UserId;
  companyId: CompanyId;
  title?: string;
}
