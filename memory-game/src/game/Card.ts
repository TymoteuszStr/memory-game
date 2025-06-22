import { Texture, Container, Ticker } from 'pixi.js'
import { CARD_CLICK, type Weapon } from '@/game/types'
import { createCardContainer, createCardContainerWithGradient } from '@/game/createCardContainer'

const HALF_PROGRESS = 0.5
const FULL_PROGRESS = 1

export class Card extends Container {
  readonly id: string
  readonly weapon: Weapon
  private front: Container
  private back: Container
  private targetSide = 0
  private flipping = false
  private swapDone = false
  private startTime = 0
  private readonly duration = 200
  private readonly ticker = Ticker.shared
  public isFlipped = false
  public isMatched = false

  constructor(
    id: string,
    weapon: Weapon,
    backTexture: Texture,
    frontTexture: Texture,
    size: { w: number; h: number },
  ) {
    super()

    this.weapon = weapon
    this.id = id

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
    this.on('pointerdown', () => this.emit(CARD_CLICK, this))
  }

  public flip(): Promise<void> {
    if (this.flipping || this.isMatched) return Promise.resolve()

    this.flipping = true
    this.swapDone = false
    this.startTime = performance.now()

    return new Promise((resolve) => {
      const tick = () => {
        const progress = (performance.now() - this.startTime) / this.duration

        if (!this.swapDone && progress >= HALF_PROGRESS) {
          this.setNewContainer(this.isFlipped ? this.back : this.front)
          this.swapDone = true
        }

        this.scale.x =
          progress < HALF_PROGRESS ? FULL_PROGRESS - progress * 2 : (progress - HALF_PROGRESS) * 2

        if (progress >= FULL_PROGRESS) {
          this.scale.x = FULL_PROGRESS
          this.isFlipped = !this.isFlipped
          this.flipping = false
          this.ticker.remove(tick)
          resolve()
        }
      }
      this.ticker.add(tick)
    })
  }
  private applyTargetSize(c: Container) {
    if (this.targetSide) {
      c.width = this.targetSide
      c.height = this.targetSide
    }
  }

  public setNewContainer(container: Container) {
    this.removeChildren()
    this.addChild(container)
    this.applyTargetSize(container)
  }

  public setMatched(arg: boolean) {
    this.isMatched = arg
  }

  public resize(side: number) {
    this.targetSide = side
    this.applyTargetSize(this.front)
    this.applyTargetSize(this.back)
    this.pivot.set(side / 2, side / 2)
  }

  public showFace(front: boolean) {
    this.setNewContainer(front ? this.front : this.back)
    this.isFlipped = front
  }
}
