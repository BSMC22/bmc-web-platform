/**
 * Business flows (Fase 1.6 - architecture scaffolding only).
 *
 * Blueseas OS separates commercial, operational and financial concerns into
 * three distinct flows instead of one monolithic pipeline (as documented in
 * Fase 1.5). This file exists purely to give future modules (Commercial,
 * Operations, Finance) a shared vocabulary to build against - it is
 * deliberately NOT wired to any UI, route, or Supabase table yet.
 *
 *   Commercial: Lead -> Opportunity -> Quotation -> Won
 *   Operations: Job -> Assignment -> Inspection -> Report -> Completion
 *   Finance:    Invoice -> Collection -> Payment -> Profitability
 *
 * A "Won" quotation is expected to eventually become a Job (bridging
 * Commercial -> Operations), and a completed Job/Inspection is expected to
 * eventually produce an Invoice (bridging Operations -> Finance) - but none
 * of that wiring exists yet. No logic lives here.
 */

export type CommercialFlowStage = "lead" | "opportunity" | "quotation" | "won";

export const COMMERCIAL_FLOW: { key: CommercialFlowStage; label: string }[] = [
  { key: "lead", label: "Lead" },
  { key: "opportunity", label: "Opportunity" },
  { key: "quotation", label: "Quotation" },
  { key: "won", label: "Won" },
];

export type OperationsFlowStage = "job" | "assignment" | "inspection" | "report" | "completion";

export const OPERATIONS_FLOW: { key: OperationsFlowStage; label: string }[] = [
  { key: "job", label: "Job" },
  { key: "assignment", label: "Assignment" },
  { key: "inspection", label: "Inspection" },
  { key: "report", label: "Report" },
  { key: "completion", label: "Completion" },
];

export type FinanceFlowStage = "invoice" | "collection" | "payment" | "profitability";

export const FINANCE_FLOW: { key: FinanceFlowStage; label: string }[] = [
  { key: "invoice", label: "Invoice" },
  { key: "collection", label: "Collection" },
  { key: "payment", label: "Payment" },
  { key: "profitability", label: "Profitability" },
];
