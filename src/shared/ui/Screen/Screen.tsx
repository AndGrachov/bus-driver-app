/**
 * Screen frame: themed background, safe areas and screen padding. With
 * `keyboard` the content scrolls and moves above the iOS keyboard, so the
 * primary button stays reachable while typing.
 */
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStyles } from './useStyles';

type Props = { children: ReactNode; keyboard?: boolean };

export function Screen({ children, keyboard = false }: Props) {
  const { styles } = useStyles();

  if (!keyboard) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.content}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        style={styles.fill}
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
