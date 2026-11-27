/**
 * Saves the persisted slices to the device and restores them on launch.
 *
 * - One storage key holds a versioned envelope with every persisted slice, so
 *   a save is a single atomic write.
 * - Each slice is validated with its own zod schema on restore: a broken or
 *   outdated slice falls back to its defaults without wiping the others.
 * - Saving is immediate, not debounced: a status change must survive the
 *   driver locking the phone a second later, and the payload is tiny.
 * - Nothing is written before hydration finishes, otherwise defaults would
 *   overwrite the saved state on launch.
 *
 * To persist a new slice, add its schema to `persistedSchemas`.
 */
import { createListenerMiddleware } from '@reduxjs/toolkit';
import { z } from 'zod';

import { appReset, stateRehydrated } from './actions';
import { hydrationStarted, HydrationStatus } from './hydrationSlice';
import type { AppThunk, RootState } from './store';

import { authStateSchema } from '@/features/auth';
import { settingsStateSchema } from '@/features/settings';
import { readJson, removeItem, writeJson } from '@/shared/lib/storage';

export const STORAGE_KEY = 'bus-driver-app/state';

/** Bump when a persisted shape changes incompatibly; older saves are dropped. */
export const PERSIST_VERSION = 1;

const persistedSchemas = {
  auth: authStateSchema,
  settings: settingsStateSchema,
} as const;

type PersistedName = keyof typeof persistedSchemas;
const persistedNames = Object.keys(persistedSchemas) as PersistedName[];

export type PersistedSnapshot = Partial<{
  [K in PersistedName]: z.infer<(typeof persistedSchemas)[K]>;
}>;

const envelopeSchema = z.object({
  version: z.number(),
  state: z.record(z.string(), z.unknown()),
});

/** Reads and validates the saved state; anything unusable becomes `{}`. */
export async function readPersisted(): Promise<PersistedSnapshot> {
  let raw: unknown;
  try {
    raw = await readJson(STORAGE_KEY);
  } catch {
    return {};
  }
  const envelope = envelopeSchema.safeParse(raw);
  if (!envelope.success || envelope.data.version !== PERSIST_VERSION) return {};

  const snapshot: Record<string, unknown> = {};
  for (const name of persistedNames) {
    const parsed = persistedSchemas[name].safeParse(envelope.data.state[name]);
    if (parsed.success) snapshot[name] = parsed.data;
  }
  return snapshot as PersistedSnapshot;
}

const pickPersisted = (state: RootState): PersistedSnapshot =>
  Object.fromEntries(persistedNames.map((name) => [name, state[name]])) as PersistedSnapshot;

/** Restores saved state once; repeated calls (StrictMode effects) are no-ops. */
export const hydrateStore = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
  if (getState().hydration.status !== HydrationStatus.idle) return;
  dispatch(hydrationStarted());
  dispatch(stateRehydrated(await readPersisted()));
};

/** Wipes saved data and returns every slice to its defaults. */
export const resetAppData = (): AppThunk<Promise<void>> => async (dispatch) => {
  await removeItem(STORAGE_KEY);
  dispatch(appReset());
};

/** A fresh middleware per store, so tests get isolated instances. */
export function createPersistenceMiddleware() {
  const listener = createListenerMiddleware();
  listener.startListening({
    predicate: (action, current, previous) => {
      const state = current as RootState;
      const before = previous as RootState;
      if (state.hydration.status !== HydrationStatus.done) return false;
      if (stateRehydrated.match(action)) return false;
      return persistedNames.some((name) => state[name] !== before[name]);
    },
    effect: async (_action, api) => {
      const state = api.getState() as RootState;
      await writeJson(STORAGE_KEY, { version: PERSIST_VERSION, state: pickPersisted(state) });
    },
  });
  return listener.middleware;
}
