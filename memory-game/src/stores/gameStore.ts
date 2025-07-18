import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import type { CardInit, Difficulty, GameRecord, GameSaveData } from '@/game/types'
import { useLocalStorage } from '@vueuse/core'

export const useGameStore = defineStore('game', () => {
  const gameSavedData: Ref<string | null> = useLocalStorage('gameSavedData', null)
  const board: Ref<CardInit[]> = useLocalStorage('board', [])
  const moves = useLocalStorage('moves', 0)
  const elapsed = useLocalStorage('elapsed', 0)
  const gameActive = useLocalStorage('gameActive', false)
  const isFinished = useLocalStorage('isFinished', false)
  const gameRecords = useLocalStorage<GameRecord[]>('gameRecords', [])
  const timer: Ref<number | null> = ref(null)
  const startStamp = ref(0)

  function startGame() {
    resetGame()
    board.value = []
    moves.value = 0
    elapsed.value = 0
    isFinished.value = false
    gameActive.value = true
    startTimer()
  }

  function setNewRecord(difficulty: Difficulty) {
    gameRecords.value.push({
      date: new Date().getTime(),
      elapsed: elapsed.value,
      moves: moves.value,
      difficulty,
    })
  }

  function resetGame() {
    stopTimer()
    board.value = []
    moves.value = 0
    elapsed.value = 0
    isFinished.value = false
    gameActive.value = false
    gameSavedData.value = null
    timer.value = null
  }

  function startTimer() {
    stopTimer()
    startStamp.value = Date.now() - elapsed.value
    timer.value = window.setInterval(() => {
      elapsed.value = Date.now() - startStamp.value
    }, 1000)
  }

  function stopTimer() {
    if (timer.value !== null) {
      clearInterval(timer.value)
      timer.value = null
    }
  }

  function resumeGame(save: GameSaveData) {
    moves.value = save.moves
    elapsed.value = Date.now() - save.startTs
    startTimer()
  }

  function saveGameManagerData(data: GameSaveData) {
    gameSavedData.value = JSON.stringify(data)
  }

  function getGameManagerData(): GameSaveData | null {
    if (!gameSavedData.value) return null
    return JSON.parse(gameSavedData.value) as GameSaveData
  }
  return {
    board,
    moves,
    elapsed,
    gameActive,
    isFinished,
    gameSavedData,
    startGame,
    startTimer,
    setNewRecord,
    resetGame,
    saveGameManagerData,
    getGameManagerData,
    resumeGame,
    stopTimer,
    gameRecords,
  }
})
