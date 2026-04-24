import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useLeaderboard } from './useLeaderboard';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

vi.stubGlobal('localStorage', localStorageMock);

describe('useLeaderboard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with an empty list when localStorage is empty', () => {
    const { entries } = useLeaderboard();
    expect(entries.value).toHaveLength(0);
  });

  it('adds a score entry', () => {
    const { entries, addScore } = useLeaderboard();
    addScore(1234);
    expect(entries.value).toHaveLength(1);
    expect(entries.value[0].score).toBe(1234);
  });

  it('ignores a score of 0', () => {
    const { entries, addScore } = useLeaderboard();
    addScore(0);
    expect(entries.value).toHaveLength(0);
  });

  it('keeps entries sorted by score descending', () => {
    const { entries, addScore } = useLeaderboard();
    addScore(100);
    addScore(500);
    addScore(300);
    expect(entries.value.map((e) => e.score)).toEqual([500, 300, 100]);
  });

  it('caps entries at 10', () => {
    const { entries, addScore } = useLeaderboard();
    for (let i = 1; i <= 12; i++) addScore(i * 100);
    expect(entries.value).toHaveLength(10);
    expect(entries.value[0].score).toBe(1200);
  });

  it('persists entries to localStorage', () => {
    const { addScore } = useLeaderboard();
    addScore(999);
    const { entries } = useLeaderboard();
    expect(entries.value[0].score).toBe(999);
  });

  it('clears all entries', () => {
    const { entries, addScore, clearLeaderboard } = useLeaderboard();
    addScore(500);
    clearLeaderboard();
    expect(entries.value).toHaveLength(0);
  });

  it('stores a valid ISO date with each entry', () => {
    const { entries, addScore } = useLeaderboard();
    addScore(42);
    expect(() => new Date(entries.value[0].date)).not.toThrow();
    expect(new Date(entries.value[0].date).getTime()).not.toBeNaN();
  });
});
