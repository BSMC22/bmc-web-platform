import type { DocumentId, DocumentVersionId, IsoTimestamp, UserId } from "../common";

/**
 * Immutable version history of a Document - see
 * docs/domain/entity-catalog.md > Documents > DocumentVersion. A prior
 * version is never deleted or overwritten; `Document.currentVersionId`
 * always points at the latest active/approved one.
 */
export interface DocumentVersion {
  id: DocumentVersionId;
  documentId: DocumentId;
  versionNumber: number;
  filePath: string;
  fileSizeBytes: number;
  uploadedBy: UserId;
  uploadedAt: IsoTimestamp;
  checksum?: string;
}
