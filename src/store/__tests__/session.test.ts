import AsyncStorage from '@react-native-async-storage/async-storage';

import { hydrateStore, makeStore } from '../index';

import { selectIsSignedIn, signedIn, signedOut } from '@/features/auth';

const session = {
  driverId: 'drv-014',
  driverName: 'Test Driver',
  identifier: 'driver@depot.test',
  signedInAt: '2026-12-02T05:00:00.000Z',
};

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('session persistence', () => {
  it('keeps the driver signed in across restarts until they sign out', async () => {
    const first = makeStore();
    await first.dispatch(hydrateStore());
    first.dispatch(signedIn(session));
    await flush();

    const second = makeStore();
    await second.dispatch(hydrateStore());
    expect(selectIsSignedIn(second.getState())).toBe(true);

    second.dispatch(signedOut());
    await flush();
    const third = makeStore();
    await third.dispatch(hydrateStore());
    expect(selectIsSignedIn(third.getState())).toBe(false);
  });
});
