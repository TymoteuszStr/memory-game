<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { Application } from 'pixi.js'
import { GameManager } from '@/game/GameManager'
import { useGameStore } from '@/stores/gameStore'
import { mockWeapons } from '@/game/mockWeapons'

const props = defineProps<{ difficulty: 'easy' | 'medium' | 'hard'; seed: string }>()

const host = ref<HTMLDivElement | null>(null)
const app = new Application()
const gameManager = ref<GameManager | null>(null)
const loading = ref(false)

const game = useGameStore()
onBeforeUnmount(() => {
  destroyGame()
  app?.destroy(true, { children: true })
})

function startGame() {
  if (!app) return
  loading.value = true
  gameManager.value = new GameManager(app, {
    cols: props.difficulty === 'easy' ? 4 : props.difficulty === 'medium' ? 6 : 8,
    rows: props.difficulty === 'easy' ? 4 : props.difficulty === 'medium' ? 6 : 8,
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

onMounted(async () => {
  await app.init({ background: 0xf3f3f3, resizeTo: window })
  host.value?.appendChild(app.canvas)
  startGame()
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
}
canvas {
  touch-action: none;
}
</style>
