
export interface CartItem {
  id: string
  nftId: string
  editionId: string
  quantity: number
  priceEth: string
}

export interface Cart {
  items: CartItem[]
}

export interface AddCartItemInput {
  nftId: string
  editionId: string
  quantity: number
}
