<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import { storeToRefs } from 'pinia'
import { formatTime } from '@/game/formatTime'
const game = useGameStore()
const { moves, elapsed } = storeToRefs(game)
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
