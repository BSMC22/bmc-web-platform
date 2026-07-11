import type { InspectionId, InspectorId, IsoDate, IsoTimestamp, JobId, PortId, VesselId } from "../common";

export type InspectionType = "main" | "attendance" | "reinspection" | "follow_up";
export type InspectionStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

/**
 * A single, discrete execution within a Job - see the Job vs Inspection
 * decision in domain-overview.md (Option 3: a Job has one or several
 * Inspections). The common case is exactly one Inspection per Job.
 */
export interface Inspection {
  id: InspectionId;
  jobId: JobId;
  inspectionType: InspectionType;
  scheduledDate: IsoDate;
  status: InspectionStatus;
  /** Defaults to the Job's primary vessel/port when not set. */
  vesselId?: VesselId;
  portId?: PortId;
  performedByInspectorIds?: InspectorId[];
  completedAt?: IsoTimestamp;
  findingsSummary?: string;
}

export interface CreateInspectionInput {
  jobId: JobId;
  inspectionType: InspectionType;
  scheduledDate: IsoDate;
  vesselId?: VesselId;
  portId?: PortId;
}

export interface UpdateInspectionInput {
  scheduledDate?: IsoDate;
  performedByInspectorIds?: InspectorId[];
  completedAt?: IsoTimestamp;
  findingsSummary?: string;
}
