import type { DocumentCategoryId } from "../common";
import type { DocumentVisibility } from "./document";

/** See docs/domain/entity-catalog.md > Documents > DocumentCategory and docs/domain/document-model.md. */
export type DocumentCategoryKey =
  | "quotation"
  | "purchase_order"
  | "appointment"
  | "inspection_report"
  | "report_attachment"
  | "photograph"
  | "invoice"
  | "inspector_invoice"
  | "receipt"
  | "expense_support"
  | "certificate"
  | "qualification"
  | "passport"
  | "visa"
  | "bank_document"
  | "client_document"
  | "internal_document"
  | "other";

export interface DocumentCategory {
  id: DocumentCategoryId;
  key: DocumentCategoryKey;
  label: string;
  defaultVisibility: DocumentVisibility;
  requiresApproval: boolean;
}
