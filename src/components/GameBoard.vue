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
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 10px;
  user-select: none;
  touch-action: none;
  backdrop-filter: blur(20px);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 24px 48px rgba(0, 0, 0, 0.4);
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  width: 100%;
}

.tile {
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-weight: 700;
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.15s ease;
}

.tile-inner {
  animation: tile-pop 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: block;
  font-size: clamp(1rem, 3vw, 2rem);
  position: relative;
  z-index: 1;
}

@keyframes tile-pop {
  0%   { transform: scale(0.4); opacity: 0; }
  100% { transform: scale(1);   opacity: 1; }
}

.tile-empty {
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

/* --- Cold: low values (blue-cyan) --- */
.tile-2 {
  background: linear-gradient(135deg, #1a2744, #1e3a5f);
  color: #7eb8d4;
  border: 1px solid rgba(126, 184, 212, 0.2);
  font-size: clamp(1.2rem, 3.5vw, 2.2rem);
}

.tile-4 {
  background: linear-gradient(135deg, #1a2f52, #1e4870);
  color: #93c5e8;
  border: 1px solid rgba(147, 197, 232, 0.25);
  font-size: clamp(1.2rem, 3.5vw, 2.2rem);
}

.tile-8 {
  background: linear-gradient(135deg, #163a4a, #1a5060);
  color: #5ecfdf;
  border: 1px solid rgba(94, 207, 223, 0.3);
  font-size: clamp(1.2rem, 3.5vw, 2.2rem);
  box-shadow: 0 0 16px rgba(94, 207, 223, 0.1);
}

.tile-16 {
  background: linear-gradient(135deg, #0e3d3d, #145050);
  color: #3de8c8;
  border: 1px solid rgba(61, 232, 200, 0.3);
  font-size: clamp(1.2rem, 3.5vw, 2.2rem);
  box-shadow: 0 0 18px rgba(61, 232, 200, 0.12);
}

/* --- Warm transition (green-lime) --- */
.tile-32 {
  background: linear-gradient(135deg, #1a3d20, #1f5228);
  color: #6edf6e;
  border: 1px solid rgba(110, 223, 110, 0.3);
  font-size: clamp(1.2rem, 3.5vw, 2.2rem);
  box-shadow: 0 0 20px rgba(110, 223, 110, 0.12);
}

.tile-64 {
  background: linear-gradient(135deg, #253d12, #345218);
  color: #a8e832;
  border: 1px solid rgba(168, 232, 50, 0.35);
  font-size: clamp(1.2rem, 3.5vw, 2.2rem);
  box-shadow: 0 0 22px rgba(168, 232, 50, 0.15);
}

/* --- Hot (yellow-lime accent) --- */
.tile-128 {
  background: linear-gradient(135deg, #2d3d08, #3d5210);
  color: #c8f135;
  border: 1px solid rgba(200, 241, 53, 0.4);
  font-size: clamp(1rem, 2.8vw, 1.8rem);
  box-shadow: 0 0 24px rgba(200, 241, 53, 0.2);
}

.tile-256 {
  background: linear-gradient(135deg, #3a3d08, #4f5212);
  color: #d9f535;
  border: 1px solid rgba(217, 245, 53, 0.45);
  font-size: clamp(1rem, 2.8vw, 1.8rem);
  box-shadow: 0 0 28px rgba(217, 245, 53, 0.22);
}

.tile-512 {
  background: linear-gradient(135deg, #3d3208, #524410);
  color: #f5e135;
  border: 1px solid rgba(245, 225, 53, 0.45);
  font-size: clamp(1rem, 2.8vw, 1.8rem);
  box-shadow: 0 0 30px rgba(245, 225, 53, 0.25);
}

/* --- Scorching (orange-red) --- */
.tile-1024 {
  background: linear-gradient(135deg, #3d2208, #522e10);
  color: #f5a535;
  border: 1px solid rgba(245, 165, 53, 0.45);
  font-size: clamp(0.85rem, 2.4vw, 1.5rem);
  box-shadow: 0 0 32px rgba(245, 165, 53, 0.25);
}

.tile-2048 {
  background: linear-gradient(135deg, #3d1008, #521518);
  color: #ff6b35;
  border: 1px solid rgba(255, 107, 53, 0.5);
  font-size: clamp(0.85rem, 2.4vw, 1.5rem);
  box-shadow:
    0 0 40px rgba(255, 107, 53, 0.35),
    0 0 80px rgba(255, 107, 53, 0.12),
    inset 0 0 20px rgba(255, 107, 53, 0.08);
  animation: tile-2048-pulse 2s ease-in-out infinite alternate;
}

@keyframes tile-2048-pulse {
  from { box-shadow: 0 0 40px rgba(255, 107, 53, 0.35), 0 0 80px rgba(255, 107, 53, 0.12); }
  to   { box-shadow: 0 0 60px rgba(255, 107, 53, 0.55), 0 0 100px rgba(255, 107, 53, 0.2); }
}

.tile-4096,
.tile-8192 {
  background: linear-gradient(135deg, #2a0a2a, #3d0d3d);
  color: #e879f9;
  border: 1px solid rgba(232, 121, 249, 0.5);
  font-size: clamp(0.75rem, 2vw, 1.3rem);
  box-shadow: 0 0 40px rgba(232, 121, 249, 0.3);
}
</style>
