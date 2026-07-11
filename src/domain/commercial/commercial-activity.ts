import type { CommercialActivityId, IsoTimestamp, UserId } from "../common";
import type { PolymorphicRef } from "../common";

export type CommercialActivityRelatedType = "lead" | "opportunity";
export type CommercialActivityType = "call" | "email" | "meeting" | "note";

/** See docs/domain/entity-catalog.md > Commercial > CommercialActivity. */
export interface CommercialActivity extends PolymorphicRef<CommercialActivityRelatedType> {
  id: CommercialActivityId;
  type: CommercialActivityType;
  occurredAt: IsoTimestamp;
  createdBy: UserId;
  summary?: string;
  outcome?: string;
  nextFollowUpAt?: IsoTimestamp;
}

export interface LogCommercialActivityInput {
  relatedType: CommercialActivityRelatedType;
  relatedId: string;
  type: CommercialActivityType;
  occurredAt: IsoTimestamp;
  summary?: string;
  outcome?: string;
  nextFollowUpAt?: IsoTimestamp;
}
