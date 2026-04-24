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
  <Transition name="fade">
    <div v-if="isGameOver || hasWon" class="message-overlay">
      <div class="message-content">
        <p class="message-text">
          <template v-if="hasWon && !isGameOver">You Win! 🎉</template>
          <template v-else>Game Over</template>
        </p>
        <button class="retry-btn" @click="onRestart">Try Again</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.message-overlay {
  position: absolute;
  inset: 0;
  border-radius: 6px;
  background-color: rgba(238, 228, 218, 0.73);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.message-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.message-text {
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 700;
  color: #776e65;
  margin: 0;
}

.retry-btn {
  background-color: #8f7a66;
  color: #f9f6f2;
  border: none;
  border-radius: 4px;
  padding: 10px 28px;
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.1s ease;
}

.retry-btn:hover {
  background-color: #9f8a76;
}

.retry-btn:active {
  background-color: #7f6a56;
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
