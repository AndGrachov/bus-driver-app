/**
 * Sign-in screen content: brand, the phone-or-email form on a card, and a
 * one-tap demo driver at the bottom for people trying the app.
 */
import { type ComponentRef, useRef, useState } from 'react';
import { Text, type TextInput, View } from 'react-native';

import { DEMO_ACCOUNT } from '../../data/demoAccount';
import { useSignInForm } from '../../hooks/useSignInForm';
import { SignInField, type SignInFieldValue } from '../../model/constants';
import { DemoDriverTile } from '../DemoDriverTile/DemoDriverTile';

import { useStyles } from './useStyles';

import { Button, FieldTone, Icon, IconName, TextField } from '@/shared/ui';

export function SignInForm() {
  const { styles, colors, logoIconSize } = useStyles();
  const form = useSignInForm();
  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const fieldError = (field: SignInFieldValue) =>
    form.error?.field === field ? form.error.message : null;
  const formError = form.error && form.error.field === null ? form.error.message : null;

  return (
    <View style={styles.root}>
      <View style={styles.brand}>
        <View style={styles.logo}>
          <Icon name={IconName.steeringWheel} color={colors.onAccent} size={logoIconSize} />
        </View>
        <Text style={styles.wordmark}>Driver</Text>
      </View>

      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          Sign in
        </Text>
        <Text style={styles.lead}>See today’s shifts, stops and passengers.</Text>
      </View>

      <View style={styles.card}>
        <TextField
          label="Phone or email"
          tone={FieldTone.inset}
          value={form.identifier}
          onChangeText={form.setIdentifier}
          error={fieldError(SignInField.identifier)}
          invalid={formError !== null}
          placeholder="+49 151 2345678"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="username"
          textContentType="username"
          keyboardType="email-address"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <TextField
          ref={passwordRef}
          label="Password"
          tone={FieldTone.inset}
          value={form.password}
          onChangeText={form.setPassword}
          // Wrong credentials belong to the pair; the message takes the
          // password's reserved line so the layout stays still.
          error={fieldError(SignInField.password) ?? formError}
          secureTextEntry={!passwordVisible}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={form.submit}
          accessory={{
            icon: passwordVisible ? IconName.eyeOff : IconName.eye,
            label: passwordVisible ? 'Hide password' : 'Show password',
            onPress: () => setPasswordVisible((visible) => !visible),
          }}
        />
        <Button
          label={form.submitting ? 'Signing in' : 'Sign in'}
          onPress={form.submit}
          loading={form.submitting}
        />
      </View>

      <View style={styles.demo}>
        <Text style={styles.demoTitle}>Just looking around?</Text>
        <DemoDriverTile
          name={DEMO_ACCOUNT.driverName}
          onPress={form.signInAsDemo}
          busy={form.submitting}
          disabled={form.submitting}
        />
      </View>
    </View>
  );
}
