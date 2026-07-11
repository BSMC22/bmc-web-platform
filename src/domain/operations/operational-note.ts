import type { IsoTimestamp, JobId, OperationalNoteId, UserId } from "../common";

export type OperationalNoteVisibility = "internal" | "client_visible";

/** See docs/domain/entity-catalog.md > Operations > OperationalNote. */
export interface OperationalNote {
  id: OperationalNoteId;
  jobId: JobId;
  authorId: UserId;
  text: string;
  createdAt: IsoTimestamp;
  visibility?: OperationalNoteVisibility;
}

export interface CreateOperationalNoteInput {
  jobId: JobId;
  text: string;
  visibility?: OperationalNoteVisibility;
}
