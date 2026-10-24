
import { createFileRoute, Link } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { getCartQuote } from '../features/cart/quote'
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

  const mutationError =
    updateMutation.error ?? removeMutation.error

  const errorMessage = axios.isAxiosError(mutationError)
    ? mutationError.response?.data?.message ??
      'Não foi possível atualizar o carrinho.'
    : 'Não foi possível atualizar o carrinho.'

    const [couponInput, setCouponInput] = useState('')
const [appliedCoupon, setAppliedCoupon] = useState('')

const {
  data: quote,
  isPending: quotePending,
  isError: quoteError,
  error: quoteErrorDetail,
} = useQuery({
  queryKey: ['cart-quote', cart, appliedCoupon],
  queryFn: ({ signal }) => getCartQuote(appliedCoupon, signal),
  enabled: Boolean(cart?.items.length),
  retry: false,
})

const quoteErrorMessage =
  axios.isAxiosError(quoteErrorDetail)
    ? quoteErrorDetail.response?.data?.message
    : 'Não foi possível calcular a cotação.'

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

              
<form
  onSubmit={(event) => {
    event.preventDefault()
    setAppliedCoupon(couponInput.trim().toUpperCase())
  }}
  className="mb-6 space-y-3"
>
  <label htmlFor="coupon" className="block text-sm">
    Cupom de desconto
  </label>

  <input
    id="coupon"
    value={couponInput}
    onChange={(event) => setCouponInput(event.target.value)}
    placeholder="Digite seu cupom"
    className="w-full rounded border border-[#674531] bg-page px-3 py-2"
  />

  <button
    type="submit"
    className="rounded bg-accent px-4 py-2 font-bold text-page"
  >
    Aplicar cupom
  </button>

  {appliedCoupon && (
    <button
      type="button"
      onClick={() => {
        setCouponInput('')
        setAppliedCoupon('')
      }}
      className="ml-3 text-sm text-text-secondary underline"
    >
      Remover cupom
    </button>
  )}
</form>

{quotePending ? (
  <p role="status">Calculando cotação...</p>
) : quoteError ? (
  <p role="alert" className="text-sm text-red-400">
    {quoteErrorMessage}
  </p>
) : quote ? (
  <dl className="space-y-4 text-sm">
    <div className="flex justify-between gap-3">
      <dt>Subtotal</dt>
      <dd>{quote.subtotalEth} ETH</dd>
    </div>

    <div className="flex justify-between gap-3">
      <dt>Desconto</dt>
      <dd>{quote.discountEth} ETH</dd>
    </div>

    <div className="flex justify-between gap-3">
      <dt>Taxa de rede</dt>
      <dd>{quote.networkFeeEth} ETH</dd>
    </div>

    <div className="flex justify-between gap-3 border-t border-[#674531] pt-4 text-base font-bold">
      <dt>Total</dt>
      <dd className="text-accent">{quote.totalEth} ETH</dd>
    </div>
  </dl>
) : null}

<Link
  to="/checkout"
  search={{ coupon: appliedCoupon }}
  disabled={quotePending || quoteError || !quote}
  className={`mt-6 block rounded bg-accent px-5 py-3 text-center font-bold text-page ${
    quotePending || quoteError || !quote
      ? 'pointer-events-none opacity-50'
      : ''
  }`}
>
  Ir para pagamento
</Link>

            </aside>
          </div>
        )}
      </main>
    </>
  )
}
