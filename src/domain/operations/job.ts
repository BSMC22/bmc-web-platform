import type { ClientId, CompanyId, IsoDate, IsoTimestamp, JobId, PortId, QuotationId, ServiceTypeId, VesselId } from "../common";
import type { BillingStatus, OperationalStatus, ReportStatus } from "./job-status";

/**
 * The central entity of Blueseas OS - see docs/domain/domain-overview.md.
 * Represents the full commercial + operational commitment; a Job can have
 * one or several Inspection children (see the formal Job vs. Inspection
 * decision in domain-overview.md, Option 3).
 *
 * NOTE (conflict with existing code): the current `inspections` table in
 * src/lib/supabase/types.ts conceptually maps to THIS entity, not to the
 * new `Inspection` entity below - see the Fase 2 final report for the
 * full conflict analysis. This file does not replace or import from
 * src/lib/supabase/types.ts.
 */
export interface Job {
  id: JobId;
  companyId: CompanyId;
  jobCode: string;
  clientId: ClientId;
  serviceTypeId: ServiceTypeId;
  operationalStatus: OperationalStatus;
  reportStatus: ReportStatus;
  billingStatus: BillingStatus;
  createdAt: IsoTimestamp;
  quotationId?: QuotationId;
  primaryVesselId?: VesselId;
  primaryPortId?: PortId;
  scheduledDate?: IsoDate;
  notes?: string;
  isArchived: boolean;
  archivedAt?: IsoTimestamp;
}

/** Manual creation input - a Job is more commonly generated from an accepted Quotation. */
export interface CreateJobInput {
  companyId: CompanyId;
  clientId: ClientId;
  serviceTypeId: ServiceTypeId;
  quotationId?: QuotationId;
  primaryVesselId?: VesselId;
  primaryPortId?: PortId;
  scheduledDate?: IsoDate;
  notes?: string;
}

export interface UpdateJobInput {
  primaryVesselId?: VesselId;
  primaryPortId?: PortId;
  scheduledDate?: IsoDate;
  notes?: string;
  // Status fields intentionally excluded - transitions go through
  // dedicated operations, not a generic field update (see
  // docs/domain/lifecycle-and-statuses.md, "Requisitos de autorización").
}
