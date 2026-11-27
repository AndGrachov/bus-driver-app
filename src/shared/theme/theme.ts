/**
 * Theme modes and how a mode resolves to a colour scheme. "System" follows the
 * device; when the device reports nothing we fall back to dark, the calmer
 * choice for a cab at night.
 */
import { type ColorScheme, ColorSchemes } from './tokens';

export const ThemeModes = { system: 'system', light: 'light', dark: 'dark' } as const;
export type ThemeMode = (typeof ThemeModes)[keyof typeof ThemeModes];

export const FALLBACK_SCHEME: ColorScheme = ColorSchemes.dark;

export function resolveScheme(mode: ThemeMode, systemScheme: string | null | undefined): ColorScheme {
  if (mode === ThemeModes.light) return ColorSchemes.light;
  if (mode === ThemeModes.dark) return ColorSchemes.dark;
  if (systemScheme === ColorSchemes.light || systemScheme === ColorSchemes.dark) return systemScheme;
  return FALLBACK_SCHEME;
}
