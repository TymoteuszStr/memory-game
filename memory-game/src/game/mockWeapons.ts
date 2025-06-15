import type { Weapon } from '@/game/types'
import { Rarity } from '@/game/types'

export const mockWeapons: Weapon[] = [
  { id: 'ak47', name: 'AK-47', rarity: Rarity.Covert, texturePath: '/assets/ak47-covert.avif' },
  { id: 'awp', name: 'AWP', rarity: Rarity.Covert, texturePath: '/assets/AWP-covert.avif' },
  {
    id: 'deserteagle',
    name: 'Desert-Eagle',
    rarity: Rarity.Restricted,
    texturePath: '/assets/desertEagle-restricted.avif',
  },
  { id: 'famas', name: 'FAMAS', rarity: Rarity.Covert, texturePath: '/assets/famas-covert.avif' },
  {
    id: 'galilar',
    name: 'Galil AR',
    rarity: Rarity.Restricted,
    texturePath: '/assets/GalilAR-restricted.avif',
  },
  {
    id: 'glock18',
    name: 'Glock 18',
    rarity: Rarity.Classified,
    texturePath: '/assets/glock-18-classified.avif',
  },

  {
    id: 'knife1',
    name: 'Knife #1',
    rarity: Rarity.Covert,
    texturePath: '/assets/knife1-covert.avif',
  },
  {
    id: 'knife2',
    name: 'Knife #2',
    rarity: Rarity.Covert,
    texturePath: '/assets/knife2-covert.avif',
  },
  {
    id: 'knife3',
    name: 'Knife #3',
    rarity: Rarity.Covert,
    texturePath: '/assets/knife3-covert.avif',
  },
  {
    id: 'knife4',
    name: 'Knife #4',
    rarity: Rarity.Covert,
    texturePath: '/assets/knife4-covert.avif',
  },
  {
    id: 'knife5',
    name: 'Knife #5',
    rarity: Rarity.Covert,
    texturePath: '/assets/knife5-covert.avif',
  },

  { id: 'm4a4', name: 'M4A4', rarity: Rarity.MilSpec, texturePath: '/assets/m4a4-milSpec.avif' },
  { id: 'mag7', name: 'MAG-7', rarity: Rarity.MilSpec, texturePath: '/assets/mag7-milSpec.avif' },
  { id: 'mp9', name: 'MP9', rarity: Rarity.MilSpec, texturePath: '/assets/mp9-milSpec.avif' },
  {
    id: 'nova',
    name: 'Nova',
    rarity: Rarity.Restricted,
    texturePath: '/assets/Nova-restricted.avif',
  },
  { id: 'p90', name: 'P90', rarity: Rarity.Restricted, texturePath: '/assets/p90-restricted.avif' },
  { id: 'p2000', name: 'P2000', rarity: Rarity.MilSpec, texturePath: '/assets/p2000-milspec.avif' },
  {
    id: 'ssg08',
    name: 'SSG 08',
    rarity: Rarity.MilSpec,
    texturePath: '/assets/ssg08-milspec.avif',
  },
  {
    id: 'ump45',
    name: 'UMP-45',
    rarity: Rarity.Classified,
    texturePath: '/assets/ump-45-classified.avif',
  },
  { id: 'usps', name: 'USP-S', rarity: Rarity.MilSpec, texturePath: '/assets/usps-milspec.avif' },
  {
    id: 'xm1014',
    name: 'XM1014',
    rarity: Rarity.MilSpec,
    texturePath: '/assets/xm1014-milspec.avif',
  },
  {
    id: 'zeusx27',
    name: 'Zeus-x27',
    rarity: Rarity.Restricted,
    texturePath: '/assets/zeusx27-restricted.avif',
  },
]
