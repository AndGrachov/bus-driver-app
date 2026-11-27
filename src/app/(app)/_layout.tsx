/**
 * Stack of the signed-in part of the app.
 */
import { Stack } from 'expo-router';

import { useTheme } from '@/shared/theme/ThemeProvider';

export default function AppLayout() {
  const { colors } = useTheme();
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />;
}
