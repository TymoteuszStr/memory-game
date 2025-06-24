import { vi, describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest'
import { GameManager } from '@/game/GameManager'
import type { GameConfig } from '@/game/GameManager'
import { Application } from 'pixi.js'
import { mockWeapons } from '@/game/mockWeapons'
import {
  GAME_FINISHED,
  GAME_MOVES,
  PAIR_MATCHED,
  GAME_SAVE,
  type CardInit,
  type GameSaveData,
} from '@/game/types'

vi.mock('pixi.js', async () => {
  return {
    Application: vi.fn(() => ({
      stage: {
        addChild: vi.fn(),
        removeChildren: vi.fn(),
      },
      renderer: {
        generateTexture: vi.fn(),
        resize: vi.fn(),
      },
    })),
    Assets: {
      load: vi.fn().mockResolvedValue(true),
    },
    Texture: {
      from: vi.fn(),
    },
    Graphics: vi.fn(() => ({
      roundRect: vi.fn().mockReturnThis(),
      fill: vi.fn().mockReturnThis(),
    })),
    EventEmitter: class {
      listeners = new Map<string, Array<(...args: any[]) => void>>()
      on(event: string, fn: (...args: any[]) => void) {
        if (!this.listeners.has(event)) {
          this.listeners.set(event, [])
        }
        this.listeners.get(event)!.push(fn)
      }
      emit(event: string, ...args: any[]) {
        this.listeners.get(event)?.forEach((fn) => fn(...args))
      }
    },
  }
})

vi.mock('@pixi/sound', () => ({
  sound: {
    add: vi.fn((_, opts) => opts.loaded?.()),
    play: vi.fn(),
  },
}))

vi.mock('../game/shuffleArray', () => ({
  shuffleArray: vi.fn((arr) => arr),
}))

vi.mock('../game/Board', () => ({
  Board: vi.fn(() => ({
    opts: { cols: 2, rows: 2 },
    cards: [],
    resize: vi.fn(),
    build: vi.fn(function (this: any, cardInits: CardInit[]) {
      this.cards = cardInits.map((init) => ({
        id: init.id,
        weapon: init.weapon,
        isFlipped: false,
        isMatched: false,
        flip: vi.fn().mockResolvedValue(true),
        setMatched: vi.fn(function (this: any, val: boolean) {
          this.isMatched = val
        }),
        on: vi.fn(),
        showFace: vi.fn(),
      }))
    }),
  })),
}))

describe('GameManager', () => {
  let app: Application
  let config: GameConfig
  let gameManager: GameManager

  beforeAll(() => {
    vi.useFakeTimers()
  })

  beforeEach(async () => {
    app = new Application()
    config = {
      cols: 2,
      rows: 2,
      seed: 'test',
      weapons: mockWeapons.slice(0, 2),
    }
    gameManager = new GameManager(app, config, true)
    await gameManager['generateBoard'](config.weapons)
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()
  })

  it('should initialize and generate a board', () => {
    expect(gameManager).toBeDefined()
    expect(gameManager['board'].build).toHaveBeenCalled()
    expect(gameManager['board'].cards.length).toBe(4)
    expect(app.stage.addChild).toHaveBeenCalledTimes(4)
  })

  it('should handle a single card click', async () => {
    const card = gameManager['board'].cards[0]
    await gameManager.onCardClick(card)

    expect(gameManager['flippedCard']).toContain(card)
    expect(card.flip).toHaveBeenCalled()
    expect(gameManager['lockFlipingCard']).toBe(false)
  })

  it('should handle matching a pair of cards', async () => {
    const card1 = gameManager['board'].cards[0]
    const card2 = gameManager['board'].cards[2]

    const emitSpy = vi.spyOn(gameManager, 'emit')

    await gameManager.onCardClick(card1)
    await gameManager.onCardClick(card2)

    expect(gameManager.moves).toBe(1)
    expect(emitSpy).toHaveBeenCalledWith(GAME_MOVES, { moves: 1 })
    expect(card1.setMatched).toHaveBeenCalledWith(true)
    expect(card2.setMatched).toHaveBeenCalledWith(true)
    expect(emitSpy).toHaveBeenCalledWith(PAIR_MATCHED)
    expect(gameManager['flippedCard'].length).toBe(0)
    expect(gameManager['lockFlipingCard']).toBe(false)
  })

  it('should handle a non-matching pair of cards', async () => {
    const card1 = gameManager['board'].cards[0]
    const card2 = gameManager['board'].cards[1]

    const emitSpy = vi.spyOn(gameManager, 'emit')

    await gameManager.onCardClick(card1)
    await gameManager.onCardClick(card2)

    expect(card1.flip).toHaveBeenCalledTimes(1)
    expect(card2.flip).toHaveBeenCalledTimes(1)

    await vi.runAllTimersAsync()

    expect(card1.flip).toHaveBeenCalledTimes(2)
    expect(card2.flip).toHaveBeenCalledTimes(2)
    expect(gameManager['flippedCard'].length).toBe(0)
    expect(gameManager['lockFlipingCard']).toBe(false)
    expect(emitSpy).toHaveBeenCalledWith(GAME_SAVE)
  })

  it('should check for victory and emit GAME_FINISHED', async () => {
    const emitSpy = vi.spyOn(gameManager, 'emit')
    gameManager['board'].cards.forEach((c) => (c.isMatched = true))

    gameManager['checkVictory']()

    expect(emitSpy).toHaveBeenCalledWith(
      GAME_FINISHED,
      expect.objectContaining({ moves: gameManager.moves }),
    )
  })

  it('should correctly determine if a card can be flipped', () => {
    const card = gameManager['board'].cards[0]
    expect(gameManager.canCardBeFlipped(card)).toBe(true)

    gameManager['lockFlipingCard'] = true
    expect(gameManager.canCardBeFlipped(card)).toBe(false)
    gameManager['lockFlipingCard'] = false

    card.isFlipped = true
    expect(gameManager.canCardBeFlipped(card)).toBe(false)
    card.isFlipped = false

    card.isMatched = true
    expect(gameManager.canCardBeFlipped(card)).toBe(false)
    card.isMatched = false

    gameManager['flippedCard'] = [card]
    expect(gameManager.canCardBeFlipped(card)).toBe(false)
  })

  it('should resize the renderer and board', () => {
    gameManager.resizeRenderer(800, 600)
    expect(app.renderer.resize).toHaveBeenCalledWith(800, 600)
    expect(gameManager['board'].resize).toHaveBeenCalledWith(800, 600)
  })

  it('should return a serializable state', () => {
    const state = gameManager.getSerializableState()
    expect(state.version).toBe(1)
    expect(state.moves).toBe(0)
    expect(state.config.cols).toBe(2)
    expect(state.config.rows).toBe(2)
    expect(state.cards.length).toBe(4)
  })

  it('should restore from a saved state', async () => {
    const cardState = { id: gameManager['board'].cards[0].id, isFlipped: true, isMatched: true }
    const state: GameSaveData = {
      version: 1,
      config: { cols: 2, rows: 2, seed: 'restore' },
      moves: 5,
      startTs: 12345,
      cards: [cardState],
    }

    await gameManager.restoreFromState(state, config.weapons)

    expect(gameManager.moves).toBe(5)
    expect(gameManager.startTs).toBe(12345)

    const restoredCard = gameManager['board'].cards.find((c) => c.id === cardState.id)!
    expect(restoredCard.isFlipped).toBe(true)
    expect(restoredCard.isMatched).toBe(true)
    expect(restoredCard.showFace).toHaveBeenCalledWith(true)
  })
})
