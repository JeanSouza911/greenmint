import { useRef, useState, type FormEvent } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { Header } from '../components/layout/Header'
import { getCart } from '../features/cart/api'
import { getCartQuote } from '../features/cart/quote'
import { createOrder } from '../features/orders/api'

export const Route = createFileRoute('/checkout')({
  validateSearch: (search: Record<string, unknown>) => ({
    coupon:
      typeof search.coupon === 'string'
        ? search.coupon
        : '',
  }),
  component: CheckoutPage,
})

function CheckoutPage() {
  const { coupon } = Route.useSearch()
  const navigate = useNavigate()
  const orderKey = useRef(crypto.randomUUID())

  const [walletAddress, setWalletAddress] = useState('')
  const [network, setNetwork] = useState('ethereum')

  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  })

  const quoteQuery = useQuery({
    queryKey: ['checkout-quote', coupon, cartQuery.data],
    queryFn: ({ signal }) => getCartQuote(coupon, signal),
    enabled: Boolean(cartQuery.data?.items.length),
    retry: false,
  })

  const orderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      void navigate({
        to: '/orders/$orderId',
        params: { orderId: order.id },
        replace: true,
      })
    },
  })

  const errorMessage = axios.isAxiosError(orderMutation.error)
    ? orderMutation.error.response?.data?.message ??
      'Não foi possível processar a compra.'
    : 'Não foi possível processar a compra.'

  const canSubmit =
    Boolean(cartQuery.data?.items.length) &&
    Boolean(quoteQuery.data) &&
    !quoteQuery.isFetching &&
    !orderMutation.isPending

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canSubmit || !quoteQuery.data) return

    orderMutation.mutate({
      idempotencyKey: orderKey.current,
      coupon: quoteQuery.data.coupon,
      expectedTotalEth: quoteQuery.data.totalEth,
      walletAddress: walletAddress.trim(),
      network,
    })
  }

  return (
    <>
      <Header />

      <main className="mx-auto max-w-300 px-4 py-12 sm:px-6 xl:px-0">
        <h1 className="mb-8 text-3xl font-bold">
          Finalizar compra
        </h1>

        <Link
          to="/cart"
          className="text-sm text-accent hover:underline"
        >
          ← Voltar ao carrinho
        </Link>

        {cartQuery.isPending ? (
          <p role="status" className="mt-8">
            Carregando carrinho...
          </p>
        ) : cartQuery.isError ? (
          <p role="alert" className="mt-8 text-red-400">
            Não foi possível carregar o carrinho.
          </p>
        ) : cartQuery.data.items.length === 0 ? (
          <p className="mt-8">Seu carrinho está vazio.</p>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <form
              onSubmit={submitOrder}
              className="space-y-6 rounded-lg bg-surface p-6"
            >
              <h2 className="text-xl font-bold">
                Dados do pagamento
              </h2>

              <div>
                <label
                  htmlFor="wallet-address"
                  className="mb-2 block text-sm"
                >
                  Endereço da carteira
                </label>

                <input
                  id="wallet-address"
                  value={walletAddress}
                  onChange={(event) =>
                    setWalletAddress(event.target.value)
                  }
                  required
                  minLength={10}
                  placeholder="Endereço da carteira"
                  className="w-full rounded border border-[#674531] bg-page px-3 py-3"
                />
              </div>

              <div>
                <label
                  htmlFor="network"
                  className="mb-2 block text-sm"
                >
                  Rede
                </label>

                <select
                  id="network"
                  value={network}
                  onChange={(event) =>
                    setNetwork(event.target.value)
                  }
                  className="w-full rounded border border-[#674531] bg-page px-3 py-3"
                >
                  <option value="ethereum">Ethereum</option>
                  <option value="polygon">Polygon</option>
                </select>
              </div>

              <p className="text-xs text-text-secondary">
                Pagamento simulado para o desafio técnico.
                Nenhuma transação real será realizada.
              </p>

              {orderMutation.isError && (
                <p role="alert" className="text-sm text-red-400">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full rounded bg-accent px-5 py-3 font-bold text-page disabled:opacity-50"
              >
                {orderMutation.isPending
                  ? 'Processando...'
                  : 'Confirmar compra'}
              </button>
            </form>

            <aside className="self-start rounded-lg bg-surface p-6">
              <h2 className="mb-6 text-xl font-bold">
                Revisão do pedido
              </h2>

              <p className="mb-5 text-sm text-text-secondary">
                {cartQuery.data.items.length} item(ns) no carrinho
              </p>

              {quoteQuery.isPending ? (
                <p role="status">Calculando cotação...</p>
              ) : quoteQuery.isError ? (
                <p role="alert" className="text-red-400">
                  Não foi possível calcular a cotação.
                  Confira o carrinho e o cupom.
                </p>
              ) : quoteQuery.data ? (
                <dl className="space-y-4">
                  <div className="flex justify-between gap-3">
                    <dt>Subtotal</dt>
                    <dd>{quoteQuery.data.subtotalEth} ETH</dd>
                  </div>

                  <div className="flex justify-between gap-3">
                    <dt>Desconto</dt>
                    <dd>{quoteQuery.data.discountEth} ETH</dd>
                  </div>

                  <div className="flex justify-between gap-3">
                    <dt>Taxa de rede</dt>
                    <dd>{quoteQuery.data.networkFeeEth} ETH</dd>
                  </div>

                  <div className="flex justify-between gap-3 border-t border-[#674531] pt-4 font-bold">
                    <dt>Total</dt>
                    <dd className="text-accent">
                      {quoteQuery.data.totalEth} ETH
                    </dd>
                  </div>
                </dl>
              ) : null}
            </aside>
          </div>
        )}
      </main>
    </>
  )
}
