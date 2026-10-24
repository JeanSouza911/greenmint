
import type { FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  useQuery,
  keepPreviousData,
} from '@tanstack/react-query'

import { getNFTs, type NFTQueryParams } from '../../features/nfts/api'
import { NFTCard } from './NFTCard'
import { NFTFilters, type PriceRange } from './NFTFilters'

type CatalogSearch = {
  search: string
  category: string
  minPrice?: number
  maxPrice?: number
  sort: 'recent' | 'price-asc' | 'price-desc'
  view: 'all' | 'new' | 'trending'
  page: number
}

interface NFTCatalogProps {
  searchParams: CatalogSearch
}

const PAGE_SIZE = 2

const categories = [
  'Todas',
  'Arte digital',
  'Colecionáveis',
]

const views = [
  { id: 'all', label: 'Todos os NFTs' },
  { id: 'new', label: 'Novos lançamentos' },
  { id: 'trending', label: 'Em alta' },
] as const

export function NFTCatalog({ searchParams }: NFTCatalogProps) {
  const navigate = useNavigate({ from: '/' })

  const params: NFTQueryParams = {
    search: searchParams.search,
    category: searchParams.category,
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
    sort: searchParams.sort,
    view: searchParams.view,
    page: searchParams.page,
    limit: PAGE_SIZE,
  }

  const {
    data,
    isPending,
    isError,
    isPlaceholderData,
    refetch,
}   = useQuery({
    queryKey: ['nfts', params],
    queryFn: ({ signal }) => getNFTs(params, signal),
    placeholderData: keepPreviousData,
})

  function handleSearch(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()

  const formData = new FormData(event.currentTarget)
  const search = String(formData.get('search') ?? '').trim()

  void navigate({
    resetScroll: false,
    hashScrollIntoView: false,
    search: (previous) => ({
      ...previous,
      search,
      page: 1,
    }),
  })
}

  function handleCategoryChange(category: string) {
    void navigate({
      resetScroll: false,
      hashScrollIntoView: false,
      search: (previous) => ({
        ...previous,
        category,
        page: 1,
      }),
    })
  }

  function handlePriceApply(range: PriceRange | null) {
    void navigate({
      resetScroll: false,
      hashScrollIntoView: false,
      search: (previous) => ({
        ...previous,
        minPrice: range?.min,
        maxPrice: range?.max,
        page: 1,
      }),
    })
  }

  function changePage(page: number) {
    void navigate({
      resetScroll: false,
      hashScrollIntoView: false,
      search: (previous) => ({
        ...previous,
        page,
      }),
    })
  }

  return (
    <section
      id="mercado"
      aria-labelledby="marketplace-title"
      className="scroll-mt-8 py-12 md:py-16"
    >
      <h2
        id="marketplace-title"
        className="mb-8 text-2xl font-bold"
      >
        Explore NFTs
      </h2>

      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <NFTFilters
          key={`${searchParams.minPrice ?? 'none'}-${searchParams.maxPrice ?? 'none'}`}
          categories={categories}
          selectedCategory={searchParams.category}
          onCategoryChange={handleCategoryChange}
          onPriceApply={handlePriceApply}
          appliedPriceRange={
            searchParams.minPrice !== undefined &&
            searchParams.maxPrice !== undefined
              ? {
                  min: searchParams.minPrice,
                  max: searchParams.maxPrice,
                }
              : null
          }
        />

        <div className="min-w-0">
          <form
            onSubmit={handleSearch}
            role="search"
            className="mb-6 flex gap-2"
          >
            <label htmlFor="nft-search" className="sr-only">
              Buscar NFTs
            </label>

            <input
              key={searchParams.search}
              id="nft-search"
              name="search"
              type="search"
              defaultValue={searchParams.search}
              placeholder="Buscar NFTs"
              className="min-w-0 flex-1 rounded border border-[#674531] bg-surface px-3 py-2 text-sm"
/>

            <button
              type="submit"
              className="rounded bg-accent px-4 py-2 font-bold text-page"
            >
              Buscar
            </button>
          </form>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div
              role="group"
              aria-label="Visualização do catálogo"
              className="flex flex-wrap gap-4"
            >
              {views.map((view) => (
                <button
                  key={view.id}
                  type="button"
                  aria-pressed={searchParams.view === view.id}
                  onClick={() =>
                    void navigate({
                      resetScroll: false,
                      search: (previous) => ({
                        ...previous,
                        view: view.id,
                        page: 1,
                      }),
                    })
                  }
                  className={`border-b-2 pb-2 text-sm ${
                    searchParams.view === view.id
                      ? 'border-accent font-bold text-accent'
                      : 'border-transparent text-text-secondary'
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="nft-sort"
                className="text-sm text-text-secondary"
              >
                Ordenar por:
              </label>

              <select
                id="nft-sort"
                value={searchParams.sort}
                onChange={(event) =>
                  void navigate({
                    resetScroll: false,
                    hashScrollIntoView: false,
                    search: (previous) => ({
                      ...previous,
                      sort: event.target.value as CatalogSearch['sort'],
                      page: 1,
                    }),
                  })
                }
                className="rounded border border-[#674531] bg-surface px-2 py-2 text-sm"
              >
                <option value="recent">Mais recentes</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
              </select>
            </div>
          </div>

          {isPending ? (
            <p role="status" className="py-12 text-text-secondary">
              Carregando NFTs...
            </p>
          ) : isError ? (
            <div role="alert" className="py-12">
              <p>Não foi possível carregar os NFTs.</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-4 rounded bg-accent px-4 py-2 text-page"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <>
              <p
                role="status"
                className="mb-5 text-sm text-text-secondary"
              >
                {data.total} NFTs encontrados
              </p>

              {data.items.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {data.items.map((nft) => (
                    <NFTCard key={nft.id} nft={nft} />
                  ))}
                </div>
              ) : (
                <p className="py-12 text-text-secondary">
                  Nenhum NFT encontrado.
                </p>
              )}

              {data.totalPages > 1 && (
                <nav
                  aria-label="Paginação dos NFTs"
                  className="mt-8 flex items-center justify-center gap-4"
                >
                  <button
                    type="button"
                    disabled={isPlaceholderData || searchParams.page <= 1}
                    onClick={() =>
                      changePage(searchParams.page - 1)
                    }
                    className="rounded border border-accent px-3 py-2 disabled:opacity-40"
                  >
                    Anterior
                  </button>

                  <span className="text-sm">
                    Página {data.page} de {data.totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={isPlaceholderData || searchParams.page >= data.totalPages}
                    onClick={() =>
                      changePage(searchParams.page + 1)
                    }
                    className="rounded border border-accent px-3 py-2 disabled:opacity-40"
                  >
                    Próxima
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
