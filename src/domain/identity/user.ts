import type { IsoTimestamp, UserId } from "../common";

/** See docs/domain/entity-catalog.md > Identity & Access > User. */
export type UserStatus = "active" | "invited" | "disabled";

export interface User {
  id: UserId;
  email: string;
  fullName: string;
  isActive: boolean;
  status: UserStatus;
  createdAt: IsoTimestamp;
  phone?: string;
  avatarUrl?: string;
  lastLoginAt?: IsoTimestamp;
  locale?: string;
}

/**
 * Fields required to invite a new User. Deliberately excludes `id`,
 * `status`, `lastLoginAt` (system/server assigned).
 */
export interface CreateUserInput {
  email: string;
  fullName: string;
  phone?: string;
  locale?: string;
}

/** Partial, user-editable profile fields only - never `status`/`email` here. */
export interface UpdateUserInput {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  locale?: string;
}
