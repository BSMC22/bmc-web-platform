import type { IsoTimestamp, NotificationId, UserId } from "../common";
import type { PolymorphicRef } from "../common";

export type NotificationStatus = "unread" | "read";

/**
 * See docs/domain/entity-catalog.md > Communications > Notification.
 * `EmailRecord` (proof that a real email was sent) is deliberately left
 * as a future concept, not typed here - no email integration exists yet.
 */
export interface Notification {
  id: NotificationId;
  userId: UserId;
  type: string;
  title: string;
  isRead: boolean;
  status: NotificationStatus;
  createdAt: IsoTimestamp;
  readAt?: IsoTimestamp;
  origin?: PolymorphicRef<string>;
}
