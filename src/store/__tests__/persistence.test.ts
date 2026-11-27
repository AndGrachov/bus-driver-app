import AsyncStorage from '@react-native-async-storage/async-storage';

import { PERSIST_VERSION, STORAGE_KEY } from '../persistence';
import { hydrateStore, makeStore, resetAppData, selectIsHydrated } from '../index';

import { selectThemeMode, themeModeChanged } from '@/features/settings';
import { ThemeModes } from '@/shared/theme/theme';

/** Lets the listener middleware finish its async write. */
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

const saved = async () => JSON.parse((await AsyncStorage.getItem(STORAGE_KEY)) ?? 'null');

const save = (value: unknown) => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

describe('persistence', () => {
  it('starts with defaults when nothing is saved', async () => {
    const store = makeStore();
    await store.dispatch(hydrateStore());
    expect(selectIsHydrated(store.getState())).toBe(true);
    expect(selectThemeMode(store.getState())).toBe(ThemeModes.system);
  });

  it('saves a change and restores it in a new session', async () => {
    const first = makeStore();
    await first.dispatch(hydrateStore());
    first.dispatch(themeModeChanged(ThemeModes.light));
    await flush();
    expect(await saved()).toEqual({
      version: PERSIST_VERSION,
      state: { settings: { themeMode: ThemeModes.light } },
    });

    const second = makeStore();
    await second.dispatch(hydrateStore());
    expect(selectThemeMode(second.getState())).toBe(ThemeModes.light);
  });

  it('does not overwrite saved data before hydration finishes', async () => {
    await save({ version: PERSIST_VERSION, state: { settings: { themeMode: ThemeModes.dark } } });
    const store = makeStore();
    store.dispatch(themeModeChanged(ThemeModes.light));
    await flush();
    expect((await saved()).state.settings.themeMode).toBe(ThemeModes.dark);
  });

  it('falls back to defaults for corrupted JSON, an old version or a broken slice', async () => {
    for (const bad of [
      '{not json',
      JSON.stringify({ version: PERSIST_VERSION - 1, state: { settings: { themeMode: 'dark' } } }),
      JSON.stringify({ version: PERSIST_VERSION, state: { settings: { themeMode: 'sepia' } } }),
    ]) {
      await AsyncStorage.setItem(STORAGE_KEY, bad);
      const store = makeStore();
      await store.dispatch(hydrateStore());
      expect(selectIsHydrated(store.getState())).toBe(true);
      expect(selectThemeMode(store.getState())).toBe(ThemeModes.system);
    }
  });

  it('hydrates only once even if asked twice', async () => {
    await save({ version: PERSIST_VERSION, state: { settings: { themeMode: ThemeModes.dark } } });
    const store = makeStore();
    const firstRun = store.dispatch(hydrateStore());
    const secondRun = store.dispatch(hydrateStore());
    await Promise.all([firstRun, secondRun]);
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(1);
    expect(selectThemeMode(store.getState())).toBe(ThemeModes.dark);
  });

  it('reset wipes saved data and restores defaults', async () => {
    const store = makeStore();
    await store.dispatch(hydrateStore());
    store.dispatch(themeModeChanged(ThemeModes.dark));
    await flush();
    await store.dispatch(resetAppData());
    await flush();
    expect(selectThemeMode(store.getState())).toBe(ThemeModes.system);
    expect((await saved()).state.settings.themeMode).toBe(ThemeModes.system);
  });
});
