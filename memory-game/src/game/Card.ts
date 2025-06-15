import { Sprite, Texture, Container } from 'pixi.js'
import type { Weapon } from '@/game/types'

export class Card extends Container {
  private front: Sprite
  private back: Sprite
  isFlipped = false
  isMatched = false
  readonly weapon: Weapon

  constructor(weapon: Weapon, backTexture: Texture, frontTexture: Texture) {
    super()
    this.weapon = weapon
    this.front = new Sprite(Texture.from(weapon.texturePath) || frontTexture)
    this.back = new Sprite(backTexture)

    this.addChild(this.back)
    this.eventMode = 'static'
    this.cursor = 'pointer'
    this.on('pointerdown', () => this.emit('card:click', this))
  }

  flip() {
    this.isFlipped = !this.isFlipped
    this.removeChildren()
    this.addChild(this.isFlipped ? this.front : this.back)
  }

  setMatched() {
    this.isMatched = true
  }
}
