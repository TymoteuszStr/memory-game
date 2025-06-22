import { Graphics, Sprite, Texture, Container } from 'pixi.js'
import { RARITY_GRADIENTS, type Rarity } from '@/game/types'

export function createCardContainer(tex: Texture, w: number, h: number, radius = 8): Container {
  const container = new Container()

  const image = new Sprite(tex)
  const scale = Math.max(w / tex.width, h / tex.height)
  image.scale.set(scale)
  image.anchor.set(0.5)
  image.x = w / 2
  image.y = h / 2

  const mask = new Graphics().roundRect(0, 0, w, h, radius).fill({ color: 0xffffff })
  image.mask = mask
  container.addChild(mask, image)

  return container
}

export function createCardContainerWithGradient(
  tex: Texture,
  rarity: Rarity,
  w: number,
  h: number,
  radius = 8,
): Container {
  const outer = new Container()

  const mask = new Graphics().roundRect(0, 0, w, h, radius).fill({ color: 0xffffff })
  outer.addChild(mask)

  const content = new Container()
  content.mask = mask
  outer.addChild(content)

  const [top, bottom] = RARITY_GRADIENTS[rarity]
  const gradTex = createGradientTexture(top, bottom, w, h)
  const bg = new Sprite(gradTex)
  content.addChild(bg)

  const image = new Sprite(tex)
  const scaleFactor = 0.85
  const scale = Math.min((w * scaleFactor) / tex.width, (h * scaleFactor) / tex.height)
  image.scale.set(scale)
  image.anchor.set(0.5)
  image.x = w / 2
  image.y = h / 2
  content.addChild(image)

  const border = new Graphics()
    .roundRect(0, 0, w, h, radius)
    .stroke({ width: 8, color: 0xf3f3f3, alignment: 1 })
  outer.addChild(border)

  return outer
}

function createGradientTexture(
  colorTop: string,
  colorBottom: string,
  w: number,
  h: number,
): Texture {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h

  const ctx = canvas.getContext('2d')!
  const grad = ctx.createLinearGradient(0, 0, 0, h)
  grad.addColorStop(0, colorTop)
  grad.addColorStop(1, colorBottom)

  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  return Texture.from(canvas)
}
