export enum Rarity {
  Consumer = 'consumer',
  Industrial = 'industrial',
  MilSpec = 'milspec',
  Restricted = 'restricted',
  Classified = 'classified',
  Covert = 'covert',
}

export interface Weapon {
  id: string
  name: string
  rarity: Rarity
  texturePath: string
}

export interface CardInit {
  id: string
  weapon: Weapon
}

export const RARITY_GRADIENTS: Record<Rarity, [string, string]> = {
  [Rarity.Consumer]: ['#cfd8e1', '#aab8c2'],
  [Rarity.Industrial]: ['#8bb5e5', '#5e98d9'],
  [Rarity.MilSpec]: ['#4b69ff', '#304dbf'],
  [Rarity.Restricted]: ['#a084f9', '#8847ff'],
  [Rarity.Classified]: ['#e56eff', '#d32ce6'],
  [Rarity.Covert]: ['#ff7b7b', '#eb4b4b'],
}
