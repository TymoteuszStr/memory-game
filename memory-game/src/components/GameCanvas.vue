<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { Application } from 'pixi.js'
import { GameManager } from '@/game/GameManager'
import { useGameStore } from '@/stores/gameStore'
import { mockWeapons } from '@/game/mockWeapons'
import { Difficulty, gridSizeMap, PAIR_MATCHED, GAME_SAVE, type GameSaveData } from '@/game/types'

const props = defineProps<{ difficulty: Difficulty; seed: string }>()
const gameStore = useGameStore()

const host = ref<HTMLDivElement | null>(null)
const app = new Application()
let gameManager: GameManager | null = null
const loading = ref(false)

function startGame() {
  if (!app) return

  const gridSize = gridSizeMap[props.difficulty]

  gameManager = new GameManager(app, {
    cols: gridSize,
    rows: gridSize,
    seed: props.seed,
    weapons: mockWeapons,
  })
  addEvents(gameManager)
}
async function loadGame(save: GameSaveData) {
  try {
    gameManager = await GameManager.createFromState(app, mockWeapons, save)
    addEvents(gameManager)
    loading.value = false
    return
  } catch (err) {
    console.warn('Nieprawidłowy save – startuję nową grę', err)
    startGame()
  }
}

async function loadOrStartGame() {
  const save = gameStore.getGameManagerData()
  if (save) {
    await loadGame(save)
  } else {
    startGame()
  }
}

function destroyGame() {
  gameManager = null
}

function addEvents(gm: GameManager | null) {
  if (!gm) return
  gm.on(PAIR_MATCHED, (payload) => (gameStore.moves = payload.moves))
  gm.on('game:finished', (payload) => gameStore.finishGame(payload))
  gm.on(GAME_SAVE, onSaveChanges)
}

function resizeRenderer() {
  if (!gameManager) return
  gameManager.resizeRenderer(window.innerWidth, window.innerHeight)
}

function onSaveChanges() {
  const data = gameManager?.getSerializableState()
  if (!data) return
  gameStore.saveGameManagerData(data)
}

onMounted(async () => {
  loading.value = true

  await app.init({
    background: 0x253650,
  })
  window.addEventListener('resize', resizeRenderer)
  host.value?.appendChild(app.canvas)
  await loadOrStartGame()
  resizeRenderer()
  loading.value = false
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeRenderer)
  destroyGame()
  app?.destroy(true, { children: true })
})
</script>

<template>
  <div ref="host" class="canvas-wrapper flex-center">
    <p v-if="loading" class="flex-center">Loading…</p>
  </div>
</template>

<style scoped>
.canvas-wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

canvas {
  max-width: 100%;
  max-height: 100%;
  touch-action: none;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
