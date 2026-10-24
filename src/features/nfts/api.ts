
import { api } from '../../lib/api'
import type { NFT } from './types'

export interface NFTQueryParams {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  sort?: 'recent' | 'price-asc' | 'price-desc'
  page?: number
  limit?: number
  view?: 'all' | 'new' | 'trending'
}

export interface NFTListResponse {
  items: NFT[]
  total: number
  page: number
  totalPages: number
}

export async function getNFTs(
  params: NFTQueryParams = {},
  signal?: AbortSignal,
): Promise<NFTListResponse> {
  const { data } = await api.get<NFTListResponse>('/nfts', {
    params,
    signal,
  })

  return data
}

export async function getNFTById(
  id: string,
  signal?: AbortSignal,
): Promise<NFT> {
  const { data } = await api.get<NFT>(
    `/nfts/${encodeURIComponent(id)}`,
    { signal },
  )

  return data
}
