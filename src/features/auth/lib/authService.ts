/**
 * Mock sign-in. Format checks run first and fail instantly (no fake wait for
 * a typo); then a short delay stands in for the network and the credentials
 * are compared with the demo account.
 */
import { DEMO_ACCOUNT } from '../data/demoAccount';
import { AuthErrorCode, type AuthErrorCodeValue, MIN_PASSWORD_LENGTH, SIGN_IN_DELAY_MS } from '../model/constants';
import type { Session } from '../model/slice';

import { parseIdentifier } from './identifier';

export class AuthError extends Error {
  constructor(readonly code: AuthErrorCodeValue) {
    super(code);
    this.name = 'AuthError';
  }
}

export type Credentials = { identifier: string; password: string };

/** Returns the first format problem, or null when the form can be sent. */
export function validateCredentials({ identifier, password }: Credentials): AuthErrorCodeValue | null {
  if (!parseIdentifier(identifier)) return AuthErrorCode.invalidIdentifier;
  if (password.length < MIN_PASSWORD_LENGTH) return AuthErrorCode.passwordTooShort;
  return null;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function signIn(credentials: Credentials, now: () => Date = () => new Date()): Promise<Session> {
  const problem = validateCredentials(credentials);
  if (problem) throw new AuthError(problem);

  await wait(SIGN_IN_DELAY_MS);

  const identifier = parseIdentifier(credentials.identifier);
  const knownIdentifier =
    identifier?.value === DEMO_ACCOUNT.email || identifier?.value === DEMO_ACCOUNT.phone;
  if (!identifier || !knownIdentifier || credentials.password !== DEMO_ACCOUNT.password) {
    throw new AuthError(AuthErrorCode.wrongCredentials);
  }

  return {
    driverId: DEMO_ACCOUNT.driverId,
    driverName: DEMO_ACCOUNT.driverName,
    identifier: identifier.value,
    signedInAt: now().toISOString(),
  };
}
