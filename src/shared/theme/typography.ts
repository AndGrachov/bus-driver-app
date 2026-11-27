/**
 * Font families and the type scale. Barlow Condensed = titles and buttons,
 * Barlow = body, Martian Mono = times and bus plates only (never labels).
 */
import {
  BarlowCondensed_600SemiBold,
  BarlowCondensed_700Bold,
} from '@expo-google-fonts/barlow-condensed';
import {
  Barlow_400Regular,
  Barlow_500Medium,
  Barlow_600SemiBold,
  Barlow_700Bold,
} from '@expo-google-fonts/barlow';
import { MartianMono_500Medium, MartianMono_600SemiBold } from '@expo-google-fonts/martian-mono';
import type { TextStyle } from 'react-native';

/** Passed to `useFonts` once at the app root. */
export const fontAssets = {
  BarlowCondensed_600SemiBold,
  BarlowCondensed_700Bold,
  Barlow_400Regular,
  Barlow_500Medium,
  Barlow_600SemiBold,
  Barlow_700Bold,
  MartianMono_500Medium,
  MartianMono_600SemiBold,
};

export const fonts = {
  display: 'BarlowCondensed_700Bold',
  displaySemi: 'BarlowCondensed_600SemiBold',
  body: 'Barlow_500Medium',
  bodyRegular: 'Barlow_400Regular',
  bodySemi: 'Barlow_600SemiBold',
  bodyBold: 'Barlow_700Bold',
  mono: 'MartianMono_600SemiBold',
  monoMedium: 'MartianMono_500Medium',
} as const;

export const type = {
  screenTitle: { fontFamily: fonts.display, fontSize: 34, lineHeight: 38 },
  section: { fontFamily: fonts.display, fontSize: 22, lineHeight: 26 },
  heroTime: { fontFamily: fonts.mono, fontSize: 52, lineHeight: 56, letterSpacing: -1.5 },
  rowTime: { fontFamily: fonts.mono, fontSize: 18, lineHeight: 22 },
  place: { fontFamily: fonts.bodyBold, fontSize: 20, lineHeight: 24 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 21 },
  meta: { fontFamily: fonts.body, fontSize: 14, lineHeight: 18 },
  button: { fontFamily: fonts.display, fontSize: 22, lineHeight: 26 },
} as const satisfies Record<string, TextStyle>;

/** Discrete `numberOfLines` values — never pass a bare number. */
export const TextLines = { single: 1, double: 2 } as const;
