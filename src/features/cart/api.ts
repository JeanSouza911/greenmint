
import { api } from '../../lib/api'
import type { Cart, AddCartItemInput } from './types'

export async function getCart(): Promise<Cart> {
  const { data } = await api.get<Cart>('/cart')

  return data
}

export async function addCartItem(
  input: AddCartItemInput,
): Promise<Cart> {
  const { data } = await api.post<Cart>(
    '/cart/items',
    input,
  )

  return data
}

export async function updateCartItem(
  id: string,
  quantity: number,
): Promise<Cart> {
  const { data } = await api.patch<Cart>(
    `/cart/items/${encodeURIComponent(id)}`,
    { quantity },
  )

  return data
}

export async function removeCartItem(
  id: string,
): Promise<Cart> {
  const { data } = await api.delete<Cart>(
    `/cart/items/${encodeURIComponent(id)}`,
  )

  return data
}
