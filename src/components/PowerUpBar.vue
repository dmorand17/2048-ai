<script setup lang="ts">
defineProps<{
  bombCount: number;
  bombMode: boolean;
}>();

defineEmits<{
  'toggle-bomb': [];
}>();
</script>

<template>
  <div class="powerup-bar">
    <div class="powerup-label">POWER-UPS</div>
    <button
      class="bomb-btn"
      :class="{ active: bombMode, disabled: bombCount === 0 }"
      :disabled="bombCount === 0"
      @click="$emit('toggle-bomb')"
    >
      <span class="bomb-icon">💣</span>
      <span class="bomb-text">{{ bombMode ? 'CANCEL' : 'BOMB' }}</span>
      <span class="bomb-count" :class="{ 'bomb-count--active': bombMode }">{{ bombCount }}</span>
    </button>
  </div>
</template>

<style scoped>
.powerup-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 8px;
  margin-bottom: 10px;
}

.powerup-label {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-secondary);
  letter-spacing: 0.1em;
  flex-shrink: 0;
}

.bomb-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.bomb-btn:hover:not(.disabled) {
  background: rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.4);
}

.bomb-btn.active {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.6);
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.25);
}

.bomb-btn.disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.bomb-icon {
  font-size: 0.95rem;
  line-height: 1;
}

.bomb-text {
  min-width: 44px;
}

.bomb-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  font-size: 0.65rem;
  font-weight: 700;
}

.bomb-count--active {
  background: rgba(239, 68, 68, 0.3);
  color: #fca5a5;
}
</style>
