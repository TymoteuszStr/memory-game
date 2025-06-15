import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import type { CardInit } from '@/game/types'

export const useGameStore = defineStore('game', () => {
  const seed = ref<string>('')
  const difficulty = ref<'easy' | 'medium' | 'hard'>('medium')

  const board: Ref<CardInit[]> = ref([])
  const moves = ref(0)
  const elapsed = ref(0)
  const gameActive = ref(false)
  const isFinished = ref(false)

  let timer: number | null = null

  function startGame(payload: {
    seed: string
    difficulty: 'easy' | 'medium' | 'hard'
    cards?: CardInit[]
  }) {
    seed.value = payload.seed
    difficulty.value = payload.difficulty
    board.value = payload.cards ?? []
    moves.value = 0
    elapsed.value = 0
    isFinished.value = false
    gameActive.value = true

    startTimer()
  }

  function finishGame(payload?: { moves: number; elapsed: number }) {
    isFinished.value = true
    gameActive.value = false
    if (payload) {
      moves.value = payload.moves
      elapsed.value = payload.elapsed
    }
    stopTimer()
  }

  function resetGame() {
    seed.value = ''
    difficulty.value = 'medium'
    board.value = []
    moves.value = 0
    elapsed.value = 0
    isFinished.value = false
    gameActive.value = false
    stopTimer()
  }

  function startTimer() {
    stopTimer()
    timer = window.setInterval(() => {
      elapsed.value += 100
    }, 100)
  }

  function stopTimer() {
    if (timer !== null) {
      clearInterval(timer)
      timer = null
    }
  }

  return {
    seed,
    difficulty,
    board,
    moves,
    elapsed,
    gameActive,
    isFinished,

    startGame,
    finishGame,
    resetGame,
  }
})
