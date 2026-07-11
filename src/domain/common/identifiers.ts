/**
 * Branded ID types for every domain entity.
 *
 * Why branded strings instead of plain `string`: TypeScript structurally
 * types plain strings, so a function expecting a `JobId` would silently
 * accept a `ClientId` (both are just `string`). Branding adds a
 * compile-time-only tag that makes them incompatible with each other, while
 * still being a real `string` at runtime (no wrapper object, no
 * serialization cost).
 *
 * These are the *technical* identifiers (recommended as UUIDv7 in Fase 3 -
 * see docs/domain/identifiers.md). Human-readable visible codes (jobCode,
 * invoiceNumber, quotationNumber, etc.) are plain `string` fields on the
 * entities themselves - they are never used as relation keys, so they don't
 * need branding.
 *
 * Nothing in this file is wired to Supabase or any existing component.
 */

type Brand<T, B extends string> = T & { readonly __brand: B };

// Identity & Access
export type UserId = Brand<string, "UserId">;
export type RoleId = Brand<string, "RoleId">;
export type PermissionId = Brand<string, "PermissionId">;
export type UserRoleId = Brand<string, "UserRoleId">;
export type CompanyMembershipId = Brand<string, "CompanyMembershipId">;

// Organization
export type CompanyId = Brand<string, "CompanyId">;
export type CompanySettingsId = Brand<string, "CompanySettingsId">;

// Commercial
export type LeadId = Brand<string, "LeadId">;
export type OpportunityId = Brand<string, "OpportunityId">;
export type QuotationId = Brand<string, "QuotationId">;
export type QuotationItemId = Brand<string, "QuotationItemId">;
export type CommercialActivityId = Brand<string, "CommercialActivityId">;

// Business Data
export type ClientId = Brand<string, "ClientId">;
export type ClientContactId = Brand<string, "ClientContactId">;
export type VesselId = Brand<string, "VesselId">;
export type InspectorId = Brand<string, "InspectorId">;
export type InspectorQualificationId = Brand<string, "InspectorQualificationId">;
export type InspectorAvailabilityId = Brand<string, "InspectorAvailabilityId">;
export type CountryId = Brand<string, "CountryId">;
export type PortId = Brand<string, "PortId">;
export type ServiceTypeId = Brand<string, "ServiceTypeId">;

// Operations
export type JobId = Brand<string, "JobId">;
export type JobAssignmentId = Brand<string, "JobAssignmentId">;
export type InspectionId = Brand<string, "InspectionId">;
export type InspectionReportId = Brand<string, "InspectionReportId">;
export type JobMilestoneId = Brand<string, "JobMilestoneId">;
export type JobStatusHistoryId = Brand<string, "JobStatusHistoryId">;
export type OperationalNoteId = Brand<string, "OperationalNoteId">;

// Finance
export type InvoiceId = Brand<string, "InvoiceId">;
export type InvoiceItemId = Brand<string, "InvoiceItemId">;
export type ExpenseId = Brand<string, "ExpenseId">;
export type PaymentId = Brand<string, "PaymentId">;
export type CollectionActivityId = Brand<string, "CollectionActivityId">;

// Documents
export type DocumentId = Brand<string, "DocumentId">;
export type DocumentCategoryId = Brand<string, "DocumentCategoryId">;
export type DocumentVersionId = Brand<string, "DocumentVersionId">;

// Communications
export type NotificationId = Brand<string, "NotificationId">;
export type CommentId = Brand<string, "CommentId">;

// Governance
export type ActivityLogId = Brand<string, "ActivityLogId">;
export type AuditLogId = Brand<string, "AuditLogId">;
