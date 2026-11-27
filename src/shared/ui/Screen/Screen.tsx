/**
 * Screen frame: themed background, safe areas and screen padding. With
 * `keyboard` the content scrolls and moves above the iOS keyboard, so the
 * primary button stays reachable while typing.
 */
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/shared/theme/ThemeProvider';
import { spacing } from '@/shared/theme/tokens';

type Props = { children: ReactNode; keyboard?: boolean };

export function Screen({ children, keyboard = false }: Props) {
  const { colors } = useTheme();
  const background = { backgroundColor: colors.bg };

  if (!keyboard) {
    return (
      <SafeAreaView style={[styles.root, background]}>
        <View style={styles.content}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.root, background]}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1, padding: spacing.xl },
  scrollContent: { flexGrow: 1, padding: spacing.xl },
});
