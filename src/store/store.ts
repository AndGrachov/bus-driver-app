/**
 * Store factory. The app creates one store at the root; tests create their own.
 */
import { combineReducers, configureStore, type ThunkAction, type UnknownAction } from '@reduxjs/toolkit';

import { hydrationSlice } from './hydrationSlice';
import { createPersistenceMiddleware } from './persistence';

import { settingsSlice } from '@/features/settings';

const rootReducer = combineReducers({
  [hydrationSlice.name]: hydrationSlice.reducer,
  [settingsSlice.name]: settingsSlice.reducer,
});

export function makeStore() {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefault) => getDefault().prepend(createPersistenceMiddleware()),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<R = void> = ThunkAction<R, RootState, unknown, UnknownAction>;
