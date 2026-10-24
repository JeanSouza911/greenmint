
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
    createdAt: '2026-10-20',
    popularityScore: 95,
    editions: [
  { id: 'standard', name: 'Standard', stock: 5 },
  { id: 'rare', name: 'Rare', stock: 2 },
],
  images: [placeholderImage],

  },
  {
    id: 'nft-002',
    name: 'Sage Nomad #009',
    creator: 'Kurio Studio',
    category: 'Colecionáveis',
    imageUrl: placeholderImage,
    priceEth: '1.69',
    available: true,
    createdAt: '2026-10-15',
    popularityScore: 72,
    editions: [
  { id: 'standard', name: 'Standard', stock: 3 },
  { id: 'rare', name: 'Exclusive', stock: 0 },
],
    images: [placeholderImage],
  },
  {
    id: 'nft-003',
    name: 'Neon Vessel #552',
    creator: 'Kurio Studio',
    category: 'Arte digital',
    imageUrl: placeholderImage,
    priceEth: '1.99',
    available: true,
    createdAt: '2026-10-22',
    popularityScore: 88,
    editions: [
  { id: 'standard', name: 'Standard', stock: 4 },
],
    images: [placeholderImage],
  },
]
