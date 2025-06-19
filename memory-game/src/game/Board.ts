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
    const { cardWidth, cardHeight } = this.opts
    cardData.forEach((data, index) => {
      const card = new Card(data.weapon, backTex, frontTex, { w: cardWidth, h: cardHeight })
      this.setCardPosition(card, index)
      this.cards.push(card)
    })
  }

  setCardPosition(card: Card, index: number) {
    const { gap, cols } = this.opts
    const col = index % cols
    const row = Math.floor(index / cols)
    card.x = gap + col * (card.width + gap) + card.width / 2
    card.y = gap + row * (card.height + gap) + card.height / 2
  }
}
