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
  <div class="flex items-center gap-6">
    <span>Ruchy: {{ moves }}</span>
    <span>Czas: {{ formatTime(elapsed) }}</span>
    <button class="btn" @click="$emit('restart')">Restart</button>
  </div>
</template>

<style scoped lang="scss"></style>
