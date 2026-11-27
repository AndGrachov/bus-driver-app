/**
 * App-wide actions that every persisted slice reacts to. They live apart from
 * the store setup so feature slices can import them without an import cycle.
 */
import { createAction } from '@reduxjs/toolkit';

import type { PersistedSnapshot } from './persistence';

/** Saved state restored from the device; slices take their part if present. */
export const stateRehydrated = createAction<PersistedSnapshot>('app/stateRehydrated');

/** "Reset demo data": every slice returns to its initial state. */
export const appReset = createAction('app/reset');
