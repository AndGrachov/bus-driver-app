/**
 * Auth constants: error codes, form fields and the mock network delay.
 */

export const AuthErrorCode = {
  invalidIdentifier: 'invalid_identifier',
  passwordTooShort: 'password_too_short',
  wrongCredentials: 'wrong_credentials',
} as const;
export type AuthErrorCodeValue = (typeof AuthErrorCode)[keyof typeof AuthErrorCode];

export const SignInField = { identifier: 'identifier', password: 'password' } as const;
export type SignInFieldValue = (typeof SignInField)[keyof typeof SignInField];

export const IdentifierKind = { email: 'email', phone: 'phone' } as const;
export type IdentifierKindValue = (typeof IdentifierKind)[keyof typeof IdentifierKind];

export const MIN_PASSWORD_LENGTH = 4;

/** Feels like a real request without slowing the demo down. */
export const SIGN_IN_DELAY_MS = 700;

/** Which field an error belongs to, so the form can mark it. */
export const errorField: Record<AuthErrorCodeValue, SignInFieldValue | null> = {
  [AuthErrorCode.invalidIdentifier]: SignInField.identifier,
  [AuthErrorCode.passwordTooShort]: SignInField.password,
  [AuthErrorCode.wrongCredentials]: null,
};

/**
 * Copy says what happened and what to do next. Each message fits one line on
 * a small phone: it sits in a reserved slot under the field, so the form
 * never jumps when an error appears.
 */
export const authErrorMessages: Record<AuthErrorCodeValue, string> = {
  [AuthErrorCode.invalidIdentifier]: 'Use a phone with country code or an email.',
  [AuthErrorCode.passwordTooShort]: `Use at least ${MIN_PASSWORD_LENGTH} characters.`,
  [AuthErrorCode.wrongCredentials]: 'Wrong phone, email or password.',
};
