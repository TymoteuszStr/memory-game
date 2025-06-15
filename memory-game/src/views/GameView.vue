<script setup lang="ts">
import GameUI from '@/components/GameUI.vue'
import GameCanvas from '@/components/GameCanvas.vue'
import { useGameStore } from '@/stores/gameStore'
import { storeToRefs } from 'pinia'

const game = useGameStore()

function onStart(payload: { seed: string; difficulty: 'easy' | 'medium' | 'hard' }) {
  game.startGame(payload)
}

function restart() {
  game.resetGame()
}

const { gameActive } = storeToRefs(game)
</script>
<template>
  <GameUI @start="onStart" />
  <GameCanvas v-if="gameActive" :seed="game.seed" :difficulty="game.difficulty" />
</template>
