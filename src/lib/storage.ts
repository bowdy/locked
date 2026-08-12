import AsyncStorage from '@react-native-async-storage/async-storage';
import { SCORE_SECTION } from '../data/checklist';

/** Map of item id -> checked, for one day. */
export type DayState = Record<string, boolean>;

const DAY_PREFIX = 'day:';

export async function loadDay(key: string): Promise<DayState> {
  try {
    const raw = await AsyncStorage.getItem(DAY_PREFIX + key);
    return raw ? (JSON.parse(raw) as DayState) : {};
  } catch {
    return {};
  }
}

export async function saveDay(key: string, state: DayState): Promise<void> {
  try {
    await AsyncStorage.setItem(DAY_PREFIX + key, JSON.stringify(state));
  } catch {
    // Persistence is best-effort; the in-memory state stays authoritative for the session.
  }
}

export interface DayRecord {
  key: string;
  state: DayState;
  score: number;
  checkedCount: number;
}

export function scoreOf(state: DayState): number {
  return SCORE_SECTION.items.reduce((n, item) => n + (state[item.id] ? 1 : 0), 0);
}

export async function loadHistory(): Promise<DayRecord[]> {
  try {
    const keys = (await AsyncStorage.getAllKeys()).filter((k) => k.startsWith(DAY_PREFIX));
    const pairs = await AsyncStorage.multiGet(keys);
    const records: DayRecord[] = [];
    for (const [storageKey, raw] of pairs) {
      if (!raw) continue;
      let state: DayState;
      try {
        state = JSON.parse(raw) as DayState;
      } catch {
        continue;
      }
      const checkedCount = Object.values(state).filter(Boolean).length;
      if (checkedCount === 0) continue;
      records.push({
        key: storageKey.slice(DAY_PREFIX.length),
        state,
        score: scoreOf(state),
        checkedCount,
      });
    }
    records.sort((a, b) => (a.key < b.key ? 1 : -1));
    return records;
  } catch {
    return [];
  }
}
