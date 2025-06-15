import { Sprite, Texture, Container, Assets } from 'pixi.js'
import type { Weapon } from '@/game/types'
import { createCardSprite } from './creatCardSprite'

export class Card extends Container {
  private front: Container
  private back: Container
  isFlipped = false
  isMatched = false
  readonly weapon: Weapon
  constructor(
    weapon: Weapon,
    backTexture: Texture,
    frontTexture: Texture,
    size: { w: number; h: number },
  ) {
    super()
    this.weapon = weapon
    this.front = createCardSprite(Texture.from(weapon.texturePath) || frontTexture, size.w, size.h)
    this.back = createCardSprite(backTexture, size.w, size.h)

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
