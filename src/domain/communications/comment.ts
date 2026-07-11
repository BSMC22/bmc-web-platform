import type { CommentId, IsoTimestamp, UserId } from "../common";
import type { PolymorphicRef } from "../common";

/**
 * Generic, polymorphic collaboration note - see
 * docs/domain/entity-catalog.md > Communications > Comment. Distinct from
 * OperationalNote (Job-specific, has `visibility`) and CommercialActivity
 * (structured, has `type`/`outcome`) - see open-decisions.md #12 on
 * whether these should ever be unified.
 * `Mention` (@mentioning another user) is left as a future concept.
 */
export type CommentRelatedType = string;

export interface Comment extends PolymorphicRef<CommentRelatedType> {
  id: CommentId;
  authorId: UserId;
  text: string;
  createdAt: IsoTimestamp;
  editedAt?: IsoTimestamp;
}

export interface CreateCommentInput {
  relatedType: CommentRelatedType;
  relatedId: string;
  text: string;
}
