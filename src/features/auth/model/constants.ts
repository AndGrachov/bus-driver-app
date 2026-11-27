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

/** Copy says what happened and what to do next. */
export const authErrorMessages: Record<AuthErrorCodeValue, string> = {
  [AuthErrorCode.invalidIdentifier]: 'Enter your phone number with country code, or your email address.',
  [AuthErrorCode.passwordTooShort]: `Password needs at least ${MIN_PASSWORD_LENGTH} characters.`,
  [AuthErrorCode.wrongCredentials]:
    'Phone, email or password is wrong. Check them or use the demo account.',
};
