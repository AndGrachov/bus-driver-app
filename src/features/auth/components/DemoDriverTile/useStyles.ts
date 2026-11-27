import { StyleSheet } from 'react-native';

import { useTheme } from '@/shared/theme/ThemeProvider';
import { radii, spacing } from '@/shared/theme/tokens';
import { fonts, type } from '@/shared/theme/typography';

const TILE_MIN_HEIGHT = 72;
const AVATAR_SIZE = 44;
const PRESSED_OPACITY = 0.7;

export function useStyles() {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    tile: {
      minHeight: TILE_MIN_HEIGHT,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: radii.row,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: colors.line,
      // Filled so it reads as a control on the light page background too.
      backgroundColor: colors.surface,
    },
    pressed: { opacity: PRESSED_OPACITY },
    avatar: {
      width: AVATAR_SIZE,
      height: AVATAR_SIZE,
      borderRadius: radii.chip,
      borderWidth: 1,
      borderColor: colors.line,
      backgroundColor: colors.bg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    initials: { ...type.body, fontFamily: fonts.bodyBold, color: colors.text },
    text: { flex: 1, gap: spacing.xs / 2 },
    title: { ...type.body, fontFamily: fonts.bodyBold, color: colors.text },
    subtitle: { ...type.meta, color: colors.muted },
  });
  return { styles, colors };
}
