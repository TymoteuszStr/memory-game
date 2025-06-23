<script setup lang="ts">
import { ref } from 'vue'

import { useRouter } from 'vue-router'
import { Difficulty } from '@/game/types'
import { useGameStore } from '@/stores/gameStore'
import TableRecord from './TableRecord.vue'
import { computed } from 'vue'

const router = useRouter()
const gameStore = useGameStore()
const seed = ref(Date.now().toString(36))
const difficulty = ref<Difficulty>(Difficulty.Medium)
const records = computed(() => gameStore.gameRecords)
function onStart() {
  gameStore.resetGame()
  if (!seed.value) seed.value = Date.now().toString(36)
  const seedWithourSpaces = seed.value.replace(/\s+/g, '')
  router.push({ name: 'game', query: { seed: seedWithourSpaces, difficulty: difficulty.value } })
}

function setDifficulty(newDifficulty: Difficulty) {
  difficulty.value = newDifficulty
}
</script>
<template>
  <div class="wrapper">
    <form class="form" @submit.prevent="onStart">
      <h1>CS GO 2 Memory</h1>
      <div class="form__group field">
        <input
          v-model="seed"
          type="input"
          class="form__field"
          placeholder="Seed"
          name="seed"
          id="seed"
        />
        <label for="seed" class="form__label">Seed</label>
      </div>
      <div class="dificulty-container">
        <button
          class="dificulty-btn"
          :class="{ easy: difficulty === Difficulty.Easy }"
          @click.prevent="setDifficulty(Difficulty.Easy)"
        >
          easy
        </button>
        <button
          class="dificulty-btn"
          :class="{ medium: difficulty === Difficulty.Medium }"
          @click.prevent="setDifficulty(Difficulty.Medium)"
        >
          medium
        </button>
        <button
          class="dificulty-btn"
          :class="{ hard: difficulty === Difficulty.Hard }"
          @click.prevent="setDifficulty(Difficulty.Hard)"
        >
          hard
        </button>
      </div>
      <button class="start-btn">Start</button>
    </form>
    <TableRecord :records="records" />
  </div>
</template>
<style lang="scss" scoped>
.wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: fit-content;
  height: 80vh;
  max-height: 700px;
  margin: auto auto;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 50px;
    width: 100%;
  }
}
.dificulty-container {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;

  .dificulty-btn {
    all: unset;
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
    border: 2px solid transparent;

    &.easy {
      border-color: #4caf50;
    }
    &.medium {
      border-color: #ff9800;
    }
    &.hard {
      border-color: #f44336;
    }
  }
}

.start-btn {
  width: 100%;
  height: 50px;
  background: #2a7b9b;
  background: linear-gradient(
    90deg,
    rgba(42, 123, 155, 1) 0%,
    rgba(87, 199, 133, 1) 50%,
    rgba(237, 221, 83, 1) 100%
  );
  color: white;
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
