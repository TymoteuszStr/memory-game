<script setup lang="ts">
import GameCanvas from '@/components/GameCanvas.vue'
import type { Difficulty } from '@/game/types'
import { useGameStore } from '@/stores/gameStore'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const game = useGameStore()
const route = useRoute()
const { gameActive } = storeToRefs(game)

function startGame(payload: { seed: string; difficulty: Difficulty }) {
  game.startGame(payload)
}

onMounted(() => {
  const seed = route.query.seed as string
  const difficulty = route.query.difficulty as Difficulty
  if (seed && difficulty) {
    startGame({ seed, difficulty })
  }
})
</script>
<template>
  <GameCanvas v-if="gameActive" :seed="game.seed" :difficulty="game.difficulty as Difficulty" />
</template>
