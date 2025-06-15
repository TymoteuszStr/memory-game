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
