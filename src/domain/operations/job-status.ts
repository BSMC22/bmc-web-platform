/**
 * The Job's 3 stored status dimensions - see
 * docs/domain/lifecycle-and-statuses.md for the full transition rules and
 * why there is deliberately NO `paymentStatus` field (it's fully derived
 * from Invoice/Payment, folded into `billingStatus`).
 */

export type OperationalStatus =
  | "draft"
  | "confirmed"
  | "scheduled"
  | "in_progress"
  | "on_hold"
  | "completed"
  | "cancelled";

export type ReportStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected";

export type BillingStatus =
  | "not_ready"
  | "ready_to_invoice"
  | "invoiced"
  | "partially_paid"
  | "paid"
  | "overdue"
  | "voided";

export type JobStatusDimension = "operational" | "report" | "billing";
