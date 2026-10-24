
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { Header } from '../../components/layout/Header'
import { getOrder } from '../../features/orders/api'

export const Route = createFileRoute('/orders/$orderId')({
  component: OrderConfirmationPage,
})

function OrderConfirmationPage() {
  const { orderId } = Route.useParams()

  const {
    data: order,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(orderId),
    retry: false,
  })

  const notFound =
    axios.isAxiosError(error) &&
    error.response?.status === 404

  return (
    <>
      <Header />

      <main className="mx-auto max-w-300 px-4 py-12 sm:px-6 xl:px-0">
        {isPending ? (
          <p role="status">Carregando pedido...</p>
        ) : isError ? (
          <div role="alert">
            <h1 className="text-2xl font-bold">
              {notFound
                ? 'Pedido não encontrado'
                : 'Erro ao carregar pedido'}
            </h1>

            {!notFound && (
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-4 text-accent underline"
              >
                Tentar novamente
              </button>
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-170 space-y-6 rounded-xl bg-surface p-8">
            <h1 className="text-3xl font-bold">
              {order.status === 'confirmed'
                ? 'Pedido confirmado!'
                : order.status === 'declined'
                  ? 'Pagamento recusado'
                  : 'Pedido pendente'}
            </h1>

            <p className="text-text-secondary">
              {order.status === 'confirmed'
                ? 'Sua compra simulada foi concluída.'
                : 'Consulte o status do pedido antes de tentar novamente.'}
            </p>

            <dl className="space-y-4 border-t border-[#674531] pt-6">
              <div>
                <dt className="text-sm text-text-secondary">
                  Número do pedido
                </dt>
                <dd className="break-all font-bold">
                  {order.id}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-text-secondary">
                  Transação
                </dt>
                <dd className="break-all">
                  {order.transactionId ?? 'Não disponível'}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-text-secondary">
                  Itens
                </dt>
                <dd>{order.items.length}</dd>
              </div>

              <div>
                <dt className="text-sm text-text-secondary">
                  Total
                </dt>
                <dd className="text-xl font-bold text-accent">
                  {order.quote.totalEth} ETH
                </dd>
              </div>
            </dl>

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
              className="inline-block rounded bg-accent px-5 py-3 font-bold text-page"
            >
              Voltar ao marketplace
            </Link>
          </div>
        )}
      </main>
    </>
  )
}
