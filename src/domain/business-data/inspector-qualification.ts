import type { DocumentId, InspectorId, InspectorQualificationId, IsoDate } from "../common";

export type InspectorQualificationStatus = "valid" | "expired" | "revoked";

/** See docs/domain/entity-catalog.md > Business Data > InspectorQualification. */
export interface InspectorQualification {
  id: InspectorQualificationId;
  inspectorId: InspectorId;
  qualificationName: string;
  issuedDate: IsoDate;
  status: InspectorQualificationStatus;
  expiresDate?: IsoDate;
  issuingBody?: string;
  documentId?: DocumentId;
}

export interface CreateInspectorQualificationInput {
  inspectorId: InspectorId;
  qualificationName: string;
  issuedDate: IsoDate;
  expiresDate?: IsoDate;
  issuingBody?: string;
  documentId?: DocumentId;
}
