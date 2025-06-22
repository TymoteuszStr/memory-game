import { EventEmitter, Application, Graphics, Texture, Assets } from 'pixi.js'
import { Board } from '@/game/Board'
import {
  backCardTexturePath,
  CARD_CLICK,
  GAME_SAVE,
  PAIR_MATCHED,
  type CardInit,
  type GameSaveData,
  type Weapon,
} from '@/game/types'
import type { Card } from '@/game/Card'
import { shuffleArray } from './shuffleArray'

export interface GameConfig {
  cols: number
  rows: number
  seed: string
  weapons: Weapon[]
}
export class GameManager extends EventEmitter {
  private app: Application
  private board: Board
  private seed: string
  private flippedCard: Card[] = []
  moves = 0
  startTs = 0

  constructor(app: Application, config: GameConfig, skipGenerate = false) {
    super()
    this.app = app
    this.seed = config.seed

    this.board = new Board({
      cols: config.cols,
      rows: config.rows,
      gap: 16,
      margin: 16,
    })
    if (!skipGenerate) {
      this.generateBoard(config.weapons)
    }
  }

  private async generateBoard(weapons: Weapon[]) {
    const { cols, rows } = this.board.opts
    const { cardSide } = this.board
    const total = cols * rows
    const pairsNeeded = total / 2
    const pool: Weapon[] = []
    while (pool.length < pairsNeeded) {
      pool.push(...weapons)
    }

    const selected = shuffleArray(pool, this.seed).slice(0, pairsNeeded)

    const duplicated = [...selected, ...selected]
    const finalOrder = shuffleArray(duplicated, this.seed)

    const inits: CardInit[] = finalOrder.map((weapon, index) => ({
      id: `${weapon.id}-${index}`,
      weapon,
    }))
    const promises: Promise<unknown>[] = []

    weapons.forEach((weapon) => {
      promises.push(Assets.load(weapon.texturePath))
    })
    promises.push(Assets.load(backCardTexturePath))
    await Promise.all(promises)

    const backTexture = Texture.from(backCardTexturePath)
    const frontTexture = this.makeRectTexture(cardSide, cardSide, 0xffffff)
    this.board.resize(window.innerWidth, window.innerHeight)
    this.board.build(inits, backTexture, frontTexture)

    this.app.stage.removeChildren()
    for (const card of this.board.cards) {
      if (!card.parent) this.app.stage.addChild(card)
    }
    this.board.cards.forEach((card) => card.on(CARD_CLICK, () => this.onCardClick(card as Card)))

    this.startTs = Date.now()
  }

  private makeRectTexture(w: number, h: number, color: number) {
    const g = new Graphics().roundRect(0, 0, w, h, 8).fill({ color })
    return this.app.renderer.generateTexture(g)
  }

  public async onCardClick(card: Card) {
    if (!this.canCardBeFlipped(card)) return
    await card.flip()
    this.flippedCard.push(card)

    if (this.flippedCard.length === 2) {
      this.moves++
      this.emit(PAIR_MATCHED, { moves: this.moves })

      this.checkPair()
    }
  }

  private checkPair() {
    const [c1, c2] = this.flippedCard
    if (c1.weapon.id === c2.weapon.id) {
      c1.setMatched(true)
      c2.setMatched(true)
      this.emit(PAIR_MATCHED, { moves: this.moves })
      this.checkVictory()
      this.flippedCard = []
      this.emit(GAME_SAVE)
    } else {
      setTimeout(() => {
        c1.flip()
        c2.flip()
        this.flippedCard = []
      }, 500)
    }
  }

  private checkVictory() {
    //ADD VICORY CHECK
  }

  canCardBeFlipped(card: Card): boolean {
    return (
      !this.flippedCard.includes(card) &&
      this.flippedCard.length < 2 &&
      !card.isMatched &&
      !card.isFlipped
    )
  }

  resizeRenderer(w: number, h: number) {
    this.app.renderer.resize(w, h)
    this.board.resize(w, h)
  }

  public getSerializableState(): GameSaveData {
    return {
      version: 1,
      config: {
        cols: this.board.opts.cols,
        rows: this.board.opts.rows,
        seed: this.seed,
      },
      moves: this.moves,
      startTs: this.startTs,
      cards: this.board.cards.map((c) => ({
        id: c.id,
        isFlipped: c.isFlipped,
        isMatched: c.isMatched,
      })),
    }
  }

  public async restoreFromState(state: GameSaveData, weapons: Weapon[]) {
    await this.generateBoard(weapons)

    const map = new Map<string, Card>()
    this.board.cards.forEach((c) => map.set(c.id, c))

    state.cards.forEach((saved) => {
      const card = map.get(saved.id)
      if (!card) return

      card.isMatched = saved.isMatched
      card.isFlipped = saved.isFlipped

      if (saved.isMatched) card.setMatched(true)
      card.showFace(saved.isFlipped)
    })

    this.moves = state.moves
    this.startTs = state.startTs

    this.emit(PAIR_MATCHED, { moves: this.moves })
  }
  static async createFromState(
    app: Application,
    weapons: Weapon[],
    state: GameSaveData,
  ): Promise<GameManager> {
    const gm = new GameManager(app, { ...state.config, weapons }, true)
    await gm.restoreFromState(state, weapons)
    return gm
  }
}
