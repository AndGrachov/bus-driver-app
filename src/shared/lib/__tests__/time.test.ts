import {
  addDays,
  clockTimeOf,
  clockToMinutes,
  dayKeyOf,
  daysBetween,
  formatDayLabel,
  offsetToMinutes,
  shiftIsoByDays,
  todayKey,
} from '../time';

describe('time helpers', () => {
  it('reads the operator-local day and clock straight from the string', () => {
    const iso = '2026-12-02T23:40:00+01:00';
    // In UTC this instant is still 22:40 on 2 Dec; the operator sees 23:40.
    expect(dayKeyOf(iso)).toBe('2026-12-02');
    expect(clockTimeOf(iso)).toBe('23:40');
  });

  it('computes today in the operator zone, not UTC', () => {
    // 23:30 UTC on 1 Dec is already 00:30 on 2 Dec in +01:00.
    const now = new Date('2026-12-01T23:30:00Z');
    expect(todayKey(now, 60)).toBe('2026-12-02');
    expect(todayKey(now, 0)).toBe('2026-12-01');
  });

  it('parses offsets', () => {
    expect(offsetToMinutes('+01:00')).toBe(60);
    expect(offsetToMinutes('-05:30')).toBe(-330);
    expect(offsetToMinutes('Z')).toBe(0);
  });

  it('shifts timestamps by whole days across month boundaries', () => {
    expect(shiftIsoByDays('2026-12-02T05:20:00+01:00', 30)).toBe('2027-01-01T05:20:00+01:00');
    expect(shiftIsoByDays('2026-12-02T05:20:00+01:00', -2)).toBe('2026-11-30T05:20:00+01:00');
  });

  it('counts days between keys', () => {
    expect(daysBetween('2026-12-02', '2026-12-05')).toBe(3);
    expect(daysBetween('2026-12-02', '2026-11-30')).toBe(-2);
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
  });

  it('labels days relative to today', () => {
    expect(formatDayLabel('2026-12-02', '2026-12-02')).toBe('Today');
    expect(formatDayLabel('2026-12-03', '2026-12-02')).toBe('Tomorrow');
    expect(formatDayLabel('2026-12-05', '2026-12-02')).toBe('Saturday 5 December');
  });

  it('rejects malformed input', () => {
    expect(() => dayKeyOf('2026-12-02 05:20')).toThrow();
    expect(() => clockToMinutes('24:10')).toThrow();
  });
});
