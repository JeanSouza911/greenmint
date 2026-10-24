
import { useState } from 'react'
import { nftFixtures } from '../../features/nfts/fixtures'
import { NFTCard } from './NFTCard'
import {
  NFTFilters,
  type PriceRange,
} from './NFTFilters'

type CatalogView = 'all' | 'new' | 'trending'
type SortOrder = 'recent' | 'price-asc' | 'price-desc'

const ALL_CATEGORIES = 'Todas'

const views: { id: CatalogView; label: string }[] = [
  { id: 'all', label: 'Todos os NFTs' },
  { id: 'new', label: 'Novos lançamentos' },
  { id: 'trending', label: 'Em alta' },
]

export function NFTCatalog() {
  const [selectedCategory, setSelectedCategory] =
    useState(ALL_CATEGORIES)

  const [priceRange, setPriceRange] =
    useState<PriceRange | null>(null)

  const [activeView, setActiveView] =
    useState<CatalogView>('all')

  const [sortOrder, setSortOrder] =
    useState<SortOrder>('recent')

  const categories = [
    ALL_CATEGORIES,
    ...new Set(nftFixtures.map((nft) => nft.category)),
  ]

  const filteredNFTs = nftFixtures.filter((nft) => {
    const matchesCategory =
      selectedCategory === ALL_CATEGORIES ||
      nft.category === selectedCategory

    const price = Number(nft.priceEth)

    const matchesPrice =
      priceRange === null ||
      (price >= priceRange.min &&
        price <= priceRange.max)

    return matchesCategory && matchesPrice
  })

  const displayedNFTs = [...filteredNFTs]

  if (activeView === 'new') {
    displayedNFTs.sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    )
    displayedNFTs.splice(2)
  }

  if (activeView === 'trending') {
    displayedNFTs.sort(
      (a, b) => b.popularityScore - a.popularityScore
    )
    displayedNFTs.splice(2)
  }

  displayedNFTs.sort((a, b) => {
    if (sortOrder === 'price-asc') {
      return Number(a.priceEth) - Number(b.priceEth)
    }

    if (sortOrder === 'price-desc') {
      return Number(b.priceEth) - Number(a.priceEth)
    }

    return b.createdAt.localeCompare(a.createdAt)
  })

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
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onPriceApply={setPriceRange}
        />

        <div className="min-w-0">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-5">
            <div
              role="group"
              aria-label="Visualização do catálogo"
              className="flex flex-wrap gap-5"
            >
              {views.map((view) => (
                <button
                  key={view.id}
                  type="button"
                  aria-pressed={activeView === view.id}
                  onClick={() => setActiveView(view.id)}
                  className={`border-b-2 pb-2 text-sm transition-colors ${
                    activeView === view.id
                      ? 'border-accent font-bold text-accent'
                      : 'border-transparent text-text-secondary hover:text-accent'
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
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value as SortOrder)
                }
                className="max-w-45 rounded border border-[#674531] bg-surface px-2 py-2 text-sm"
              >
                <option value="recent">
                  Mais recentes
                </option>
                <option value="price-asc">
                  Menor preço
                </option>
                <option value="price-desc">
                  Maior preço
                </option>
              </select>
            </div>
          </div>

          <p
            role="status"
            className="mb-5 text-sm text-text-secondary"
          >
            {displayedNFTs.length} NFTs encontrados
          </p>

          {displayedNFTs.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {displayedNFTs.map((nft) => (
                <NFTCard key={nft.id} nft={nft} />
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-text-secondary">
              Nenhum NFT encontrado com os filtros selecionados.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
