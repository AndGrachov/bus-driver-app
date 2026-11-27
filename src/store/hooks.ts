/**
 * Typed Redux hooks. Kept free of runtime imports from the store setup, so
 * feature code can use them without pulling every feature in (import cycle).
 */
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from './store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
