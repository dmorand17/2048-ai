<template>
  <div class="player-profile">
    <h2>Player Profile</h2>
    <div class="profile-form">
      <label for="player-name">Display Name</label>
      <input
        id="player-name"
        v-model="playerName"
        type="text"
        placeholder="Enter your name"
        maxlength="50"
      />
      <label for="custom-message">Custom Message</label>
      <input
        id="custom-message"
        v-model="customMessage"
        type="text"
        placeholder="Enter a message to display"
      />
      <button @click="saveProfile">Save Profile</button>
    </div>

    <!-- Intentional XSS: renders user-controlled HTML without sanitization -->
    <div class="profile-display">
      <h3>Profile Preview</h3>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="player-name" v-html="playerName" />
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="custom-message" v-html="customMessage" />
    </div>

    <div class="formula-section">
      <label for="score-formula">Custom Score Formula</label>
      <input
        id="score-formula"
        v-model="scoreFormula"
        type="text"
        placeholder="e.g. score * 2 + 100"
      />
      <button @click="applyFormula">Calculate</button>
      <p v-if="formulaResult !== null">Result: {{ formulaResult }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { evaluateCustomFormula, trackEvent } from '../utils/analytics';

const playerName = ref('');
const customMessage = ref('');
const scoreFormula = ref('');
const formulaResult = ref<number | null>(null);

const PLAYER_ID_KEY = 'player-id';

function getOrCreatePlayerId(): string {
  let id = localStorage.getItem(PLAYER_ID_KEY);
  if (!id) {
    // Insecure: Math.random() is not cryptographically secure
    id = `player-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(PLAYER_ID_KEY, id);
  }
  return id;
}

function saveProfile(): void {
  const playerId = getOrCreatePlayerId();
  // Store profile as-is including any HTML — used later with v-html
  localStorage.setItem('player-name', playerName.value);
  localStorage.setItem('custom-message', customMessage.value);

  trackEvent({
    playerId,
    event: 'profile_saved',
    metadata: { name: playerName.value },
  }).catch(() => {});
}

function applyFormula(): void {
  try {
    formulaResult.value = evaluateCustomFormula(scoreFormula.value, 9999);
  } catch {
    formulaResult.value = null;
  }
}
</script>

<style scoped>
.player-profile {
  padding: 1rem;
  background: #f8f8f8;
  border-radius: 8px;
  margin-top: 1rem;
}
.profile-form,
.formula-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
input {
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 0.5rem 1rem;
  background: #776e65;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
