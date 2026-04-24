<script setup lang="ts">
import type { Board } from '../types/game';

defineProps<{
  board: Board;
}>();

function tileClass(value: number): string {
  if (value === 0) return 'tile tile-empty';
  return `tile tile-${value}`;
}

function tileLabel(value: number): string {
  return value === 0 ? '' : String(value);
}
</script>

<template>
  <div class="board">
    <div class="grid">
      <template v-for="(row, rowIndex) in board" :key="rowIndex">
        <div
          v-for="(cell, colIndex) in row"
          :key="`${rowIndex}-${colIndex}-${cell}`"
          :class="tileClass(cell)"
        >
          <span v-if="cell !== 0" class="tile-inner">{{ tileLabel(cell) }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.board {
  background-color: #bbada0;
  border-radius: 6px;
  padding: 12px;
  user-select: none;
  touch-action: none;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  width: 100%;
}

.tile {
  aspect-ratio: 1 / 1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 700;
  position: relative;
  overflow: hidden;
}

.tile-inner {
  animation: tile-pop 0.15s ease-out;
  display: block;
  font-size: clamp(1rem, 3vw, 2rem);
}

@keyframes tile-pop {
  0% {
    transform: scale(0);
  }
  80% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.tile-empty {
  background-color: #cdc1b4;
}

/* Tile value colors */
.tile-2 {
  background-color: #eee4da;
  color: #776e65;
  font-size: clamp(1.2rem, 3.5vw, 2.2rem);
}

.tile-4 {
  background-color: #ede0c8;
  color: #776e65;
  font-size: clamp(1.2rem, 3.5vw, 2.2rem);
}

.tile-8 {
  background-color: #f2b179;
  color: #f9f6f2;
  font-size: clamp(1.2rem, 3.5vw, 2.2rem);
}

.tile-16 {
  background-color: #f59563;
  color: #f9f6f2;
  font-size: clamp(1.2rem, 3.5vw, 2.2rem);
}

.tile-32 {
  background-color: #f67c5f;
  color: #f9f6f2;
  font-size: clamp(1.2rem, 3.5vw, 2.2rem);
}

.tile-64 {
  background-color: #f65e3b;
  color: #f9f6f2;
  font-size: clamp(1.2rem, 3.5vw, 2.2rem);
}

.tile-128 {
  background-color: #edcf72;
  color: #f9f6f2;
  font-size: clamp(1rem, 2.8vw, 1.8rem);
}

.tile-256 {
  background-color: #edcc61;
  color: #f9f6f2;
  font-size: clamp(1rem, 2.8vw, 1.8rem);
}

.tile-512 {
  background-color: #edc850;
  color: #f9f6f2;
  font-size: clamp(1rem, 2.8vw, 1.8rem);
}

.tile-1024 {
  background-color: #edc53f;
  color: #f9f6f2;
  font-size: clamp(0.85rem, 2.4vw, 1.5rem);
}

.tile-2048 {
  background-color: #edc22e;
  color: #f9f6f2;
  font-size: clamp(0.85rem, 2.4vw, 1.5rem);
  box-shadow:
    0 0 30px 10px rgba(243, 215, 116, 0.5),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3);
}

/* Larger values fallback */
.tile-4096,
.tile-8192 {
  background-color: #3c3a33;
  color: #f9f6f2;
  font-size: clamp(0.75rem, 2vw, 1.3rem);
}
</style>
