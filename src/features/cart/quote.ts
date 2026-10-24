
import { api } from '../../lib/api'

export interface CartQuote {
  subtotalEth: string
  discountEth: string
  networkFeeEth: string
  totalEth: string
  coupon: string | null
}

export async function getCartQuote(
  coupon?: string,
  signal?: AbortSignal,
): Promise<CartQuote> {
  const { data } = await api.post<CartQuote>(
    '/cart/quote',
    { coupon: coupon || null },
    { signal },
  )

  return data
}
