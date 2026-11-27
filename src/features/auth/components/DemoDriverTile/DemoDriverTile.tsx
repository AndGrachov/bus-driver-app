/**
 * One-tap entry for people trying the app: signs in as the demo driver.
 * Dashed outline marks it as a side door, not the main way in.
 */
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { useStyles } from './useStyles';

import { Icon, IconName } from '@/shared/ui';

type Props = { name: string; onPress: () => void; busy: boolean; disabled: boolean };

const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

export function DemoDriverTile({ name, onPress, busy, disabled }: Props) {
  const { styles, colors } = useStyles();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Sign in as the demo driver"
      accessibilityState={{ disabled, busy }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
    >
      <View style={styles.avatar}>
        <Text style={styles.initials}>{initialsOf(name)}</Text>
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>Sign in as the demo driver</Text>
        <Text style={styles.subtitle}>{name}, demo schedule</Text>
      </View>
      {busy ? (
        <ActivityIndicator color={colors.muted} />
      ) : (
        <Icon name={IconName.chevronRight} color={colors.muted} />
      )}
    </Pressable>
  );
}
