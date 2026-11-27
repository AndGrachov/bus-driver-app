import seed from '../data/schedule.json';
import {
  AssignmentStatus,
  endDayOffset,
  findNextUp,
  groupByDay,
  loadSeedSchedule,
  parseSchedule,
  rebaseSchedule,
  SEED_ANCHOR_DAY,
  withDayOffsets,
  type Assignment,
} from '../index';

const schedule = parseSchedule(seed);
const byId = (id: string): Assignment => {
  const found = schedule.assignments.find((a) => a.id === id);
  if (!found) throw new Error(`missing ${id}`);
  return found;
};

describe('schedule loading', () => {
  it('accepts the bundled seed and defaults missing extensions', () => {
    expect(schedule.assignments).toHaveLength(8);
    // asg-1042 is copied verbatim from the base export and has no revision.
    expect(byId('asg-1042').revision).toBe(1);
  });

  it('rejects a payload with a broken field and names the path', () => {
    const broken = structuredClone(seed) as { assignments: { start: { time: string } }[] };
    broken.assignments[0]!.start.time = 'tomorrow morning';
    expect(() => parseSchedule(broken)).toThrow(/assignments\.0\.start\.time/);
  });

  it('accepts an empty schedule', () => {
    const empty = parseSchedule({ driver: { id: 'd', name: 'D' }, assignments: [] });
    expect(groupByDay(empty.assignments, '2026-12-02')).toEqual([]);
    expect(findNextUp(empty.assignments, new Date())).toBeNull();
  });

  it('rebases the seed so its anchor day becomes today', () => {
    const moved = rebaseSchedule(schedule, SEED_ANCHOR_DAY, '2027-03-10');
    const first = moved.assignments.find((a) => a.id === 'asg-1042');
    expect(first?.start.time).toBe('2027-03-10T05:20:00+01:00');
    expect(first?.end.time).toBe('2027-03-10T06:10:00+01:00');
  });

  it('loads the seed onto the current operator day', () => {
    const now = new Date('2027-03-10T08:00:00Z');
    const loaded = loadSeedSchedule(now);
    const first = loaded.assignments.find((a) => a.id === 'asg-1042');
    expect(first?.start.time.startsWith('2027-03-10')).toBe(true);
  });
});

describe('after-midnight jobs', () => {
  it('detects a job that ends on the next day', () => {
    expect(endDayOffset(byId('asg-1045'))).toBe(1);
    expect(endDayOffset(byId('asg-1043'))).toBe(0);
  });

  it('rolls itinerary stops over midnight', () => {
    const stops = withDayOffsets(byId('asg-1045').itinerary);
    expect(stops.map((s) => `${s.time}+${s.dayOffset}`)).toEqual([
      '23:40+0',
      '00:20+1',
      '00:35+1',
      '00:50+1',
    ]);
  });
});

describe('grouping by day', () => {
  const today = SEED_ANCHOR_DAY;

  it('lists today and the coming days in order, hiding finished past jobs', () => {
    const sections = groupByDay(schedule.assignments, today);
    expect(sections.map((s) => s.title)).toEqual(['Today', 'Tomorrow', 'Saturday 5 December']);
    expect(sections[0]!.data.map((a) => a.id)).toEqual([
      'asg-1042',
      'asg-1043',
      'asg-1044',
      'asg-1045',
    ]);
    // asg-1041 started yesterday and is completed: not shown.
    expect(sections.flatMap((s) => s.data).some((a) => a.id === 'asg-1041')).toBe(false);
  });

  it('keeps the after-midnight job under the day it starts', () => {
    const sections = groupByDay(schedule.assignments, today);
    expect(sections[0]!.data.some((a) => a.id === 'asg-1045')).toBe(true);
    expect(sections[1]!.data.some((a) => a.id === 'asg-1045')).toBe(false);
  });

  it('carries an unfinished job from yesterday over to today', () => {
    const sections = groupByDay(schedule.assignments, today, {
      'asg-1041': AssignmentStatus.inProgress,
    });
    expect(sections[0]!.data[0]!.id).toBe('asg-1041');
  });

  it('orders by actual start time, not by input order', () => {
    const reversed = [...schedule.assignments].reverse();
    const sections = groupByDay(reversed, today);
    expect(sections[1]!.data.map((a) => a.id)).toEqual(['asg-1046', 'asg-1047']);
  });
});

describe('next up', () => {
  it('picks the earliest job that has not ended yet', () => {
    const now = new Date('2026-12-02T08:00:00+01:00');
    expect(findNextUp(schedule.assignments, now)?.id).toBe('asg-1043');
  });

  it('prefers the job the driver is already working on', () => {
    const now = new Date('2026-12-02T15:00:00+01:00');
    const next = findNextUp(schedule.assignments, now, {
      'asg-1043': AssignmentStatus.onTheWay,
    });
    expect(next?.id).toBe('asg-1043');
  });

  it('returns null when everything is finished', () => {
    const allDone = Object.fromEntries(
      schedule.assignments.map((a) => [a.id, AssignmentStatus.completed]),
    );
    expect(findNextUp(schedule.assignments, new Date('2026-12-02T08:00:00+01:00'), allDone)).toBeNull();
  });
});
