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
            <p class="instructions"><strong>How to play:</strong> Use arrow keys or WASD to move tiles. Swipe on mobile.</p>
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
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background-color: #faf8ef;
  min-height: 100%;
}

body {
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
}

#app {
  min-height: 100vh;
  background-color: #faf8ef;
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
  padding: 24px 16px 40px;
}

.layout {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  width: 100%;
  max-width: 740px;
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
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.instructions {
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
  font-size: 0.85rem;
  color: #776e65;
  text-align: center;
  margin: 0;
}

@media (max-width: 600px) {
  .layout {
    flex-direction: column;
  }
}
</style>
