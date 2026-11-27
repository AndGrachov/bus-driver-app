import { resolveScheme, ThemeModes } from '../theme';

describe('resolveScheme', () => {
  it('uses the manual choice regardless of the device', () => {
    expect(resolveScheme(ThemeModes.light, 'dark')).toBe('light');
    expect(resolveScheme(ThemeModes.dark, 'light')).toBe('dark');
  });

  it('follows the device in system mode', () => {
    expect(resolveScheme(ThemeModes.system, 'light')).toBe('light');
    expect(resolveScheme(ThemeModes.system, 'dark')).toBe('dark');
  });

  it('falls back to dark when the device reports nothing', () => {
    expect(resolveScheme(ThemeModes.system, null)).toBe('dark');
    expect(resolveScheme(ThemeModes.system, 'unspecified')).toBe('dark');
  });
});
