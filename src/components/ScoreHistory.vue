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
    year: 'numeric',
  });
}
</script>

<template>
  <aside class="score-history" aria-label="Score history">
    <div class="history-header">
      <h2 class="history-title">Score History</h2>
    </div>

    <div class="history-body">
      <table v-if="entries.length > 0" class="history-table">
        <thead>
          <tr>
            <th class="col-rank">#</th>
            <th class="col-score">Score</th>
            <th class="col-date">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(entry, index) in entries"
            :key="index"
            :class="{ 'top-entry': index === 0 }"
          >
            <td class="col-rank">{{ index + 1 }}</td>
            <td class="col-score">{{ entry.score.toLocaleString() }}</td>
            <td class="col-date">{{ formatDate(entry.date) }}</td>
          </tr>
        </tbody>
      </table>

      <p v-else class="empty-state">No scores yet.<br />Play a game to get on the board!</p>
    </div>

    <div v-if="entries.length > 0" class="history-footer">
      <button class="clear-btn" @click="emit('clear')">Clear All</button>
    </div>
  </aside>
</template>

<style scoped>
.score-history {
  background: #f0ebe3;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 200px;
  flex-shrink: 0;
  align-self: flex-start;
}

.history-header {
  padding: 14px 16px;
  background: #bbada0;
}

.history-title {
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #f9f6f2;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.history-body {
  padding: 12px 16px;
  overflow-y: auto;
  max-height: 400px;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
}

.history-table th {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #bbada0;
  padding: 0 4px 8px;
  text-align: left;
  border-bottom: 2px solid #d8d0c8;
}

.history-table td {
  padding: 8px 4px;
  font-size: 0.85rem;
  color: #776e65;
  border-bottom: 1px solid #d8d0c8;
}

.history-table tbody tr:last-child td {
  border-bottom: none;
}

.top-entry td {
  font-weight: 700;
  color: #f65e3b;
}

.col-rank {
  width: 24px;
}

.col-score {
  font-variant-numeric: tabular-nums;
}

.col-date {
  color: #a09080;
  font-size: 0.75rem;
  text-align: right;
}

.empty-state {
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
  font-size: 0.85rem;
  color: #a09080;
  text-align: center;
  margin: 12px 0;
  line-height: 1.6;
}

.history-footer {
  padding: 10px 16px;
  border-top: 1px solid #d8d0c8;
  display: flex;
  justify-content: flex-end;
}

.clear-btn {
  background: none;
  border: 1px solid #bbada0;
  color: #8f7a66;
  border-radius: 4px;
  padding: 5px 12px;
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.1s, color 0.1s;
}

.clear-btn:hover {
  background-color: #bbada0;
  color: #f9f6f2;
}
</style>
