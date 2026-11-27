/**
 * Runtime schema of the schedule payload. The local JSON (and, later, a real
 * API) is validated once at the boundary so the rest of the app can trust the
 * types; a malformed file fails loudly instead of rendering half a screen.
 *
 * Base shape follows the dispatcher export; additions are marked "extension"
 * and documented in the README.
 */
import { z } from 'zod';

import { isClockTime, isIsoWithOffset } from '@/shared/lib/time';

import { AssignmentStatus, AssignmentType } from './constants';

const isoWithOffset = z.string().refine(isIsoWithOffset, 'ISO timestamp with offset expected');
const clockTime = z.string().refine(isClockTime, 'HH:mm expected');

const placeTimeSchema = z.object({
  time: isoWithOffset,
  place: z.string().min(1),
});

const stopSchema = z.object({
  time: clockTime,
  stop: z.string().min(1),
});

export const assignmentSchema = z.object({
  id: z.string().min(1),
  type: z.enum([AssignmentType.shuttle, AssignmentType.tour]),
  client: z.string().min(1),
  bus: z.object({
    plate: z.string().min(1),
    seats: z.number().int().positive(),
  }),
  start: placeTimeSchema,
  end: placeTimeSchema,
  passengers: z.number().int().nonnegative(),
  itinerary: z.array(stopSchema),
  status: z.enum([
    AssignmentStatus.notStarted,
    AssignmentStatus.onTheWay,
    AssignmentStatus.arrivedAtPickup,
    AssignmentStatus.inProgress,
    AssignmentStatus.completed,
    AssignmentStatus.cancelled,
  ]),
  updatedAt: isoWithOffset,
  /** Extension: increments on every dispatcher edit; drives change detection. */
  revision: z.number().int().positive().default(1),
  /** Extension: free-text instructions from the dispatcher. */
  notes: z.string().optional(),
});

export const scheduleSchema = z.object({
  driver: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
  }),
  /** Extension: who the driver calls when something goes wrong. */
  dispatcher: z
    .object({
      name: z.string().min(1),
      phone: z.string().min(1),
    })
    .optional(),
  assignments: z.array(assignmentSchema),
});

export type Assignment = z.infer<typeof assignmentSchema>;
export type Schedule = z.infer<typeof scheduleSchema>;
export type Stop = z.infer<typeof stopSchema>;
export type PlaceTime = z.infer<typeof placeTimeSchema>;
