<script setup lang="ts">
defineProps<{
  isGameOver: boolean;
  hasWon: boolean;
}>();

const emit = defineEmits<{
  restart: [];
}>();

function onRestart(): void {
  emit('restart');
}
</script>

<template>
  <Transition name="overlay">
    <div v-if="isGameOver || hasWon" class="message-overlay" :class="{ 'is-win': hasWon && !isGameOver }">
      <div class="message-content">
        <div class="message-badge">
          <template v-if="hasWon && !isGameOver">
            <span class="badge-icon">◈</span>
            <span class="badge-text">you reached 2048</span>
          </template>
          <template v-else>
            <span class="badge-icon">✕</span>
            <span class="badge-text">no moves left</span>
          </template>
        </div>
        <p class="message-text">
          <template v-if="hasWon && !isGameOver">brilliant.</template>
          <template v-else>game over</template>
        </p>
        <button class="retry-btn" @click="onRestart">play again</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.message-overlay {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: rgba(10, 10, 15, 0.88);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.message-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.message-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  padding: 5px 14px;
}

.badge-icon {
  font-size: 0.7rem;
  color: var(--text-secondary);
}

.badge-text {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-secondary);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.is-win .message-badge {
  border-color: rgba(200, 241, 53, 0.3);
  background: rgba(200, 241, 53, 0.06);
}

.is-win .badge-icon,
.is-win .badge-text {
  color: var(--accent);
}

.message-text {
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 7vw, 4rem);
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  line-height: 1;
  letter-spacing: -0.03em;
}

.is-win .message-text {
  color: var(--accent);
  text-shadow: 0 0 40px rgba(200, 241, 53, 0.4);
}

.retry-btn {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--surface-border);
  border-radius: 6px;
  padding: 9px 22px;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}

.retry-btn:hover {
  color: var(--accent);
  border-color: rgba(200, 241, 53, 0.4);
  background: var(--accent-dim);
}

.retry-btn:active {
  background: rgba(200, 241, 53, 0.25);
}

/* Transition */
.overlay-enter-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.overlay-leave-active {
  transition: opacity 0.2s ease;
}
.overlay-enter-from {
  opacity: 0;
  transform: scale(0.98);
}
.overlay-leave-to {
  opacity: 0;
}
</style>
