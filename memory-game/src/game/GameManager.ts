import { EventEmitter, Application, Graphics, Texture, Assets } from 'pixi.js'
import { Board } from '@/game/Board'
import type { CardInit, Weapon } from '@/game/types'
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

  constructor(app: Application, config: GameConfig) {
    super()
    this.app = app
    this.seed = config.seed
    this.board = new Board({
      cols: config.cols,
      rows: config.rows,
      gap: 16,
      margin: 16,
    })
    this.generateBoard(config.weapons)
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
    promises.push(Assets.load('/assets/backImage.png'))
    await Promise.all(promises)

    const backTexture = Texture.from('/assets/backImage.png')
    const frontTexture = this.makeRectTexture(cardSide, cardSide, 0xffffff)
    this.board.resize(window.innerWidth, window.innerHeight)
    this.board.build(inits, backTexture, frontTexture)

    this.app.stage.removeChildren()
    this.app.stage.addChild(...this.board.cards)
    this.board.cards.forEach((card) => card.on('card:click', () => this.onCardClick(card as Card)))

    this.startTs = Date.now()
  }

  private makeRectTexture(w: number, h: number, color: number) {
    const g = new Graphics().roundRect(0, 0, w, h, 8).fill({ color })
    return this.app.renderer.generateTexture(g)
  }

  public onCardClick(card: Card) {
    if (!this.canCardBeFlipped(card)) return
    card.flip()
    this.flippedCard.push(card)

    if (this.flippedCard.length === 2) {
      this.moves++
      this.emit('pair:matched', { moves: this.moves })

      this.checkPair()
    }
  }

  private checkPair() {
    const [c1, c2] = this.flippedCard
    if (c1.weapon.id === c2.weapon.id) {
      c1.setMatched(true)
      c2.setMatched(true)
      this.emit('pair:matched', { moves: this.moves })
      this.checkVictory()
      this.flippedCard = []
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
}
