import type { AuditLogId, IsoTimestamp, UserId } from "../common";

/**
 * Technical, immutable record of critical actions - see
 * docs/domain/audit-and-activity.md. Visible only to super_admin; never
 * edited or deleted by anyone, under any role, via the application.
 */
export interface AuditLogEntry {
  id: AuditLogId;
  entityType: string;
  entityId: string;
  action: string;
  actorId: UserId;
  occurredAt: IsoTimestamp;
  previousValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
}
