
import { createFileRoute, Link } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { Header } from '../components/layout/Header'
import {
  getCart,
  updateCartItem,
  removeCartItem,
} from '../features/cart/api'

export const Route = createFileRoute('/cart')({
  component: CartPage,
})

function formatEth(value: bigint): string {
  const whole = value / 10n ** 18n
  const fraction = (value % (10n ** 18n))
    .toString()
    .padStart(18, '0')
    .replace(/0+$/, '')

  return fraction ? `${whole}.${fraction}` : String(whole)
}

function toWei(value: string): bigint {
  if (!/^\d+(\.\d{1,18})?$/.test(value)) {
    throw new Error('Preço ETH inválido')
  }

  const [whole, fraction = ''] = value.split('.')

  return BigInt(whole) * 10n ** 18n +
    BigInt(fraction.padEnd(18, '0'))
}

function CartPage() {
  const queryClient = useQueryClient()

  const {
    data: cart,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      quantity,
    }: {
      id: string
      quantity: number
    }) => updateCartItem(id, quantity),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(['cart'], updatedCart)
    },
  })

  const removeMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(['cart'], updatedCart)
    },
  })

  const busy = updateMutation.isPending ||
    removeMutation.isPending

  const subtotal = cart?.items.reduce(
    (total, item) =>
      total + toWei(item.priceEth) * BigInt(item.quantity),
    0n,
  ) ?? 0n

  const mutationError =
    updateMutation.error ?? removeMutation.error

  const errorMessage = axios.isAxiosError(mutationError)
    ? mutationError.response?.data?.message ??
      'Não foi possível atualizar o carrinho.'
    : 'Não foi possível atualizar o carrinho.'

  return (
    <>
      <Header />

      <main className="mx-auto max-w-300 px-4 py-12 sm:px-6 xl:px-0">
        <h1 className="mb-8 text-3xl font-bold">
          Meu carrinho
        </h1>

        {isPending ? (
          <p role="status">Carregando carrinho...</p>
        ) : isError ? (
          <div role="alert">
            <p>Não foi possível carregar o carrinho.</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 text-accent underline"
            >
              Tentar novamente
            </button>
          </div>
        ) : cart.items.length === 0 ? (
          <div className="rounded-lg bg-surface p-8">
            <p className="mb-5">Seu carrinho está vazio.</p>

            <Link
              to="/"
              search={{
                search: '',
                category: 'Todas',
                minPrice: undefined,
                maxPrice: undefined,
                sort: 'recent',
                view: 'all',
                page: 1,
              }}
              className="text-accent underline"
            >
              Explorar NFTs
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {cart.items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-lg bg-surface p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-2">
                      <Link
                        to="/nfts/$nftId"
                        params={{ nftId: item.nftId }}
                        className="font-bold hover:text-accent"
                      >
                        NFT {item.nftId}
                      </Link>

                      <p className="text-sm text-text-secondary">
                        Edição: {item.editionId}
                      </p>

                      <p className="font-bold text-accent">
                        {item.priceEth} ETH / unidade
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <label
                        htmlFor={`quantity-${item.id}`}
                        className="text-sm"
                      >
                        Qtd.
                      </label>

                      <input
                        id={`quantity-${item.id}`}
                        type="number"
                        min={1}
                        step={1}
                        disabled={busy}
                        value={item.quantity}
                        onChange={(event) => {
                          const quantity = Number(
                            event.target.value,
                          )

                          if (
                            Number.isInteger(quantity) &&
                            quantity >= 1 &&
                            quantity !== item.quantity
                          ) {
                            updateMutation.mutate({
                              id: item.id,
                              quantity,
                            })
                          }
                        }}
                        className="w-20 rounded border border-[#674531] bg-page px-2 py-2"
                      />

                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          removeMutation.mutate(item.id)
                        }
                        className="text-sm text-red-400 hover:underline disabled:opacity-50"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              {mutationError && (
                <p role="alert" className="text-sm text-red-400">
                  {errorMessage}
                </p>
              )}
            </div>

            <aside className="rounded-lg bg-surface p-6">
              <h2 className="mb-6 text-xl font-bold">
                Resumo do carrinho
              </h2>

              <div className="flex justify-between gap-3">
                <span>Subtotal estimado</span>
                <strong>{formatEth(subtotal)} ETH</strong>
              </div>

              <p className="mt-5 text-xs leading-5 text-text-secondary">
                Desconto, taxa de rede e total serão
                calculados pela API de cotação antes
                da confirmação da compra.
              </p>
            </aside>
          </div>
        )}
      </main>
    </>
  )
}
