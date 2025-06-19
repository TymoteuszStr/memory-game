import { Texture, Container, Ticker } from 'pixi.js'
import { type Weapon } from '@/game/types'
import { createCardContainer, createCardContainerWithGradient } from '@/game/createCardContainer'
const MAX_PROGRESS = 1
const HALF_PROGRESS = 0.5

export class Card extends Container {
  readonly weapon: Weapon
  private front: Container
  private back: Container
  private flipping = false
  private swapDone = false
  private startTime = 0
  private duration = 200
  private ticker = Ticker.shared
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
    this.setNewContainer(this.back)

    this.pivot.set(size.w / 2, size.h / 2)
    this.eventMode = 'static'
    this.cursor = 'pointer'

    this.on('pointerdown', () => {
      this.emit('card:click', this)
    })
  }

  flip(): Promise<void> {
    if (this.flipping || this.isMatched) return Promise.resolve()

    this.setFlipping(true)
    this.setSwapDone(false)
    this.startTime = performance.now()

    return new Promise((resolve) => {
      const tick = () => {
        const flipProgress = (performance.now() - this.startTime) / this.duration

        if (!this.swapDone && flipProgress >= HALF_PROGRESS) {
          this.setNewContainer(this.isFlipped ? this.back : this.front)
          this.setSwapDone(true)
        }

        if (flipProgress >= MAX_PROGRESS) {
          this.finishFilpAnimation(tick)
          resolve()
        }

        this.setXScale(this.calculateXScale(flipProgress))
      }
      this.ticker.add(tick)
    })
  }

  calculateXScale = (currentProfress: number) => {
    return currentProfress < HALF_PROGRESS
      ? MAX_PROGRESS - currentProfress * 2
      : (currentProfress - HALF_PROGRESS) * 2
  }

  finishFilpAnimation(animationFunction: () => void) {
    this.setXScale(MAX_PROGRESS)
    this.setIsFlipped(!this.isFlipped)
    this.setFlipping(false)
    this.ticker.remove(animationFunction)
  }

  setNewContainer(container: Container) {
    this.removeChildren()
    this.addChild(container)
  }
  setMatched(arg: boolean) {
    this.isMatched = arg
  }

  setSwapDone(arg: boolean) {
    this.swapDone = arg
  }
  setIsFlipped(arg: boolean) {
    this.isFlipped = arg
  }

  setFlipping(arg: boolean) {
    this.flipping = arg
  }
  setXScale(arg: number) {
    this.scale.x = arg
  }
}
