/**
 * Typed Redux hooks plus the launch-time hydration hook.
 */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectIsHydrated } from './hydrationSlice';
import { hydrateStore } from './persistence';
import type { AppDispatch, RootState } from './store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

/** Starts restoring saved state on mount; returns true once it is done. */
export function useStoreHydration(): boolean {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(hydrateStore());
  }, [dispatch]);
  return useAppSelector(selectIsHydrated);
}
