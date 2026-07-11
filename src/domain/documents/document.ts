import type { CompanyId, DocumentCategoryId, DocumentId, DocumentVersionId, IsoTimestamp, UserId } from "../common";
import type { PolymorphicRef } from "../common";

export type DocumentVisibility = "internal" | "inspector" | "client" | "shareholder";
export type DocumentSensitivity = "normal" | "sensitive";
export type DocumentStatus = "active" | "superseded" | "deleted";

export type DocumentRelatedType =
  | "job"
  | "inspection"
  | "inspector"
  | "client"
  | "quotation"
  | "invoice"
  | "expense"
  | "inspectorQualification";

/**
 * Reusable document metadata model - see docs/domain/document-model.md.
 * Represents metadata about a file (name, category, visibility, approval),
 * not the binary itself (that lives in storage; see DocumentVersion).
 * Relates to its owning entity/entities via a polymorphic `DocumentLink`
 * (see documents/document-link.ts), not a single fixed foreign key.
 */
export interface Document {
  id: DocumentId;
  companyId: CompanyId;
  categoryId: DocumentCategoryId;
  fileName: string;
  visibility: DocumentVisibility;
  currentVersionId: DocumentVersionId;
  status: DocumentStatus;
  uploadedBy: UserId;
  uploadedAt: IsoTimestamp;
  expiresAt?: IsoTimestamp;
  sensitivityLevel?: DocumentSensitivity;
  approvedBy?: UserId;
  approvedAt?: IsoTimestamp;
}

/** One row per (Document, related entity) pair - see document-model.md. */
export type DocumentLink = PolymorphicRef<DocumentRelatedType> & {
  documentId: DocumentId;
};

export interface UploadDocumentInput {
  companyId: CompanyId;
  categoryId: DocumentCategoryId;
  fileName: string;
  visibility: DocumentVisibility;
  sensitivityLevel?: DocumentSensitivity;
  links: Array<{ relatedType: DocumentRelatedType; relatedId: string }>;
}
