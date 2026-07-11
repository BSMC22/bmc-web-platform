import type { IsoTimestamp, JobId, JobStatusHistoryId, UserId } from "../common";
import type { JobStatusDimension } from "./job-status";

/**
 * Append-only, immutable history of every Job status transition across
 * its 3 dimensions - see docs/domain/lifecycle-and-statuses.md. Never
 * edited or deleted, generated automatically by the system on every
 * transition (business-rules.md #12).
 */
export interface JobStatusHistoryEntry {
  id: JobStatusHistoryId;
  jobId: JobId;
  statusDimension: JobStatusDimension;
  fromStatus: string;
  toStatus: string;
  changedAt: IsoTimestamp;
  changedBy: UserId;
  reason?: string;
}
