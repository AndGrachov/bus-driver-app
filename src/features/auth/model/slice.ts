/**
 * The signed-in driver. The session is persisted, so a driver who closes the
 * app mid-shift lands straight back on their assignments.
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { z } from 'zod';

import { appReset, stateRehydrated } from '@/store/actions';

export const sessionSchema = z.object({
  driverId: z.string().min(1),
  driverName: z.string().min(1),
  /** What the driver typed to sign in, normalised (lower-case email or +digits). */
  identifier: z.string().min(1),
  signedInAt: z.iso.datetime({ offset: true }),
});

export type Session = z.infer<typeof sessionSchema>;

export const authStateSchema = z.object({ session: sessionSchema.nullable() });
export type AuthState = z.infer<typeof authStateSchema>;

const initialState: AuthState = { session: null };

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signedIn(state, action: PayloadAction<Session>) {
      state.session = action.payload;
    },
    signedOut(state) {
      state.session = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(stateRehydrated, (state, action) => action.payload.auth ?? state)
      .addCase(appReset, () => initialState);
  },
});

export const { signedIn, signedOut } = authSlice.actions;

type WithAuth = { auth: AuthState };

export const selectSession = (state: WithAuth): Session | null => state.auth.session;
export const selectIsSignedIn = (state: WithAuth): boolean => state.auth.session !== null;
