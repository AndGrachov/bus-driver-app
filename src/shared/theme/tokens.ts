/**
 * Design tokens of the "Depot board" direction — the single source for colors,
 * spacing, radii and touch sizes. Values mirror `.claude/skills/driver-app-design`.
 */

export const ColorSchemes = { light: 'light', dark: 'dark' } as const;
export type ColorScheme = (typeof ColorSchemes)[keyof typeof ColorSchemes];

/** Signal yellow is a fill colour only — never text on a light background. */
const SIGNAL_YELLOW = '#FFC72C';
const INK = '#14181D';

export type Palette = {
  bg: string;
  surface: string;
  line: string;
  text: string;
  muted: string;
  accent: string;
  onAccent: string;
  highlight: string;
  statusDone: string;
  statusActive: string;
  track: string;
  danger: string;
};

export const palettes: Record<ColorScheme, Palette> = {
  dark: {
    bg: '#15191E',
    surface: '#1E2329',
    line: '#323941',
    text: '#F3F1EC',
    muted: '#A9AFB6',
    accent: SIGNAL_YELLOW,
    onAccent: INK,
    highlight: SIGNAL_YELLOW,
    statusDone: '#7BD88F',
    statusActive: '#5FD3F3',
    track: '#323941',
    danger: '#FF8A7A',
  },
  light: {
    bg: '#E9ECEF',
    surface: '#FFFFFF',
    line: '#CDD3D9',
    text: INK,
    muted: '#545B64',
    accent: SIGNAL_YELLOW,
    onAccent: INK,
    highlight: INK,
    statusDone: '#1D7A3A',
    statusActive: '#0A6A94',
    track: '#D5DADF',
    danger: '#B42318',
  },
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 } as const;

export const radii = { chip: 999, button: 14, row: 14, card: 18 } as const;

/** Minimum touch sizes: drivers may wear gloves and glance from arm's length. */
export const touch = { min: 48, primary: 64 } as const;
