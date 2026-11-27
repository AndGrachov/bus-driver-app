import { StyleSheet } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';
import { radii, spacing } from '@/shared/theme/tokens';
import { type } from '@/shared/theme/typography';

const LOGO_SIZE = 36;
const LOGO_RADIUS = 10;
const LOGO_ICON_SIZE = 22;

export function useStyles() {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    root: { flex: 1, gap: spacing.xxl },
    brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingTop: spacing.xxl },
    logo: {
      width: LOGO_SIZE,
      height: LOGO_SIZE,
      borderRadius: LOGO_RADIUS,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    wordmark: { ...type.section, color: colors.text },
    header: { gap: spacing.sm },
    title: { ...type.screenTitle, color: colors.text },
    lead: { ...type.body, color: colors.muted },
    card: {
      gap: spacing.sm,
      padding: spacing.lg,
      borderRadius: radii.card,
      backgroundColor: colors.surface,
    },
    demo: { flex: 1, justifyContent: 'flex-end', gap: spacing.md },
    demoTitle: { ...type.section, color: colors.text },
  });
  return { styles, colors, logoIconSize: LOGO_ICON_SIZE };
}
