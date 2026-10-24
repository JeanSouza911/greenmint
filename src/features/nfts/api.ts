import { api } from '../../lib/api'
import type { NFT } from './types'

export async function getNFTs(): Promise<NFT[]> {
  const { data } = await api.get<NFT[]>('/nfts')
  return data
}