/**
 * Temporary entry screen — proves fonts, theme and persistence work: the theme
 * toggle survives an app restart. Replaced by the auth redirect and the
 * "My assignments" list in the next features.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { selectThemeMode, themeModeChanged } from '@/features/settings';
import { useAppDispatch, useAppSelector } from '@/store';
import { type ThemeMode, ThemeModes } from '@/shared/theme/theme';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { radii, spacing, touch } from '@/shared/theme/tokens';
import { type } from '@/shared/theme/typography';

const MODE_ORDER: readonly ThemeMode[] = [ThemeModes.system, ThemeModes.light, ThemeModes.dark];

export default function Index() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectThemeMode);
  const nextMode = MODE_ORDER[(MODE_ORDER.indexOf(mode) + 1) % MODE_ORDER.length] ?? ThemeModes.system;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <Text style={[type.screenTitle, { color: colors.text }]}>Today’s shifts</Text>
        <Text style={[type.heroTime, { color: colors.highlight }]}>09:45</Text>
        <Text style={[type.body, { color: colors.muted }]}>Theme: {mode}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => dispatch(themeModeChanged(nextMode))}
          style={[styles.button, { backgroundColor: colors.accent }]}
        >
          <Text style={[type.button, { color: colors.onAccent }]}>Switch theme</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: spacing.xl, gap: spacing.md },
  button: {
    minHeight: touch.primary,
    borderRadius: radii.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
