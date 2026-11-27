/**
 * Labelled text input with an inline error and an optional accessory button
 * on the right (e.g. "Show" for passwords). The error line is always
 * reserved, so showing an error never shifts the fields below. The error is
 * announced together with the field, so screen readers hear what to fix.
 */
import type { ComponentRef, Ref } from 'react';
import { Pressable, Text, TextInput, type TextInputProps, View } from 'react-native';

import { useStyles } from './useStyles';

type Accessory = { label: string; onPress: () => void };

type Props = Omit<TextInputProps, 'style' | 'placeholderTextColor'> & {
  label: string;
  error?: string | null;
  /** Marks the field without repeating a message shown elsewhere. */
  invalid?: boolean;
  accessory?: Accessory;
  ref?: Ref<ComponentRef<typeof TextInput>>;
};

export function TextField({ label, error, invalid = false, accessory, ref, ...inputProps }: Props) {
  const hasError = invalid || Boolean(error);
  const { styles, colors } = useStyles(hasError);

  return (
    <View style={styles.root}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          accessibilityHint={error ?? undefined}
          placeholderTextColor={colors.muted}
          style={styles.input}
          {...inputProps}
        />
        {accessory ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={accessory.label}
            onPress={accessory.onPress}
            style={styles.accessory}
          >
            <Text style={styles.accessoryLabel}>{accessory.label}</Text>
          </Pressable>
        ) : null}
      </View>
      <Text
        accessibilityLiveRegion="polite"
        accessibilityRole={error ? 'alert' : undefined}
        style={styles.error}
      >
        {error ?? ''}
      </Text>
    </View>
  );
}
