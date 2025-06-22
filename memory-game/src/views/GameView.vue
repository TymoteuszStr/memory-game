<script setup lang="ts">
import GameCanvas from '@/components/GameCanvas.vue'
import type { Difficulty } from '@/game/types'
import { useGameStore } from '@/stores/gameStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const gameStore = useGameStore()
const route = useRoute()
const { gameActive } = storeToRefs(gameStore)

function startGame() {
  gameStore.startGame()
}
const seed = computed(() => route.query.seed as string)
const difficulty = computed(() => route.query.difficulty as Difficulty)

onMounted(() => {
  if (!gameActive.value && seed.value && difficulty.value) {
    startGame()
  }
})
</script>
<template>
  <div class="wrapper">
    <GameCanvas v-if="gameActive" :seed="seed" :difficulty="difficulty" />
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
