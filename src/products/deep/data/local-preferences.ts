const memory = new Map<string, unknown>();
export function readPreference<T>(key: string, fallback: T): T {
    if (memory.has(key))
        return memory.get(key) as T;
    try {
        const raw = localStorage.getItem(key);
        if (raw)
            return JSON.parse(raw) as T;
    }
    catch { /* Memory remains available for this session. */ }
    return (memory.get(key) as T) ?? fallback;
}
export function writePreference(key: string, value: unknown): boolean {
    memory.set(key, value);
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    }
    catch {
        return false;
    }
}
