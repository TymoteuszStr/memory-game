<script setup lang="ts">
import BackIcon from '@/components/BackIcon.vue'
import GameCanvas from '@/components/GameCanvas.vue'
import type { Difficulty } from '@/game/types'
import { useGameStore } from '@/stores/gameStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const gameStore = useGameStore()
const route = useRoute()
const router = useRouter()
const { gameActive } = storeToRefs(gameStore)

function startGame() {
  gameStore.startGame()
}
const seed = computed(() => route.query.seed as string)
const difficulty = computed(() => route.query.difficulty as Difficulty)

function goBack() {
  gameStore.resetGame()
  router.push('/')
}
onMounted(() => {
  if (!gameActive.value && seed.value && difficulty.value) {
    startGame()
  }
})
</script>
<template>
  <div class="wrapper">
    <div class="header-wrapper">
      <BackIcon class="backIcon" @click="goBack" />
      <h1>CS GO 2 Memory</h1>
    </div>

    <GameCanvas v-if="gameActive" :seed="seed" :difficulty="difficulty" />
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #253650;
  padding: 30px 0;
}
.backIcon {
  font-size: 24px;
  width: 44px;
  height: auto;
  margin-right: 32px;
  margin-left: 32px;
  cursor: pointer;
}
.header-wrapper {
  display: flex;
  align-items: center;
  fill: #11998e;
  width: 100%;
  margin-top: 16px;
}
h1 {
  margin: 0;
}
</style>
