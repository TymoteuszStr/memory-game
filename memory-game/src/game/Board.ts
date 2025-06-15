import { Texture } from 'pixi.js'
import type { CardInit } from '@/game/types'
import { Card } from '@/game/Card'

export interface BoardOptions {
  cols: number
  rows: number
  gap: number
  cardWidth: number
  cardHeight: number
}

export class Board {
  readonly cards: Card[] = []
  readonly opts: BoardOptions

  constructor(opts: BoardOptions) {
    this.opts = opts
  }

  build(cardData: CardInit[], backTex: Texture, frontTex: Texture) {
    this.cards.length = 0
    const { cols, gap, cardWidth, cardHeight } = this.opts
    const cardSize = { w: cardWidth, h: cardHeight }
    cardData.forEach((data, index) => {
      const card = new Card(data.weapon, backTex, frontTex, cardSize)

      const col = index % cols
      const row = Math.floor(index / cols)

      card.x = col * (cardWidth + gap)
      card.y = row * (cardHeight + gap)

      this.cards.push(card)
    })
  }
}
