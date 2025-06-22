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
  <div class="wrapper">
    <GameCanvas v-if="gameActive" :seed="game.seed" :difficulty="game.difficulty" />
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #253650;
}
</style>
