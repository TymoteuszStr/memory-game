<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { storeToRefs } from 'pinia'

const emit = defineEmits<{
  (e: 'start', payload: { seed: string; difficulty: 'easy' | 'medium' | 'hard' }): void
  (e: 'restart'): void
}>()

const game = useGameStore()
const { moves, elapsed, gameActive } = storeToRefs(game)

const seed = ref(Date.now().toString(36))
const difficulty = ref<'easy' | 'medium' | 'hard'>('medium')

function emitStart() {
  if (!seed.value) seed.value = Date.now().toString(36)
  emit('start', { seed: seed.value, difficulty: difficulty.value })
}

function formatTime(ms: number) {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
}
</script>
<template>
  <form v-if="!gameActive" class="flex gap-3" @submit.prevent="emitStart">
    <input v-model="seed" placeholder="Seed" class="input" />
    <select v-model="difficulty" class="select">
      <option value="easy">Łatwy</option>
      <option value="medium">Średni</option>
      <option value="hard">Trudny</option>
    </select>
    <button class="btn">Start</button>
  </form>

  <div v-else class="flex items-center gap-6">
    <span>Ruchy: {{ moves }}</span>
    <span>Czas: {{ formatTime(elapsed) }}</span>
    <button class="btn" @click="$emit('restart')">Restart</button>
  </div>
</template>
