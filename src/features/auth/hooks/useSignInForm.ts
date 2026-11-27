/**
 * State and actions of the sign-in form: field values, the current error,
 * the pending request, and filling in the demo account.
 */
import * as Haptics from 'expo-haptics';
import { useState } from 'react';

import { DEMO_ACCOUNT } from '../data/demoAccount';
import { AuthError, signIn } from '../lib/authService';
import {
  AuthErrorCode,
  type AuthErrorCodeValue,
  authErrorMessages,
  errorField,
  type SignInFieldValue,
} from '../model/constants';
import { signedIn } from '../model/slice';

import { useAppDispatch } from '@/store/hooks';

export type SignInError = { field: SignInFieldValue | null; message: string };

const toError = (code: AuthErrorCodeValue): SignInError => ({
  field: errorField[code],
  message: authErrorMessages[code],
});

export function useSignInForm() {
  const dispatch = useAppDispatch();
  const [identifier, setIdentifierValue] = useState('');
  const [password, setPasswordValue] = useState('');
  const [error, setError] = useState<SignInError | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Editing a field clears the error: the driver is already fixing it.
  const setIdentifier = (value: string) => {
    setIdentifierValue(value);
    setError(null);
  };
  const setPassword = (value: string) => {
    setPasswordValue(value);
    setError(null);
  };

  const fillDemoAccount = () => {
    setIdentifierValue(DEMO_ACCOUNT.email);
    setPasswordValue(DEMO_ACCOUNT.password);
    setError(null);
  };

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      dispatch(signedIn(await signIn({ identifier, password })));
    } catch (cause) {
      const code = cause instanceof AuthError ? cause.code : AuthErrorCode.wrongCredentials;
      setError(toError(code));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
      setSubmitting(false);
    }
  };

  return {
    identifier,
    password,
    error,
    submitting,
    setIdentifier,
    setPassword,
    fillDemoAccount,
    submit,
  };
}
