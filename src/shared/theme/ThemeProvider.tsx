/**
 * Provides the resolved colour scheme and palette to the tree. The mode comes
 * from the caller (the root layout reads it from settings), so `shared/` stays
 * independent of any feature.
 */
import { createContext, type ReactNode, use } from 'react';
import { useColorScheme } from 'react-native';

import { resolveScheme, type ThemeMode } from './theme';
import { type ColorScheme, type Palette, palettes } from './tokens';

export type Theme = { scheme: ColorScheme; colors: Palette };

const ThemeContext = createContext<Theme | null>(null);

type Props = { mode: ThemeMode; children: ReactNode };

export function ThemeProvider({ mode, children }: Props) {
  const scheme = resolveScheme(mode, useColorScheme());
  return <ThemeContext value={{ scheme, colors: palettes[scheme] }}>{children}</ThemeContext>;
}

export function useTheme(): Theme {
  const theme = use(ThemeContext);
  if (!theme) throw new Error('useTheme must be used inside <ThemeProvider>');
  return theme;
}
