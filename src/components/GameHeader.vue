<script setup lang="ts">
defineProps<{
  score: number;
  bestScore: number;
}>();

const emit = defineEmits<{
  'new-game': [];
}>();

function onNewGame(): void {
  emit('new-game');
}
</script>

<template>
  <header class="game-header">
    <div class="title-row">
      <h1 class="title">2048</h1>
      <div class="scores">
        <div class="score-box">
          <span class="score-label">SCORE</span>
          <span class="score-value">{{ score }}</span>
        </div>
        <div class="score-box">
          <span class="score-label">BEST</span>
          <span class="score-value">{{ bestScore }}</span>
        </div>
      </div>
    </div>
    <div class="subtitle-row">
      <p class="subtitle">Join the tiles, get to <strong>2048!</strong></p>
      <button class="new-game-btn" @click="onNewGame">New Game</button>
    </div>
  </header>
</template>

<style scoped>
.game-header {
  width: 100%;
  margin-bottom: 16px;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.title {
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 700;
  color: #776e65;
  margin: 0;
  line-height: 1;
}

.scores {
  display: flex;
  gap: 8px;
}

.score-box {
  background-color: #bbada0;
  border-radius: 4px;
  padding: 6px 16px;
  min-width: 64px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.score-label {
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  color: #eee4da;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.score-value {
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}

.subtitle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.subtitle {
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
  font-size: 0.9rem;
  color: #776e65;
  margin: 0;
}

.subtitle strong {
  font-weight: 700;
}

.new-game-btn {
  background-color: #8f7a66;
  color: #f9f6f2;
  border: none;
  border-radius: 4px;
  padding: 8px 18px;
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.1s ease;
  white-space: nowrap;
}

.new-game-btn:hover {
  background-color: #9f8a76;
}

.new-game-btn:active {
  background-color: #7f6a56;
}
</style>
