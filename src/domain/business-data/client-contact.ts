import type { ClientContactId, ClientId, UserId } from "../common";

export type ClientContactStatus = "active" | "inactive";

/** See docs/domain/entity-catalog.md > Business Data > ClientContact. */
export interface ClientContact {
  id: ClientContactId;
  clientId: ClientId;
  fullName: string;
  email: string;
  isPrimary: boolean;
  status: ClientContactStatus;
  phone?: string;
  title?: string;
  /** Optional, unidirectional link to a Client Portal User - see domain-overview.md. */
  userId?: UserId;
}

export interface CreateClientContactInput {
  clientId: ClientId;
  fullName: string;
  email: string;
  isPrimary?: boolean;
  phone?: string;
  title?: string;
}
