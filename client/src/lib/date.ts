/**
 * Calendar date from YYYY-MM-DD in the user's local timezone (not UTC midnight).
 * `new Date("2025-04-08")` is specified as UTC midnight and shifts the calendar
 * day west of UTC, which breaks pickers and weekday display.
 */

/** Decode a path segment safely (handles `+` from query-style encodings). */
function decodePathSegment(segment: string): string {
  try {
    return decodeURIComponent(segment.replace(/\+/g, " "));
  } catch {
    return segment;
  }
}

/**
 * `from`, `to`, `date` from `/booking/:from/:to/:date` — parse from `pathname` so
 * parent layouts match Firefox + Chromium without relying on nested `useParams`.
 */
export function bookingTripFromPathname(pathname: string): {
  from?: string;
  to?: string;
  date?: string;
} {
  const m = pathname.match(/\/booking\/([^/]+)\/([^/]+)\/(\d{4}-\d{2}-\d{2})(?:\/|$)/);
  if (!m) return {};
  return {
    from: decodePathSegment(m[1]),
    to: decodePathSegment(m[2]),
    date: m[3],
  };
}

export function bookingDateFromPathname(pathname: string): string | undefined {
  return bookingTripFromPathname(pathname).date;
}

export function parseIsoDateLocal(iso: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return new Date(NaN);
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  return new Date(y, mo - 1, d);
}

/** Sunday → Saturday (`getUTCDay` order). Swahili weekday names (TZ-agnostic). */
const SW_WEEKDAYS = [
  "Jumapili",
  "Jumatatu",
  "Jumanne",
  "Jumatano",
  "Alhamisi",
  "Ijumaa",
  "Jumamosi",
] as const;

/**
 * Weekday in Swahili for the Gregorian calendar date `YYYY-MM-DD`.
 * Uses `Date.UTC` + `getUTCDay` only — same civil calendar weekday everywhere (matches the `YYYY-MM-DD` string).
 */
export function weekdayNameSwFromIso(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return "";
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const t = Date.UTC(y, mo - 1, d);
  if (Number.isNaN(t)) return "";
  return SW_WEEKDAYS[new Date(t).getUTCDay()];
}
