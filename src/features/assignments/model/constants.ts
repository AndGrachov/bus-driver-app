/**
 * Discrete value sets of the assignment domain.
 */

export const AssignmentType = {
  shuttle: 'shuttle',
  tour: 'tour',
} as const;
export type AssignmentTypeValue = (typeof AssignmentType)[keyof typeof AssignmentType];

/**
 * Driver-reported progress, in the only order it may advance.
 * `cancelled` is set by the dispatcher, never by the driver.
 */
export const AssignmentStatus = {
  notStarted: 'not_started',
  onTheWay: 'on_the_way',
  arrivedAtPickup: 'arrived_at_pickup',
  inProgress: 'in_progress',
  completed: 'completed',
  cancelled: 'cancelled',
} as const;
export type AssignmentStatusValue = (typeof AssignmentStatus)[keyof typeof AssignmentStatus];

/** The driver-facing flow, used for the progress bar and "next step". */
export const STATUS_FLOW = [
  AssignmentStatus.notStarted,
  AssignmentStatus.onTheWay,
  AssignmentStatus.arrivedAtPickup,
  AssignmentStatus.inProgress,
  AssignmentStatus.completed,
] as const satisfies readonly AssignmentStatusValue[];

/** Statuses after which the job no longer needs the driver's attention. */
export const FINISHED_STATUSES: readonly AssignmentStatusValue[] = [
  AssignmentStatus.completed,
  AssignmentStatus.cancelled,
];
