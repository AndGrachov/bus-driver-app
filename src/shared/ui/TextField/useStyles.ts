import { StyleSheet } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';
import { radii, spacing, touch } from '@/shared/theme/tokens';
import { fonts, type } from '@/shared/theme/typography';

/** Inputs are taller than the 48 pt minimum: they are typed into in a cab. */
const FIELD_HEIGHT = 56;
const INPUT_FONT_SIZE = 18;
const ERROR_BORDER_WIDTH = 2;

export function useStyles(hasError: boolean) {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    root: { gap: spacing.sm },
    label: { ...type.meta, color: colors.muted },
    row: {
      minHeight: FIELD_HEIGHT,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: radii.row,
      borderWidth: hasError ? ERROR_BORDER_WIDTH : StyleSheet.hairlineWidth * 2,
      borderColor: hasError ? colors.danger : colors.line,
      backgroundColor: colors.surface,
    },
    input: {
      flex: 1,
      minHeight: FIELD_HEIGHT,
      paddingHorizontal: spacing.lg,
      fontFamily: fonts.bodySemi,
      fontSize: INPUT_FONT_SIZE,
      color: colors.text,
    },
    accessory: {
      minWidth: touch.min,
      minHeight: touch.min,
      paddingHorizontal: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    accessoryLabel: { ...type.meta, fontFamily: fonts.bodySemi, color: colors.text },
    error: { ...type.meta, color: colors.danger },
  });
  return { styles, colors };
}
