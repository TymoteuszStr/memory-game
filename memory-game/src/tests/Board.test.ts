import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Board } from '@/game/Board'
import type { BoardOptions } from '@/game/Board'
import { Card } from '@/game/Card'
import type { CardInit } from '@/game/types'
import { Texture } from 'pixi.js'
import { mockWeapons } from '@/game/mockWeapons'

vi.mock('../game/Card', () => {
  return {
    Card: class {
      id: string
      weapon: any
      width: number
      height: number
      x = 0
      y = 0
      constructor(
        id: string,
        weapon: any,
        backTex: any,
        frontTex: any,
        size: { w: number; h: number },
      ) {
        this.id = id
        this.weapon = weapon
        this.width = size.w
        this.height = size.h
      }
      resize() {}
    },
  }
})

describe('Board', () => {
  let board: Board
  let opts: BoardOptions
  let cardData: CardInit[]
  let backTex: Texture
  let frontTex: Texture

  beforeEach(() => {
    opts = { cols: 2, rows: 2, gap: 10, margin: 5 }
    board = new Board(opts)
    cardData = [
      { id: '1', weapon: mockWeapons[0] },
      { id: '2', weapon: mockWeapons[1] },
      { id: '3', weapon: mockWeapons[2] },
      { id: '4', weapon: mockWeapons[3] },
    ]
    backTex = {} as Texture
    frontTex = {} as Texture
  })

  it('should initialize with correct options and empty cards', () => {
    expect(board.opts.cols).toBe(2)
    expect(board.opts.rows).toBe(2)
    expect(board.opts.gap).toBe(10)
    expect(board.opts.margin).toBe(5)
    expect(board.cards).toEqual([])
  })

  it('should build cards with correct properties and positions', () => {
    board.cardSide = 50
    const setCardPositionSpy = vi.spyOn(board as any, 'setCardPosition')
    board.build(cardData, backTex, frontTex)
    expect(board.cards.length).toBe(4)
    board.cards.forEach((card, i) => {
      expect(card.id).toBe(cardData[i].id)
      expect(card.weapon).toBe(cardData[i].weapon)
      expect(card.width).toBe(50)
      expect(card.height).toBe(50)
      expect(setCardPositionSpy).toHaveBeenCalledWith(card, i)
    })
  })

  it('should set card position correctly in setCardPosition', () => {
    board.cardSide = 40
    const card = new Card('1', mockWeapons[0], backTex, frontTex, { w: 40, h: 40 })
    board['setCardPosition'](card, 2)
    const { gap, margin, cols } = board.opts
    const col = 2 % cols
    const row = Math.floor(2 / cols)
    const expectedX = margin! + gap + col * (board.cardSide + gap) + board.cardSide / 2
    const expectedY = margin! + gap + row * (board.cardSide + gap) + board.cardSide / 2
    expect(card.x).toBe(expectedX)
    expect(card.y).toBe(expectedY)
  })

  it('should resize board and cards correctly', () => {
    board.build(cardData, backTex, frontTex)
    const resizeSpy = vi.spyOn(Card.prototype, 'resize')
    board.resize(200, 200)
    expect(board.cardSide).toBe(Math.floor(Math.min((200 - 30) / 2, (200 - 30) / 2)))
    board.cards.forEach((card, i) => {
      const col = i % board.opts.cols
      const row = Math.floor(i / board.opts.cols)
      const boardW = board.opts.cols * board.cardSide + board.opts.gap * (board.opts.cols + 1)
      const offsetX = (200 - boardW) / 2
      const offsetY = board.opts.gap
      const expectedX =
        offsetX + board.opts.gap + col * (board.cardSide + board.opts.gap) + board.cardSide / 2
      const expectedY =
        offsetY + board.opts.gap + row * (board.cardSide + board.opts.gap) + board.cardSide / 2
      expect(card.x).toBe(expectedX)
      expect(card.y).toBe(expectedY)
      expect(resizeSpy).toHaveBeenCalledWith(board.cardSide)
    })
  })
})
