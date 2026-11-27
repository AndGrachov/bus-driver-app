/**
 * Time helpers that work in the bus operator's timezone, not the device's.
 *
 * Every timestamp in the schedule is an ISO string with an explicit offset
 * (`2026-12-02T05:20:00+01:00`). Its date and wall-clock parts are therefore
 * already "operator local", so we read them straight from the string instead
 * of converting through the device timezone — a driver whose phone is set to
 * another zone still sees the times the dispatcher planned.
 */

/** Operator-local calendar day, `YYYY-MM-DD`. Sortable as a plain string. */
export type DayKey = string;

const MS_PER_MINUTE = 60_000;
const MS_PER_DAY = 86_400_000;
const MINUTES_PER_HOUR = 60;

const ISO_WITH_OFFSET =
  /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;
const HH_MM = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const isIsoWithOffset = (value: string): boolean => ISO_WITH_OFFSET.test(value);
export const isClockTime = (value: string): boolean => HH_MM.test(value);

type IsoParts = { dayKey: DayKey; hours: string; minutes: string; offset: string };

function parseIso(iso: string): IsoParts {
  const match = ISO_WITH_OFFSET.exec(iso);
  if (!match) throw new Error(`Expected an ISO timestamp with offset, got "${iso}"`);
  const [, dayKey, hours, minutes, offset] = match as unknown as [string, string, string, string, string];
  return { dayKey, hours, minutes, offset };
}

/** Operator-local day of a timestamp. */
export const dayKeyOf = (iso: string): DayKey => parseIso(iso).dayKey;

/** Operator-local wall-clock time, `HH:mm`. */
export function clockTimeOf(iso: string): string {
  const { hours, minutes } = parseIso(iso);
  return `${hours}:${minutes}`;
}

/** `+01:00` → 60, `Z` → 0. */
export function offsetToMinutes(offset: string): number {
  if (offset === 'Z') return 0;
  const sign = offset.startsWith('-') ? -1 : 1;
  const [h = '0', m = '0'] = offset.slice(1).split(':');
  return sign * (Number(h) * MINUTES_PER_HOUR + Number(m));
}

export const offsetOf = (iso: string): string => parseIso(iso).offset;

/** Absolute instant in ms — for comparisons with "now". */
export const toEpoch = (iso: string): number => Date.parse(iso);

/** Today's day key in the operator's zone (fixed offset — see README on DST). */
export function todayKey(now: Date, offsetMinutes: number): DayKey {
  return new Date(now.getTime() + offsetMinutes * MS_PER_MINUTE).toISOString().slice(0, 10);
}

function dayKeyToUtcMs(dayKey: DayKey): number {
  return Date.parse(`${dayKey}T00:00:00Z`);
}

/** Whole days from `from` to `to` (can be negative). */
export const daysBetween = (from: DayKey, to: DayKey): number =>
  Math.round((dayKeyToUtcMs(to) - dayKeyToUtcMs(from)) / MS_PER_DAY);

export const addDays = (dayKey: DayKey, days: number): DayKey =>
  new Date(dayKeyToUtcMs(dayKey) + days * MS_PER_DAY).toISOString().slice(0, 10);

/** Moves a timestamp by whole days, keeping its wall-clock time and offset. */
export function shiftIsoByDays(iso: string, days: number): string {
  const { dayKey } = parseIso(iso);
  return `${addDays(dayKey, days)}${iso.slice(dayKey.length)}`;
}

/** Minutes since midnight for an `HH:mm` string. */
export function clockToMinutes(clock: string): number {
  const match = HH_MM.exec(clock);
  if (!match) throw new Error(`Expected HH:mm, got "${clock}"`);
  return Number(match[1]) * MINUTES_PER_HOUR + Number(match[2]);
}

export const DayLabels = { today: 'Today', tomorrow: 'Tomorrow' } as const;

const dayFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

/** "Today", "Tomorrow" or "Thursday 3 December". */
export function formatDayLabel(dayKey: DayKey, today: DayKey): string {
  const diff = daysBetween(today, dayKey);
  if (diff === 0) return DayLabels.today;
  if (diff === 1) return DayLabels.tomorrow;
  return dayFormatter.format(new Date(dayKeyToUtcMs(dayKey)));
}

/** Full date for headers: "Wednesday 2 December". */
export const formatLongDate = (dayKey: DayKey): string =>
  dayFormatter.format(new Date(dayKeyToUtcMs(dayKey)));
