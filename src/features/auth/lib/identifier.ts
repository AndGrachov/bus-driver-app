/**
 * Drivers sign in with whatever they remember: a phone number or an email.
 * Both are normalised so "+49 151 234-5678" and "+491512345678" match.
 */
import { IdentifierKind, type IdentifierKindValue } from '../model/constants';

export type Identifier = { kind: IdentifierKindValue; value: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** E.164 allows up to 15 digits; 7 keeps out obvious typos. */
const PHONE = /^\+?\d{7,15}$/;
const PHONE_SEPARATORS = /[\s\-().]/g;

export function parseIdentifier(input: string): Identifier | null {
  const trimmed = input.trim();
  if (trimmed.includes('@')) {
    return EMAIL.test(trimmed) ? { kind: IdentifierKind.email, value: trimmed.toLowerCase() } : null;
  }
  const digits = trimmed.replace(PHONE_SEPARATORS, '');
  return PHONE.test(digits) ? { kind: IdentifierKind.phone, value: digits } : null;
}
