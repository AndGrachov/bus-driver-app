/**
 * Thin JSON wrapper over AsyncStorage. Reading never throws on bad data:
 * a missing key or unparsable JSON comes back as `null`, so a corrupted
 * device store degrades to defaults instead of crashing on launch.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function readJson(key: string): Promise<unknown> {
  const raw = await AsyncStorage.getItem(key);
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

export const writeJson = (key: string, value: unknown): Promise<void> =>
  AsyncStorage.setItem(key, JSON.stringify(value));

export const removeItem = (key: string): Promise<void> => AsyncStorage.removeItem(key);
