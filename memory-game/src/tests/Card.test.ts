import { describe, it, expect, vi, beforeEach, afterAll, beforeAll } from 'vitest'
import { Card } from '@/game/Card'
import { CARD_CLICK, Rarity, type Weapon } from '@/game/types'
import { Texture } from 'pixi.js'

const tickerCallbacks = new Set<(delta: any) => void>()
vi.mock('pixi.js', () => {
  class MockContainer {
    children: any[] = []
    pivot = { set: vi.fn() }
    scale = {
      x: 1,
      y: 1,
      set: vi.fn(function (this: { x: number; y: number }, val: number) {
        this.x = val
        this.y = val
      }),
    }
    rotation = 0
    cursor = ''
    eventMode = ''
    width = 0
    height = 0
    parent = null
    _listeners = new Map<string, ((...args: any[]) => void)[]>()

    on(event: string, fn: (...args: any[]) => void) {
      if (!this._listeners.has(event)) this._listeners.set(event, [])
      this._listeners.get(event)!.push(fn)
    }
    emit(event: string, ...args: any[]) {
      this._listeners.get(event)?.forEach((fn) => fn(...args))
    }
    addChild(child: any) {
      this.children.push(child)
      child.parent = this
      return child
    }
    removeChildren() {
      this.children = []
    }
  }

  const mockTicker = {
    add: vi.fn((cb) => tickerCallbacks.add(cb)),
    remove: vi.fn((cb) => tickerCallbacks.delete(cb)),
  }

  return {
    Container: MockContainer,
    Ticker: {
      get shared() {
        return mockTicker
      },
    },
    Texture: { from: vi.fn(), EMPTY: {} },
    FederatedPointerEvent: class {},
  }
})

vi.mock('@/game/createCardContainer', () => ({
  createCardContainer: vi.fn(() => ({})),
  createCardContainerWithGradient: vi.fn(() => ({})),
}))

const mockWeapon: Weapon = {
  id: '1',
  name: 'Sword',
  rarity: Rarity.Consumer,
  texturePath: 'sword.png',
}

const createTestCard = () => {
  return new Card('test-id', mockWeapon, Texture.EMPTY, Texture.EMPTY, { w: 100, h: 100 })
}

describe('Card', () => {
  let card: Card

  beforeEach(() => {
    tickerCallbacks.clear()
    card = createTestCard()
  })


  it('initializes correctly', () => {
    expect(card).toBeDefined()
    expect(card.id).toBe('test-id')
    expect(card.weapon).toEqual(mockWeapon)
    expect(card.cursor).toBe('pointer')
  })

  it('emits CARD_CLICK on pointerdown', () => {
    const spy = vi.fn()
    card.on(CARD_CLICK, spy)
    card.emit('pointerdown', {} as any)
    expect(spy).toHaveBeenCalledWith(card)
  })

  it('flip() flips the card and toggles isFlipped', async () => {
    vi.useFakeTimers()
    const originalIsFlipped = card.isFlipped

    const flipPromise = card.flip()

    vi.advanceTimersByTime(75)
    tickerCallbacks.forEach((cb) => cb(1))

    vi.advanceTimersByTime(75)
    tickerCallbacks.forEach((cb) => cb(1))

    await flipPromise

    expect(card.isFlipped).toBe(!originalIsFlipped)
    expect(card.flipping).toBe(false)
    vi.useRealTimers()
  })

  it('flip() resolves immediately if already flipping', async () => {
    card.flipping = true
    await expect(card.flip()).resolves.toBeUndefined()
  })

  it('flip() resolves immediately if matched', async () => {
    card.isMatched = true
    await expect(card.flip()).resolves.toBeUndefined()
  })

  it('setMatched() updates isMatched', () => {
    expect(card.isMatched).toBe(false)
    card.setMatched(true)
    expect(card.isMatched).toBe(true)
  })

  it('resize() updates target side and pivot', () => {
    card.resize(200)
    expect(card['targetSide']).toBe(200)
    expect(card.pivot.set).toHaveBeenCalledWith(100, 100)
  })

  it('showFace(true) sets front and flips state', () => {
    card.showFace(true)
    expect(card.isFlipped).toBe(true)
  })

  it('showFace(false) sets back and flips state', () => {
    card.showFace(false)
    expect(card.isFlipped).toBe(false)
  })

  it('parallax updates rotation and scale smoothly', () => {
    ;(card as any).parent = {}
    card['targetRotation'] = 0.05
    card['targetScale'] = 1.01
    const initialRotation = card.rotation
    const initialScale = card.scale.x

    card['updateParallax']()

    expect(card.rotation).toBeGreaterThan(initialRotation)
    expect(card.scale.x).toBeGreaterThan(initialScale)
  })

  it('handlePointerMove() updates targetRotation and targetScale', () => {
    const mockEvent: any = {
      data: {
        getLocalPosition: () => ({ x: 150, y: 0 }),
      },
    }
    card.width = 200
    card['handlePointerMove'](mockEvent)
    expect(card['targetRotation']).not.toBe(0)
    expect(card['targetScale']).toBe(card['maxScale'])
  })

  it('handlePointerOut() resets targetRotation and targetScale', () => {
    card['targetRotation'] = 0.1
    card['targetScale'] = 1.2
    card['handlePointerOut']()
    expect(card['targetRotation']).toBe(0)
    expect(card['targetScale']).toBe(1)
  })
})
