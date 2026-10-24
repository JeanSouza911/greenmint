
import type { NFT } from './types'
import placeholderImage from '../../assets/hero.png'

export const nftFixtures: NFT[] = [
  {
    id: 'nft-001',
    name: 'Emerald Ape #042',
    creator: 'Kurio Studio',
    category: 'Arte digital',
    imageUrl: placeholderImage,
    priceEth: '1.19',
    available: true,
  },
  {
    id: 'nft-002',
    name: 'Sage Nomad #009',
    creator: 'Kurio Studio',
    category: 'Colecionáveis',
    imageUrl: placeholderImage,
    priceEth: '1.69',
    available: true,
  },
  {
    id: 'nft-003',
    name: 'Neon Vessel #552',
    creator: 'Kurio Studio',
    category: 'Arte digital',
    imageUrl: placeholderImage,
    priceEth: '1.99',
    available: true,
  },
]
