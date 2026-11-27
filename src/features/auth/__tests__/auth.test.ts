import { DEMO_ACCOUNT } from '../data/demoAccount';
import { AuthError, signIn, validateCredentials } from '../lib/authService';
import { parseIdentifier } from '../lib/identifier';
import { AuthErrorCode, SIGN_IN_DELAY_MS } from '../model/constants';

describe('parseIdentifier', () => {
  it('normalises phone numbers typed with spaces, dashes and brackets', () => {
    expect(parseIdentifier(' +49 (151) 234-5678 ')).toEqual({ kind: 'phone', value: '+491512345678' });
  });

  it('lower-cases emails', () => {
    expect(parseIdentifier('Driver@Depot.TEST')).toEqual({ kind: 'email', value: 'driver@depot.test' });
  });

  it('rejects things that are neither', () => {
    expect(parseIdentifier('')).toBeNull();
    expect(parseIdentifier('driver@')).toBeNull();
    expect(parseIdentifier('12345')).toBeNull();
    expect(parseIdentifier('call me')).toBeNull();
  });
});

describe('validateCredentials', () => {
  it('points at the identifier first, then the password', () => {
    expect(validateCredentials({ identifier: 'x', password: '' })).toBe(AuthErrorCode.invalidIdentifier);
    expect(validateCredentials({ identifier: DEMO_ACCOUNT.email, password: '12' })).toBe(
      AuthErrorCode.passwordTooShort,
    );
    expect(validateCredentials({ identifier: DEMO_ACCOUNT.email, password: '1234' })).toBeNull();
  });
});

describe('signIn', () => {
  const now = () => new Date('2026-12-02T05:00:00.000Z');

  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  const run = async (identifier: string, password: string) => {
    const pending = signIn({ identifier, password }, now);
    jest.advanceTimersByTime(SIGN_IN_DELAY_MS);
    return pending;
  };

  it('signs in the demo driver by email or by phone', async () => {
    await expect(run(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password)).resolves.toEqual({
      driverId: DEMO_ACCOUNT.driverId,
      driverName: DEMO_ACCOUNT.driverName,
      identifier: DEMO_ACCOUNT.email,
      signedInAt: '2026-12-02T05:00:00.000Z',
    });
    await expect(run(DEMO_ACCOUNT.phoneDisplay, DEMO_ACCOUNT.password)).resolves.toMatchObject({
      identifier: DEMO_ACCOUNT.phone,
    });
  });

  it('rejects a wrong password with a typed error', async () => {
    await expect(run(DEMO_ACCOUNT.email, 'wrong-one')).rejects.toEqual(
      new AuthError(AuthErrorCode.wrongCredentials),
    );
  });

  it('fails format problems without waiting', async () => {
    await expect(signIn({ identifier: 'nope', password: 'demo1234' })).rejects.toMatchObject({
      code: AuthErrorCode.invalidIdentifier,
    });
  });
});
