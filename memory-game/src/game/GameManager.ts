import { EventEmitter, Application, Graphics, Texture, Assets } from 'pixi.js'
import { Board } from '@/game/Board'
import type { CardInit, Weapon } from '@/game/types'
import { createRng } from '@/game/rng'
import type { Card } from '@/game/Card'

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
      cardWidth: 96,
      cardHeight: 96,
    })
    this.generateBoard(config.weapons, config.seed)
  }

  private async generateBoard(weapons: Weapon[], seed: string) {
    const { cols, rows, cardWidth, cardHeight } = this.board.opts
    const total = cols * rows
    const pairsNeeded = total / 2
    const rng = createRng(seed)

    const pool: Weapon[] = []
    while (pool.length < pairsNeeded) {
      pool.push(...weapons)
    }

    const shuffled = pool.sort(() => rng() - 0.5).slice(0, pairsNeeded)

    const duplicated = [...shuffled, ...shuffled]
    const finalOrder = duplicated.sort(() => rng() - 0.5)

    const inits: CardInit[] = finalOrder.map((weapon, idx) => ({
      id: `${weapon.id}-${idx}`,
      weapon,
    }))
    const promises: Promise<unknown>[] = []
    weapons.forEach((weapon) => {
      promises.push(Assets.load(weapon.texturePath))
    })
    await Promise.all(promises)

    const backTexture = Texture.from('/assets/backImage.png')

    await Assets.load('/assets/backImage.png')
    const backTex = Texture.from('/assets/backImage.png')

    const frontTex = this.makeRectTexture(cardWidth, cardHeight, 0xffffff)

    this.board.build(inits, backTex, frontTex)

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
    if (this.flippedCard.length === 2) return

    if (card.isMatched || card.isFlipped) return
    card.flip()
    this.flippedCard.push(card)
    if (this.flippedCard.length === 2) {
      this.moves++
      this.checkPair()
    }
  }

  private checkPair() {
    const [c1, c2] = this.flippedCard
    if (c1.weapon.id === c2.weapon.id) {
      c1.setMatched()
      c2.setMatched()
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
}
