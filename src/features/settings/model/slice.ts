/**
 * Driver preferences that outlive a session. For now only the theme mode;
 * the persisted shape is validated with `settingsStateSchema` on restore.
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { z } from 'zod';

import { appReset, stateRehydrated } from '@/store/actions';
import { type ThemeMode, ThemeModes } from '@/shared/theme/theme';

export const settingsStateSchema = z.object({
  themeMode: z.enum(ThemeModes),
});

export type SettingsState = z.infer<typeof settingsStateSchema>;

const initialState: SettingsState = { themeMode: ThemeModes.system };

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    themeModeChanged(state, action: PayloadAction<ThemeMode>) {
      state.themeMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(stateRehydrated, (state, action) => action.payload.settings ?? state)
      .addCase(appReset, () => initialState);
  },
});

export const { themeModeChanged } = settingsSlice.actions;

type WithSettings = { settings: SettingsState };

export const selectThemeMode = (state: WithSettings): ThemeMode => state.settings.themeMode;
