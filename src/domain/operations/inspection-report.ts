import type { DocumentId, InspectionId, InspectionReportId, InspectorId, IsoTimestamp, UserId } from "../common";

export type InspectionReportStatus = "pending" | "submitted" | "under_review" | "approved" | "rejected";

/**
 * Relates to an Inspection (not directly to the Job) - each visit
 * produces its own report. See docs/domain/entity-catalog.md > Operations
 * > InspectionReport and the Job vs Inspection decision.
 */
export interface InspectionReport {
  id: InspectionReportId;
  inspectionId: InspectionId;
  submittedByInspectorId: InspectorId;
  status: InspectionReportStatus;
  submittedAt: IsoTimestamp;
  reviewedBy?: UserId;
  reviewedAt?: IsoTimestamp;
  reviewNotes?: string;
  documentId?: DocumentId; // current version's Document
}

export interface SubmitInspectionReportInput {
  inspectionId: InspectionId;
  submittedByInspectorId: InspectorId;
  documentId: DocumentId;
}

export interface ReviewInspectionReportInput {
  reviewedBy: UserId;
  approve: boolean;
  reviewNotes?: string;
}
