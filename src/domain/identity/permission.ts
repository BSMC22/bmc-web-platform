import type { PermissionId } from "../common";

/** See docs/domain/entity-catalog.md > Identity & Access > Permission. */
export interface Permission {
  id: PermissionId;
  /** Pattern: "{context}.{entity}.{action}", e.g. "finance.invoice.approve". */
  key: string;
  context: string;
  action: string;
  description?: string;
}
