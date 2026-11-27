/**
 * Pure time logic for a single assignment: jobs that cross midnight, stop
 * times that roll over to the next day, and what counts as finished.
 */
import { FINISHED_STATUSES, type AssignmentStatusValue } from '../model/constants';
import type { Assignment, Stop } from '../model/schema';

import { clockToMinutes, dayKeyOf, daysBetween } from '@/shared/lib/time';

export const isFinished = (status: AssignmentStatusValue): boolean =>
  FINISHED_STATUSES.includes(status);

/** How many days after the start day the job ends (0 = same day, 1 = "+1"). */
export const endDayOffset = (assignment: Assignment): number =>
  daysBetween(dayKeyOf(assignment.start.time), dayKeyOf(assignment.end.time));

export type TimedStop = Stop & { dayOffset: number };

/**
 * Stops carry only `HH:mm`. A stop whose time is earlier than the previous
 * one happened after midnight, so it gets the next day offset ("00:20 +1").
 */
export function withDayOffsets(itinerary: readonly Stop[]): TimedStop[] {
  let dayOffset = 0;
  let previous: number | null = null;
  return itinerary.map((stop) => {
    const minutes = clockToMinutes(stop.time);
    if (previous !== null && minutes < previous) dayOffset += 1;
    previous = minutes;
    return { ...stop, dayOffset };
  });
}

/** Seats left, never negative even if the dispatcher overbooked. */
export const freeSeats = (assignment: Assignment): number =>
  Math.max(assignment.bus.seats - assignment.passengers, 0);
