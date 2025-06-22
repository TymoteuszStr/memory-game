import { Texture, Container, Ticker } from 'pixi.js'
import { type Weapon } from '@/game/types'
import { createCardContainer, createCardContainerWithGradient } from '@/game/createCardContainer'

const HALF = 0.5

export class Card extends Container {
  readonly weapon: Weapon
  private front: Container
  private back: Container
  private targetSide = 0
  private flipping = false
  private swapDone = false
  private startTime = 0
  private readonly duration = 200
  private readonly ticker = Ticker.shared

  isFlipped = false
  isMatched = false

  constructor(
    weapon: Weapon,
    backTexture: Texture,
    frontTexture: Texture,
    size: { w: number; h: number },
  ) {
    super()

    this.weapon = weapon

    this.front = createCardContainerWithGradient(
      Texture.from(weapon.texturePath) || frontTexture,
      weapon.rarity,
      size.w,
      size.h,
    )
    this.back = createCardContainer(backTexture, size.w, size.h)

    this.pivot.set(size.w / 2, size.h / 2)
    this.eventMode = 'static'
    this.cursor = 'pointer'

    this.setNewContainer(this.back)

    this.on('pointerdown', () => this.emit('card:click', this))
  }

  /* ---------- public ---------- */

  flip(): Promise<void> {
    if (this.flipping || this.isMatched) return Promise.resolve()

    this.flipping = true
    this.swapDone = false
    this.startTime = performance.now()

    return new Promise((resolve) => {
      const tick = () => {
        const progress = (performance.now() - this.startTime) / this.duration

        if (!this.swapDone && progress >= HALF) {
          this.setNewContainer(this.isFlipped ? this.back : this.front)
          this.swapDone = true
        }

        this.scale.x = progress < HALF ? 1 - progress * 2 : (progress - HALF) * 2

        if (progress >= 1) {
          this.scale.x = 1
          this.isFlipped = !this.isFlipped
          this.flipping = false
          this.ticker.remove(tick)
          resolve()
        }
      }
      this.ticker.add(tick)
    })
  }

  resize(side: number) {
    this.targetSide = side
    this.applyTargetSize(this.front)
    this.applyTargetSize(this.back)
    this.pivot.set(side / 2, side / 2)
  }

  /* ---------- private ---------- */

  private setNewContainer(container: Container) {
    this.removeChildren()
    this.addChild(container)
    this.applyTargetSize(container)
  }

  private applyTargetSize(c: Container) {
    if (this.targetSide) {
      c.width = this.targetSide
      c.height = this.targetSide
    }
  }
  setMatched(arg: boolean) {
    this.isMatched = arg
  }
}
