<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import GameBoard from './components/GameBoard.vue';
import GameHeader from './components/GameHeader.vue';
import GameMessage from './components/GameMessage.vue';
import ScoreHistory from './components/ScoreHistory.vue';
import { useGame } from './composables/useGame';
import { useLeaderboard } from './composables/useLeaderboard';

const { state, newGame, handleKeydown, handleSwipe } = useGame();
const { entries: leaderboardEntries, addScore, clearLeaderboard } = useLeaderboard();

function onNewGame(): void {
  if (state.score > 0) addScore(state.score);
  newGame();
}

function onRestart(): void {
  if (state.score > 0) addScore(state.score);
  newGame();
}

const boardRef = ref<HTMLElement | null>(null);
const touchStart = ref<{ x: number; y: number } | null>(null);

function onTouchStart(event: TouchEvent): void {
  const touch = event.touches[0];
  touchStart.value = { x: touch.clientX, y: touch.clientY };
}

function onTouchEnd(event: TouchEvent): void {
  if (!touchStart.value) return;
  const touch = event.changedTouches[0];
  handleSwipe(touchStart.value.x, touchStart.value.y, touch.clientX, touch.clientY);
  touchStart.value = null;
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  if (boardRef.value) {
    boardRef.value.addEventListener('touchstart', onTouchStart, { passive: true });
    boardRef.value.addEventListener('touchend', onTouchEnd, { passive: true });
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
  if (boardRef.value) {
    boardRef.value.removeEventListener('touchstart', onTouchStart);
    boardRef.value.removeEventListener('touchend', onTouchEnd);
  }
});
</script>

<template>
  <div class="app">
    <div class="noise-overlay"></div>
    <div class="glow-orb glow-orb--1"></div>
    <div class="glow-orb glow-orb--2"></div>

    <div class="layout">
      <div class="game-col">
        <div class="container">
          <GameHeader
            :score="state.score"
            :best-score="state.bestScore"
            @new-game="onNewGame"
          />
          <div ref="boardRef" class="board-wrapper">
            <GameBoard :board="state.board" />
            <GameMessage
              :is-game-over="state.isGameOver"
              :has-won="state.hasWon"
              @restart="onRestart"
            />
          </div>
          <footer class="footer">
            <p class="instructions">Arrow keys / WASD to move &middot; Swipe on mobile</p>
          </footer>
        </div>
      </div>

      <ScoreHistory
        :entries="leaderboardEntries"
        @clear="clearLeaderboard"
      />
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&family=Syne:wght@700;800&display=swap');

:root {
  --bg: #0a0a0f;
  --surface: rgba(255, 255, 255, 0.04);
  --surface-border: rgba(255, 255, 255, 0.08);
  --accent: #c8f135;
  --accent-dim: rgba(200, 241, 53, 0.15);
  --text-primary: #f0f0f0;
  --text-secondary: #6b7280;
  --text-muted: #374151;
  --font-display: 'Syne', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background-color: var(--bg);
  min-height: 100%;
}

body {
  font-family: var(--font-mono);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
}

#app {
  min-height: 100vh;
  background-color: var(--bg);
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
</style>

<style scoped>
.app {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 32px 20px 48px;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

.noise-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
}

.glow-orb {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  filter: blur(120px);
}

.glow-orb--1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(200, 241, 53, 0.08) 0%, transparent 70%);
  top: -200px;
  left: -100px;
  animation: orb-drift-1 20s ease-in-out infinite alternate;
}

.glow-orb--2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
  bottom: -150px;
  right: -100px;
  animation: orb-drift-2 25s ease-in-out infinite alternate;
}

@keyframes orb-drift-1 {
  from { transform: translate(0, 0); }
  to   { transform: translate(80px, 60px); }
}

@keyframes orb-drift-2 {
  from { transform: translate(0, 0); }
  to   { transform: translate(-60px, -80px); }
}

.layout {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
  max-width: 760px;
}

.game-col {
  flex: 1;
  min-width: 0;
}

.container {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.board-wrapper {
  position: relative;
  width: 100%;
}

.footer {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.instructions {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-secondary);
  text-align: center;
  margin: 0;
  letter-spacing: 0.03em;
}

@media (max-width: 620px) {
  .layout {
    flex-direction: column;
  }
}
</style>
