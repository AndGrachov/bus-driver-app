/**
 * Launch-time hook for the root layout: starts restoring saved state on mount
 * and returns true once it is done.
 */
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from './hooks';
import { selectIsHydrated } from './hydrationSlice';
import { hydrateStore } from './persistence';

export function useStoreHydration(): boolean {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(hydrateStore());
  }, [dispatch]);
  return useAppSelector(selectIsHydrated);
}
