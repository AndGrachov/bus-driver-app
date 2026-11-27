/**
 * Temporary entry screen — proves fonts and theme tokens render.
 * Replaced by the auth redirect + "My assignments" list in the next step.
 */
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ColorSchemes, palettes, spacing } from '@/shared/theme/tokens';
import { type } from '@/shared/theme/typography';

export default function Index() {
  const scheme = useColorScheme() === ColorSchemes.light ? ColorSchemes.light : ColorSchemes.dark;
  const c = palettes[scheme];

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: c.bg }]}>
      <View style={styles.content}>
        <Text style={[type.screenTitle, { color: c.text }]}>Today’s shifts</Text>
        <Text style={[type.heroTime, { color: c.highlight }]}>09:45</Text>
        <Text style={[type.body, { color: c.muted }]}>Scaffold ready</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: spacing.xl, gap: spacing.md },
});
