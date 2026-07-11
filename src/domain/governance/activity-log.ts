import type { ActivityLogId, IsoTimestamp, UserId } from "../common";
import type { PolymorphicRef } from "../common";

/**
 * Human-readable, business-facing event history - see
 * docs/domain/audit-and-activity.md for the full distinction from
 * AuditLog. Visible to any role with access to the related entity;
 * append-only but not treated as a hard compliance record.
 */
export interface ActivityLogEntry extends PolymorphicRef<string> {
  id: ActivityLogId;
  action: string;
  actorId: UserId;
  occurredAt: IsoTimestamp;
  summary?: string;
  metadata?: Record<string, string | number | boolean>;
}
