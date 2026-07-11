import type { InspectorId, IsoTimestamp, JobAssignmentId, JobId, UserId } from "../common";
import type { Money } from "../common";

export type JobAssignmentRole = "lead" | "support";
export type JobAssignmentStatus = "proposed" | "confirmed" | "declined" | "removed";

/**
 * Team assigned to a Job as a whole (not to a single Inspection visit) -
 * see the Job vs Inspection decision in domain-overview.md.
 * `Inspection.performedByInspectorIds` records who actually executed a
 * given visit, normally a subset of the JobAssignment team.
 */
export interface JobAssignment {
  id: JobAssignmentId;
  jobId: JobId;
  inspectorId: InspectorId;
  roleInJob: JobAssignmentRole;
  status: JobAssignmentStatus;
  assignedAt: IsoTimestamp;
  assignedBy?: UserId;
  feeAgreed?: Money;
  notes?: string;
}

export interface CreateJobAssignmentInput {
  jobId: JobId;
  inspectorId: InspectorId;
  roleInJob: JobAssignmentRole;
  feeAgreed?: Money;
  notes?: string;
}
