import { StyleSheet } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';
import { radii, spacing, touch } from '@/shared/theme/tokens';
import { fonts, type } from '@/shared/theme/typography';

const PRESSED_OPACITY = 0.85;
const DISABLED_OPACITY = 0.6;

export function useStyles() {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    base: {
      borderRadius: radii.button,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: spacing.sm,
      paddingHorizontal: spacing.xl,
    },
    primary: { minHeight: touch.primary, backgroundColor: colors.accent },
    secondary: {
      minHeight: touch.min,
      borderWidth: StyleSheet.hairlineWidth * 2,
      borderColor: colors.line,
      backgroundColor: colors.surface,
    },
    pressed: { opacity: PRESSED_OPACITY },
    disabled: { opacity: DISABLED_OPACITY },
    primaryLabel: { ...type.button, color: colors.onAccent },
    secondaryLabel: { ...type.body, fontFamily: fonts.bodySemi, color: colors.text },
  });
  return { styles, colors };
}
