<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { Application } from 'pixi.js'
import { GameManager } from '@/game/GameManager'
import { useGameStore } from '@/stores/gameStore'
import { mockWeapons } from '@/game/mockWeapons'
import { Difficulty } from '@/game/types'

const props = defineProps<{ difficulty: Difficulty; seed: string }>()

const host = ref<HTMLDivElement | null>(null)
const app = new Application()
const gameManager = ref<GameManager | null>(null)
const loading = ref(false)

const game = useGameStore()
onBeforeUnmount(() => {
  destroyGame()
  app?.destroy(true, { children: true })
})

const gridSizeMap = {
  [Difficulty.Easy]: 4,
  [Difficulty.Medium]: 6,
  [Difficulty.Hard]: 8,
}

function startGame() {
  if (!app) return
  loading.value = true

  const gridSize = gridSizeMap[props.difficulty]

  gameManager.value = new GameManager(app, {
    cols: gridSize,
    rows: gridSize,
    seed: props.seed,
    weapons: mockWeapons,
  })

  gameManager.value.on('pair:matched', (payload) => (game.moves = payload.moves))
  gameManager.value.on('game:finished', (payload) => game.finishGame(payload))

  loading.value = false
}

function destroyGame() {
  gameManager.value = null
}

function resizeRenderer() {
  gameManager.value?.resizeRenderer(window.innerWidth, window.innerHeight)
}

onMounted(async () => {
  await app.init({
    background: 0x253650,
  })
  window.addEventListener('resize', resizeRenderer)
  host.value?.appendChild(app.canvas)
  startGame()
  resizeRenderer()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeRenderer)
  destroyGame()
  app?.destroy(true, { children: true })
})
</script>

<template>
  <div ref="host" class="canvas-wrapper relative">
    <p v-if="loading" class="absolute inset-0 flex items-center justify-center text-white">
      Loading…
    </p>
  </div>
</template>

<style scoped>
.canvas-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

canvas {
  max-width: 100%;
  max-height: 100%;
  touch-action: none;
}
</style>
