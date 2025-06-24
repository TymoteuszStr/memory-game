import { describe, it, expect, vi } from 'vitest'
import { shuffleArray } from '@/game/shuffleArray'

vi.mock('@/game/rng', () => {
  return {
    createRng: vi.fn(() => {
      return () => 0.5
    }),
  }
})

describe('shuffleArray', () => {
  it('should return a new array with same elements in different order', () => {
    const input = [1, 2, 3, 4]
    const result = shuffleArray(input, 'seed')

    expect(result.sort()).toEqual(input.sort())

    expect(result).not.toBe(input)
  })

  it('should be deterministic with the same seed', () => {
    const input = ['a', 'b', 'c', 'd']
    const result1 = shuffleArray(input, 'same-seed')
    const result2 = shuffleArray(input, 'same-seed')

    expect(result1).toEqual(result2)
  })

  it('should return empty array if input is empty', () => {
    expect(shuffleArray([], 'any')).toEqual([])
  })

  it('should return single-element array unchanged', () => {
    expect(shuffleArray(['only'], 'seed')).toEqual(['only'])
  })
})
