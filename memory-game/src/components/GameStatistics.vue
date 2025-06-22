<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import { storeToRefs } from 'pinia'

const game = useGameStore()
const { moves, elapsed } = storeToRefs(game)

function formatTime(ms: number) {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="statistic-wrapper">
    <div>Ruchy: {{ moves }}</div>
    <div>Czas: {{ formatTime(elapsed) }}</div>
  </div>
</template>

<style scoped lang="scss">
.statistic-wrapper {
  width: fit-content;
  color: #11998e;
}
</style>
