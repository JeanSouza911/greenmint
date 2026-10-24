import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { addCartItem } from '../../features/cart/api'
import { useState } from 'react'
import type { NFT } from '../../features/nfts/types'

interface NFTPurchaseOptionsProps {
  nft: NFT
}

export function NFTPurchaseOptions({
  nft,
}: NFTPurchaseOptionsProps) {
  const [editionId, setEditionId] = useState(
    nft.editions.find((edition) => edition.stock > 0)?.id ?? '',
  )
  const [quantity, setQuantity] = useState(1)

  const selectedEdition = nft.editions.find(
    (edition) => edition.id === editionId,
  )

  const stock = selectedEdition?.stock ?? 0
  const canPurchase = nft.available && stock > 0

  const queryClient = useQueryClient()
const mutation = useMutation({
  mutationFn: addCartItem,
  onSuccess: () => {
    void queryClient.invalidateQueries({
      queryKey: ['cart'],
    })
  },
})

  return (
    <div className="space-y-5">
      <div>
        <label
          htmlFor="nft-edition"
          className="mb-2 block text-sm font-bold"
        >
          Edição
        </label>

        <select
          id="nft-edition"
          value={editionId}
          onChange={(event) => {
            setEditionId(event.target.value)
            setQuantity(1)
          }}
          className="w-full rounded border border-[#674531] bg-surface px-3 py-3"
        >
          {nft.editions.map((edition) => (
            <option
              key={edition.id}
              value={edition.id}
              disabled={edition.stock === 0}
            >
              {edition.name}
              {edition.stock === 0 ? ' — Esgotada' : ''}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="nft-quantity"
          className="mb-2 block text-sm font-bold"
        >
          Quantidade
        </label>

        <input
          id="nft-quantity"
          type="number"
          min={1}
          max={Math.max(stock, 1)}
          step={1}
          value={quantity}
          disabled={!canPurchase}
          onChange={(event) => {
            const value = Number(event.target.value)

            if (Number.isInteger(value)) {
              setQuantity(
                Math.max(1, Math.min(value, stock)),
              )
            }
          }}
          className="w-32 rounded border border-[#674531] bg-surface px-3 py-3 disabled:opacity-50"
        />

        <p className="mt-2 text-sm text-text-secondary">
          {stock} unidade(s) disponíveis
        </p>
      </div>

      {!canPurchase && (
        <p role="status" className="text-sm text-accent">
          Edição indisponível para compra.
        </p>
      )}


<button
  type="button"
  disabled={!canPurchase || mutation.isPending}
  onClick={() =>
    mutation.mutate({
      nftId: nft.id,
      editionId,
      quantity,
    })
  }
  className="w-full rounded bg-accent px-5 py-3 font-bold text-page disabled:cursor-not-allowed disabled:opacity-50"
>
  {mutation.isPending
    ? 'Adicionando...'
    : 'Adicionar ao carrinho'}
</button>

{mutation.isSuccess && (
  <p role="status" className="text-sm text-green-400">
    NFT adicionado ao carrinho.
  </p>
)}

{mutation.isError && (
  <p role="alert" className="text-sm text-red-400">
    {axios.isAxiosError(mutation.error)
      ? mutation.error.response?.data?.message ??
        'Não foi possível adicionar ao carrinho.'
      : 'Não foi possível adicionar ao carrinho.'}
  </p>
)}

    </div>
  )
}
