import { createRng } from '@/game/rng'

export function shuffleArray<T>(arr: T[], seed: string): T[] {
  const rng = createRng(seed)
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const tmp = a[i]
    a[i] = a[j]
    a[j] = tmp
  }
  return a
}
