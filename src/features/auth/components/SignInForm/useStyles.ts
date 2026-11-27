import { StyleSheet } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';
import { spacing } from '@/shared/theme/tokens';
import { type } from '@/shared/theme/typography';

export function useStyles() {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    root: { flex: 1, gap: spacing.xxl },
    header: { gap: spacing.sm, paddingTop: spacing.xxl },
    wordmark: { ...type.section, color: colors.muted },
    title: { ...type.screenTitle, color: colors.text },
    lead: { ...type.body, color: colors.muted },
    fields: { gap: spacing.sm },
    footer: { flex: 1, justifyContent: 'flex-end', gap: spacing.md },
    demoHint: { ...type.meta, color: colors.muted, textAlign: 'center', marginTop: spacing.sm },
  });
  return { styles };
}
