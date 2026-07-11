/**
 * Date/time types - see docs/domain/dates-and-timezones.md for the full
 * strategy. Two distinct string types, never interchanged:
 *
 * - `IsoTimestamp`: an exact instant, always UTC, always with time
 *   (createdAt, changedAt, submittedAt, ...).
 * - `IsoDate`: a business calendar date with no time component
 *   (scheduledDate, dueDate, issueDate, ...) - avoids a date "shifting" a
 *   day when read in a different timezone than it was written in.
 *
 * Deliberately `string`, not the built-in `Date` (mutable, ambiguous
 * between instant/date, inconsistent parsing across environments). Actual
 * timezone-aware formatting happens in the UI layer using a dedicated
 * library, chosen in Fase 3 - no new dependency is added in this phase.
 */

/** UTC instant, ISO 8601 with time, e.g. "2026-07-10T14:32:00.000Z". */
export type IsoTimestamp = string;

/** Business calendar date, no time/timezone, e.g. "2026-07-10". */
export type IsoDate = string;

/** IANA timezone name, e.g. "America/Santiago", never a fixed UTC offset. */
export type IanaTimezone = string;
