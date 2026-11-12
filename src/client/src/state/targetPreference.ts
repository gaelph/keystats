export const TARGET_PREFERENCE_KEY = "keystats.comparison.target";
export interface TargetStorage { getItem(key: string): string | null; setItem(key: string, value: string): void }

export function browserTargetStorage(): TargetStorage | undefined {
  try { return window.localStorage; } catch { return undefined; }
}
export function readTarget(storage?: TargetStorage): string | null {
  try { return storage?.getItem(TARGET_PREFERENCE_KEY) || null; } catch { return null; }
}
export function saveTarget(storage: TargetStorage | undefined, id: string | null) {
  try { if (id) storage?.setItem(TARGET_PREFERENCE_KEY, id); } catch { /* Memory remains authoritative when storage is denied. */ }
}
