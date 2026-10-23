export const check = {
  ok(value: unknown, message = 'Expected truthy value') { if (!value) throw new Error(message); },
  equal(actual: unknown, expected: unknown) { if (actual !== expected) throw new Error(`Expected ${String(actual)} to equal ${String(expected)}`); },
  includes(actual: string, expected: string) { if (!actual.includes(expected)) throw new Error(`Missing ${expected}`); },
  excludes(actual: string, expected: string) { if (actual.includes(expected)) throw new Error(`Unexpected ${expected}`); },
  throws(run: () => unknown) { let failed = false; try { run(); } catch { failed = true; } if (!failed) throw new Error('Expected failure'); },
  async rejects(run: () => Promise<unknown>) { let failed = false; try { await run(); } catch { failed = true; } if (!failed) throw new Error('Expected rejected request'); },
};
