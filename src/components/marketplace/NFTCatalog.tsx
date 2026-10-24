
import { useState } from 'react'
import { nftFixtures } from '../../features/nfts/fixtures'
import { NFTCard } from './NFTCard'
import { NFTFilters } from './NFTFilters'

const ALL_CATEGORIES = 'Todas'

export function NFTCatalog() {
  const [selectedCategory, setSelectedCategory] =
    useState(ALL_CATEGORIES)

  const categories = [
    ALL_CATEGORIES,
    ...new Set(nftFixtures.map((nft) => nft.category)),
  ]

  const filteredNFTs = nftFixtures.filter((nft) => {
    return (
      selectedCategory === ALL_CATEGORIES ||
      nft.category === selectedCategory
    )
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
        />

        <div className="min-w-0">
          <div className="mb-6 flex items-center justify-between">
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
              Nenhum NFT encontrado nesta categoria.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
