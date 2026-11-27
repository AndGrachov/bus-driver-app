/**
 * Sign-in form: phone or email plus password. The primary button sits in the
 * thumb zone; the demo account can be filled in with one tap.
 */
import { type ComponentRef, useRef, useState } from 'react';
import { Text, type TextInput, View } from 'react-native';

import { useSignInForm } from '../../hooks/useSignInForm';
import { SignInField } from '../../model/constants';

import { useStyles } from './useStyles';

import { Button, ButtonVariant, TextField } from '@/shared/ui';

export function SignInForm() {
  const { styles } = useStyles();
  const form = useSignInForm();
  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const fieldError = (field: string) => (form.error?.field === field ? form.error.message : null);
  const formError = form.error && form.error.field === null ? form.error.message : null;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.wordmark}>Driver</Text>
        <Text accessibilityRole="header" style={styles.title}>
          Sign in to see your shifts
        </Text>
        <Text style={styles.lead}>Use your phone number or email and the password from dispatch.</Text>
      </View>

      <View style={styles.fields}>
        <TextField
          label="Phone or email"
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
          value={form.password}
          onChangeText={form.setPassword}
          error={fieldError(SignInField.password)}
          invalid={formError !== null}
          secureTextEntry={!passwordVisible}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={form.submit}
          accessory={{
            label: passwordVisible ? 'Hide' : 'Show',
            onPress: () => setPasswordVisible((visible) => !visible),
          }}
        />
        {formError ? (
          <Text accessibilityLiveRegion="polite" accessibilityRole="alert" style={styles.formError}>
            {formError}
          </Text>
        ) : null}
      </View>

      <View style={styles.footer}>
        <Button
          label={form.submitting ? 'Signing in' : 'Sign in'}
          onPress={form.submit}
          loading={form.submitting}
        />
        <Text style={styles.demoHint}>Trying the app? Sign in as the demo driver.</Text>
        <Button
          label="Fill in demo account"
          variant={ButtonVariant.secondary}
          onPress={form.fillDemoAccount}
          disabled={form.submitting}
        />
      </View>
    </View>
  );
}
