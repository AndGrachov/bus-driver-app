/**
 * Loading the schedule: validate the raw payload and move the bundled demo
 * data onto "today", so the app always opens with a live day instead of a
 * fixed date in the past.
 */
import seed from '../data/schedule.json';
import { scheduleSchema, type Schedule } from '../model/schema';

import {
  daysBetween,
  type DayKey,
  offsetOf,
  offsetToMinutes,
  shiftIsoByDays,
  todayKey,
} from '@/shared/lib/time';

/** The day the bundled JSON was authored around; it is mapped onto today. */
export const SEED_ANCHOR_DAY: DayKey = '2026-12-02';

/** Validates an unknown payload; throws with a readable message on bad data. */
export function parseSchedule(raw: unknown): Schedule {
  const result = scheduleSchema.safeParse(raw);
  if (!result.success) {
    const first = result.error.issues[0];
    const where = first?.path.join('.') ?? 'root';
    throw new Error(`Invalid schedule at "${where}": ${first?.message ?? 'unknown error'}`);
  }
  return result.data;
}

/** Operator offset in minutes, taken from the data itself (all jobs share it). */
export function operatorOffsetMinutes(schedule: Schedule): number {
  const first = schedule.assignments[0];
  return first ? offsetToMinutes(offsetOf(first.start.time)) : 0;
}

/** Shifts every timestamp by whole days; wall-clock times and offsets stay. */
export function rebaseSchedule(schedule: Schedule, fromDay: DayKey, toDay: DayKey): Schedule {
  const days = daysBetween(fromDay, toDay);
  if (days === 0) return schedule;
  return {
    ...schedule,
    assignments: schedule.assignments.map((assignment) => ({
      ...assignment,
      start: { ...assignment.start, time: shiftIsoByDays(assignment.start.time, days) },
      end: { ...assignment.end, time: shiftIsoByDays(assignment.end.time, days) },
      updatedAt: shiftIsoByDays(assignment.updatedAt, days),
    })),
  };
}

/** The bundled demo schedule, validated and moved onto the operator's today. */
export function loadSeedSchedule(now: Date): Schedule {
  const schedule = parseSchedule(seed);
  const today = todayKey(now, operatorOffsetMinutes(schedule));
  return rebaseSchedule(schedule, SEED_ANCHOR_DAY, today);
}
