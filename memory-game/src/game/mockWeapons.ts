import type { Weapon } from '@/game/types'
import { Rarity } from '@/game/types'

export const mockWeapons: Weapon[] = [
  {
    id: 'ak47',
    name: 'AK‑47',
    rarity: Rarity.Covert,
    texturePath: 'assets/ak47.png',
  },
  {
    id: 'awp',
    name: 'AWP',
    rarity: Rarity.Covert,
    texturePath: 'assets/awp.png',
  },
  {
    id: 'm4a1s',
    name: 'M4A1‑S',
    rarity: Rarity.Classified,
    texturePath: 'assets/m4a1s.png',
  },
  {
    id: 'deagle',
    name: 'Desert Eagle',
    rarity: Rarity.MilSpec,
    texturePath: 'assets/deagle.png',
  },
]
