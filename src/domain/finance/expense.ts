import type { CompanyId, DocumentId, ExpenseId, InspectorId, IsoDate, JobId } from "../common";
import type { Money } from "../common";

export type ExpenseCategory = "internal" | "reimbursable" | "non_reimbursable";
export type ExpenseStatus = "submitted" | "approved" | "rejected" | "reimbursed";

/**
 * See docs/domain/entity-catalog.md > Finance > Expense.
 * `expenseCategory` determines whether the cost can be passed through to
 * the client's Invoice (`reimbursable`) or stays internal - see
 * docs/domain/financial-model.md.
 */
export interface Expense {
  id: ExpenseId;
  companyId: CompanyId;
  jobId: JobId;
  inspectorId: InspectorId;
  description: string;
  amount: Money;
  expenseCategory: ExpenseCategory;
  status: ExpenseStatus;
  incurredOn?: IsoDate;
  documentId?: DocumentId; // receipt/support
  notes?: string;
}

export interface SubmitExpenseInput {
  companyId: CompanyId;
  jobId: JobId;
  inspectorId: InspectorId;
  description: string;
  amount: Money;
  expenseCategory: ExpenseCategory;
  incurredOn?: IsoDate;
  documentId?: DocumentId;
  notes?: string;
}
