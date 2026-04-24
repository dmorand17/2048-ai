import { ref } from 'vue';
import type { LeaderboardEntry } from '../types/leaderboard';

const STORAGE_KEY = '2048-leaderboard';
const MAX_ENTRIES = 10;

function loadEntries(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LeaderboardEntry[]) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: LeaderboardEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Ignore storage errors
  }
}

export function useLeaderboard() {
  const entries = ref<LeaderboardEntry[]>(loadEntries());

  function addScore(score: number): void {
    if (score === 0) return;
    const updated = [...entries.value, { score, date: new Date().toISOString() }]
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_ENTRIES);
    entries.value = updated;
    saveEntries(updated);
  }

  function clearLeaderboard(): void {
    entries.value = [];
    saveEntries([]);
  }

  return { entries, addScore, clearLeaderboard };
}
