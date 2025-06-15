import seedrandom from 'seedrandom'

export type RNG = () => number

export function createRng(seed: string): RNG {
  return seedrandom(seed)
}
