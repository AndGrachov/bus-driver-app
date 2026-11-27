/**
 * Tracks whether saved state has been restored. Screens that depend on saved
 * data (session, statuses) render only after `done`, so a driver never sees
 * a flash of the default state.
 */
import { createSlice } from '@reduxjs/toolkit';

import { stateRehydrated } from './actions';

export const HydrationStatus = { idle: 'idle', loading: 'loading', done: 'done' } as const;
export type HydrationStatusValue = (typeof HydrationStatus)[keyof typeof HydrationStatus];

type HydrationState = { status: HydrationStatusValue };

const initialState: HydrationState = { status: HydrationStatus.idle };

export const hydrationSlice = createSlice({
  name: 'hydration',
  initialState,
  reducers: {
    hydrationStarted(state) {
      state.status = HydrationStatus.loading;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(stateRehydrated, (state) => {
      state.status = HydrationStatus.done;
    });
  },
});

export const { hydrationStarted } = hydrationSlice.actions;

export const selectIsHydrated = (state: { hydration: HydrationState }): boolean =>
  state.hydration.status === HydrationStatus.done;
