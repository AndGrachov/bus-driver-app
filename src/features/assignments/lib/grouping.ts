/**
 * Builds the "My assignments" list: today and the coming days, grouped by the
 * operator-local start day and ordered by start time, plus the "next up" job.
 */
import { AssignmentStatus, type AssignmentStatusValue } from '../model/constants';
import type { Assignment } from '../model/schema';

import { isFinished } from './timing';

import { dayKeyOf, type DayKey, formatDayLabel, toEpoch } from '@/shared/lib/time';

export type DaySection = {
  dayKey: DayKey;
  title: string;
  data: Assignment[];
};

/** Current status per assignment id; falls back to the status in the data. */
export type StatusLookup = Readonly<Record<string, AssignmentStatusValue | undefined>>;

const statusOf = (assignment: Assignment, statuses: StatusLookup): AssignmentStatusValue =>
  statuses[assignment.id] ?? assignment.status;

const byStart = (a: Assignment, b: Assignment): number =>
  toEpoch(a.start.time) - toEpoch(b.start.time);

/**
 * A job belongs on the list if it starts today or later. A job from an earlier
 * day is carried over to today only while it still needs the driver: it runs
 * into today (began 23:30 yesterday) or the driver has it in progress and
 * hasn't completed it yet. Untouched jobs that ended on past days are hidden.
 */
function sectionDayFor(
  assignment: Assignment,
  today: DayKey,
  status: AssignmentStatusValue,
): DayKey | null {
  const startDay = dayKeyOf(assignment.start.time);
  if (startDay >= today) return startDay;
  if (isFinished(status)) return null;
  const runsIntoToday = dayKeyOf(assignment.end.time) >= today;
  const startedByDriver = status !== AssignmentStatus.notStarted;
  return runsIntoToday || startedByDriver ? today : null;
}

export function groupByDay(
  assignments: readonly Assignment[],
  today: DayKey,
  statuses: StatusLookup = {},
): DaySection[] {
  const sections = new Map<DayKey, Assignment[]>();
  for (const assignment of assignments) {
    const day = sectionDayFor(assignment, today, statusOf(assignment, statuses));
    if (day === null) continue;
    const bucket = sections.get(day) ?? [];
    bucket.push(assignment);
    sections.set(day, bucket);
  }
  return [...sections.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([dayKey, data]) => ({
      dayKey,
      title: formatDayLabel(dayKey, today),
      data: [...data].sort(byStart),
    }));
}

/**
 * The job the driver should focus on: an active one if any (they never lose
 * the trip they're on), otherwise the earliest unfinished job that hasn't ended.
 */
export function findNextUp(
  assignments: readonly Assignment[],
  now: Date,
  statuses: StatusLookup = {},
): Assignment | null {
  const open = assignments
    .filter((a) => !isFinished(statusOf(a, statuses)))
    .sort(byStart);
  const active = open.find((a) => statusOf(a, statuses) !== AssignmentStatus.notStarted);
  if (active) return active;
  return open.find((a) => toEpoch(a.end.time) >= now.getTime()) ?? null;
}
