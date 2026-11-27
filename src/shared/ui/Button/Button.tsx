/**
 * Full-width button. `primary` is the signal-yellow 64 pt action (one per
 * screen region); `secondary` is a quiet 48 pt outline for everything else.
 */
import { ActivityIndicator, Pressable, Text } from 'react-native';

import { useStyles } from './useStyles';

export const ButtonVariant = { primary: 'primary', secondary: 'secondary' } as const;
export type ButtonVariantValue = (typeof ButtonVariant)[keyof typeof ButtonVariant];

type Props = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariantValue;
  loading?: boolean;
  disabled?: boolean;
  accessibilityHint?: string;
};

export function Button({
  label,
  onPress,
  variant = ButtonVariant.primary,
  loading = false,
  disabled = false,
  accessibilityHint,
}: Props) {
  const { styles, colors } = useStyles();
  const isPrimary = variant === ButtonVariant.primary;
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {loading ? <ActivityIndicator color={isPrimary ? colors.onAccent : colors.text} /> : null}
      <Text style={isPrimary ? styles.primaryLabel : styles.secondaryLabel}>{label}</Text>
    </Pressable>
  );
}
