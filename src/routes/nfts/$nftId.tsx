import { createFileRoute, Link } from '@tanstack/react-router'
import { NFTPurchaseOptions } from '../../components/marketplace/NFTPurchaseOptions'
import { NFTGallery } from '../../components/marketplace/NFTGallery'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { Header } from '../../components/layout/Header'
import { getNFTById } from '../../features/nfts/api'

export const Route = createFileRoute('/nfts/$nftId')({
  component: NFTDetailsPage,
})

function NFTDetailsPage() {
  const { nftId } = Route.useParams()

  const {
    data: nft,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['nft', nftId],
    queryFn: ({ signal }) => getNFTById(nftId, signal),
    retry: false,
  })

  const notFound =
    axios.isAxiosError(error) &&
    error.response?.status === 404

  return (
    <>
      <Header />

      <main className="mx-auto max-w-300 px-4 py-10 sm:px-6 xl:px-0">
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
          className="text-sm text-accent hover:underline"
        >
          ← Voltar ao marketplace
        </Link>

        {isPending ? (
          <p role="status" className="mt-10">
            Carregando NFT...
          </p>
        ) : isError ? (
          <div role="alert" className="mt-10 space-y-4">
            <h1 className="text-2xl font-bold">
              {notFound
                ? 'NFT não encontrado'
                : 'Erro ao carregar o NFT'}
            </h1>

            {!notFound && (
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded bg-accent px-4 py-2 text-page"
              >
                Tentar novamente
              </button>
            )}
          </div>
        ) : (
          <div className="mt-10 grid items-start gap-10 md:grid-cols-2">
            <NFTGallery nft={nft} />

            <section
              aria-labelledby="nft-title"
              className="space-y-6"
            >
              <div>
                <p className="mb-2 text-sm text-accent">
                  {nft.category}
                </p>

                <h1
                  id="nft-title"
                  className="text-3xl font-bold"
                >
                  {nft.name}
                </h1>

                <p className="mt-3 text-text-secondary">
                  Criado por {nft.creator}
                </p>
              </div>

              <div className="border-y border-[#674531] py-6">
                <p className="mb-2 text-sm text-text-secondary">
                  Preço
                </p>
                <p className="text-2xl font-bold text-accent">
                  {nft.priceEth} ETH
                </p>
              </div>
                <NFTPurchaseOptions nft={nft} />

              <p className="text-sm text-text-secondary">
                {nft.available
                  ? 'NFT disponível'
                  : 'NFT indisponível'}
              </p>
            </section>
          </div>
        )}
      </main>
    </>
  )
}
