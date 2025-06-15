import { Graphics, Sprite, Texture, Container } from 'pixi.js'

export function createCardSprite(tex: Texture, w: number, h: number, radius = 8): Container {
  const container = new Container()

  const border = new Graphics()
    .roundRect(0, 0, w, h, radius)
    .stroke({ width: 8, color: 0xffffff })
    .fill({ color: 0x1f2937 })
  container.addChild(border)

  const image = new Sprite(tex)
  const scale = Math.max(w / tex.width, h / tex.height)
  image.scale.set(scale)
  image.anchor.set(0.5)
  image.x = w / 2
  image.y = h / 2

  const mask = new Graphics().roundRect(0, 0, w, h, radius).fill({ color: 0x1f2937 })
  image.mask = mask
  container.addChild(mask, image)

  return container
}
