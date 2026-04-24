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
    <div class="title-block">
      <h1 class="title">2048</h1>
      <span class="title-tag">merge &amp; conquer</span>
    </div>
    <div class="controls">
      <div class="scores">
        <div class="score-box">
          <span class="score-label">score</span>
          <span class="score-value">{{ score.toLocaleString() }}</span>
        </div>
        <div class="score-box score-box--best">
          <span class="score-label">best</span>
          <span class="score-value">{{ bestScore.toLocaleString() }}</span>
        </div>
      </div>
      <button class="new-game-btn" @click="onNewGame" aria-label="New game">
        <span class="btn-icon" aria-hidden="true">⟳</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.game-header {
  width: 100%;
  margin-bottom: 16px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.title-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-shrink: 0;
}

.title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 9vw, 5rem);
  font-weight: 800;
  color: var(--accent);
  margin: 0;
  line-height: 0.9;
  letter-spacing: -0.03em;
  text-shadow: 0 0 40px rgba(200, 241, 53, 0.4);
}

.title-tag {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-secondary);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding-left: 2px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.scores {
  display: flex;
  gap: 6px;
}

.score-box {
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  padding: 7px 12px;
  min-width: 68px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2px;
  backdrop-filter: blur(10px);
}

.score-box--best {
  border-color: rgba(200, 241, 53, 0.2);
  background: rgba(200, 241, 53, 0.04);
}

.score-label {
  font-family: var(--font-mono);
  font-size: 0.58rem;
  font-weight: 700;
  color: var(--text-secondary);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.score-box--best .score-label {
  color: rgba(200, 241, 53, 0.6);
}

.score-value {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.score-box--best .score-value {
  color: var(--accent);
}

.new-game-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--surface-border);
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, background 0.15s, transform 0.15s;
  flex-shrink: 0;
}

.new-game-btn:hover {
  color: var(--accent);
  border-color: rgba(200, 241, 53, 0.4);
  background: var(--accent-dim);
  transform: rotate(45deg);
}

.new-game-btn:active {
  background: rgba(200, 241, 53, 0.2);
  transform: rotate(90deg);
}

.btn-icon {
  line-height: 1;
}
</style>
