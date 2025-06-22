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
      const card = new Card(data.id, data.weapon, backTex, frontTex, {
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
    const { cols, rows, gap } = this.opts

    const totalGapsX = gap * (cols + 1)
    const totalGapsY = gap * (rows + 1)

    const freeW = w - totalGapsX
    const freeH = h - totalGapsY

    this.cardSide = Math.floor(Math.min(freeW / cols, freeH / rows))

    const boardW = cols * this.cardSide + totalGapsX
    const boardH = rows * this.cardSide + totalGapsY

    const offsetX = (w - boardW) / 2
    const offsetY = (h - boardH) / 2

    this.cards.forEach((card, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)
      card.x = offsetX + gap + col * (this.cardSide + gap) + this.cardSide / 2
      card.y = offsetY + gap + row * (this.cardSide + gap) + this.cardSide / 2
      card.resize(this.cardSide)
    })
  }
}
