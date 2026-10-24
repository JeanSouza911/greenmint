
import { useState } from 'react'
import { nftFixtures } from '../../features/nfts/fixtures'
import { NFTCard } from './NFTCard'
import {
  NFTFilters,
  type PriceRange,
} from './NFTFilters'

const ALL_CATEGORIES = 'Todas'

export function NFTCatalog() {
  const [selectedCategory, setSelectedCategory] =
    useState(ALL_CATEGORIES)

  const [priceRange, setPriceRange] =
    useState<PriceRange | null>(null)

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
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-lg font-bold">
              Todos os NFTs
            </h3>

            <p
              role="status"
              className="text-sm text-text-secondary"
            >
              {filteredNFTs.length} NFTs encontrados
            </p>
          </div>

          {filteredNFTs.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredNFTs.map((nft) => (
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
