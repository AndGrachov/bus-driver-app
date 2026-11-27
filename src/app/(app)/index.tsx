/**
 * Temporary home screen: greets the signed-in driver and offers the theme
 * switch and sign-out. Replaced by the "My assignments" list next.
 */
import { StyleSheet, Text, View } from 'react-native';

import { selectSession, signedOut } from '@/features/auth';
import { selectThemeMode, themeModeChanged } from '@/features/settings';
import { useAppDispatch, useAppSelector } from '@/store';
import { type ThemeMode, ThemeModes } from '@/shared/theme/theme';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { spacing } from '@/shared/theme/tokens';
import { type } from '@/shared/theme/typography';
import { Button, ButtonVariant, Screen } from '@/shared/ui';

const MODE_ORDER: readonly ThemeMode[] = [ThemeModes.system, ThemeModes.light, ThemeModes.dark];

export default function HomeRoute() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const session = useAppSelector(selectSession);
  const mode = useAppSelector(selectThemeMode);
  const nextMode = MODE_ORDER[(MODE_ORDER.indexOf(mode) + 1) % MODE_ORDER.length] ?? ThemeModes.system;

  return (
    <Screen>
      <View style={styles.content}>
        <Text style={[type.screenTitle, { color: colors.text }]}>Today’s shifts</Text>
        <Text style={[type.body, { color: colors.muted }]}>Signed in as {session?.driverName}</Text>
        <Text style={[type.body, { color: colors.muted }]}>Theme: {mode}</Text>
      </View>
      <View style={styles.actions}>
        <Button label="Switch theme" onPress={() => dispatch(themeModeChanged(nextMode))} />
        <Button label="Sign out" variant={ButtonVariant.secondary} onPress={() => dispatch(signedOut())} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, gap: spacing.md },
  actions: { gap: spacing.md },
});
