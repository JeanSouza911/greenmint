
import { api } from '../../lib/api'
import type { CartItem } from '../cart/types'
import type { CartQuote } from '../cart/quote'

export interface Order {
  id: string
  status: 'pending' | 'confirmed' | 'declined'
  transactionId: string | null
  items: CartItem[]
  quote: CartQuote
  createdAt: string
}

export interface CreateOrderInput {
  idempotencyKey: string
  coupon: string | null
  expectedTotalEth: string
  walletAddress: string
  network: string
}

export async function createOrder(
  input: CreateOrderInput,
): Promise<Order> {
  const { data } = await api.post<Order>('/orders', input)

  return data
}

export async function getOrder(id: string): Promise<Order> {
  const { data } = await api.get<Order>(
    `/orders/${encodeURIComponent(id)}`,
  )

  return data
}
