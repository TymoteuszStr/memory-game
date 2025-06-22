import { Texture } from 'pixi.js'
import type { CardInit } from '@/game/types'
import { Card } from '@/game/Card'

export interface BoardOptions {
  cols: number
  rows: number
  gap: number
  margin?: number
}

export class Board {
  readonly cards: Card[] = []
  readonly opts: BoardOptions
  cardSide = 0

  constructor(opts: BoardOptions) {
    this.opts = { margin: 8, ...opts }
  }

  build(cardData: CardInit[], backTex: Texture, frontTex: Texture) {
    this.cards.length = 0
    cardData.forEach((data, index) => {
      const card = new Card(data.weapon, backTex, frontTex, {
        w: this.cardSide,
        h: this.cardSide,
      })
      this.setCardPosition(card, index)
      this.cards.push(card)
    })
  }

  private setCardPosition(card: Card, index: number) {
    const { gap, cols } = this.opts
    const col = index % cols
    const row = Math.floor(index / cols)
    card.x = this.opts.margin! + gap + col * (this.cardSide + gap) + this.cardSide / 2
    card.y = this.opts.margin! + gap + row * (this.cardSide + gap) + this.cardSide / 2
  }

  resize(w: number, h: number) {
    const { cols, rows, gap, margin } = this.opts

    const freeW = w - margin! * 2 - gap * (cols + 1)
    const freeH = h - margin! * 2 - gap * (rows + 1)

    this.cardSide = Math.floor(Math.min(freeW / cols, freeH / rows))

    this.cards.forEach((card, index) => {
      card.resize(this.cardSide)
      this.setCardPosition(card, index)
    })
  }
}
