<script setup lang="ts">
import type { LeaderboardEntry } from '../types/leaderboard';

defineProps<{
  entries: LeaderboardEntry[];
}>();

const emit = defineEmits<{
  clear: [];
}>();

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}
</script>

<template>
  <aside class="score-history" aria-label="Score history">
    <div class="history-header">
      <span class="history-label">history</span>
      <button v-if="entries.length > 0" class="clear-btn" @click="emit('clear')">clear</button>
    </div>

    <div class="history-body">
      <div v-if="entries.length === 0" class="empty-state">
        <span class="empty-icon">◌</span>
        <span>no scores yet</span>
      </div>

      <ul v-else class="score-list">
        <li
          v-for="(entry, index) in entries"
          :key="index"
          class="score-row"
          :class="{ 'score-row--top': index === 0 }"
        >
          <span class="row-rank">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="row-score">{{ entry.score.toLocaleString() }}</span>
          <span class="row-date">{{ formatDate(entry.date) }}</span>
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped>
.score-history {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 190px;
  flex-shrink: 0;
  align-self: flex-start;
  backdrop-filter: blur(20px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 16px 32px rgba(0, 0, 0, 0.3);
}

.history-header {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.history-label {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 700;
  color: var(--text-secondary);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.clear-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: color 0.15s;
}

.clear-btn:hover {
  color: #ef4444;
}

.history-body {
  padding: 10px 0;
  overflow-y: auto;
  max-height: 380px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 16px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.empty-icon {
  font-size: 1.5rem;
  opacity: 0.3;
}

.score-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.score-row {
  display: grid;
  grid-template-columns: 24px 1fr auto;
  align-items: baseline;
  gap: 8px;
  padding: 7px 16px;
  transition: background 0.1s;
}

.score-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.row-rank {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.score-row--top .row-rank {
  color: var(--accent);
}

.row-score {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.score-row--top .row-score {
  color: var(--accent);
}

.row-date {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
  white-space: nowrap;
}
</style>
