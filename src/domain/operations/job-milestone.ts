import type { IsoDate, JobId, JobMilestoneId } from "../common";

export type JobMilestoneStatus = "pending" | "achieved" | "missed";

/** See docs/domain/entity-catalog.md > Operations > JobMilestone. */
export interface JobMilestone {
  id: JobMilestoneId;
  jobId: JobId;
  milestoneType: string;
  plannedDate: IsoDate;
  status: JobMilestoneStatus;
  actualDate?: IsoDate;
  notes?: string;
}

export interface CreateJobMilestoneInput {
  jobId: JobId;
  milestoneType: string;
  plannedDate: IsoDate;
  notes?: string;
}
