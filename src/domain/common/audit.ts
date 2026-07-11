/**
 * Shared polymorphic-relation shape, used by every entity that attaches to
 * "whatever entity this is about" instead of a single fixed foreign key -
 * Document, Comment, Notification, ActivityLog, AuditLog. See
 * docs/domain/document-model.md and docs/domain/audit-and-activity.md.
 *
 * `relatedType` is kept as a plain string union per consumer (not a single
 * global enum here) so each context can extend its own set of related
 * types without widening every other context's type.
 */
export interface PolymorphicRef<TRelatedType extends string> {
  relatedType: TRelatedType;
  relatedId: string;
}
