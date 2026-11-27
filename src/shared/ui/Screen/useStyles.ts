import { StyleSheet } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';
import { spacing } from '@/shared/theme/tokens';

export function useStyles() {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.bg },
    fill: { flex: 1 },
    content: { flex: 1, padding: spacing.xl },
    scrollContent: { flexGrow: 1, padding: spacing.xl },
  });
  return { styles };
}
