
import { nftFixtures } from '../../features/nfts/fixtures'
import { NFTCard } from './NFTCard'

export function NFTCatalog() {
  return (
    <section
      id="mercado"
      aria-labelledby="marketplace-title"
      className="py-12 md:py-16"
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h2
          id="marketplace-title"
          className="text-xl font-bold"
        >
          Explore NFTs
        </h2>

        <p className="text-sm text-text-secondary">
          {nftFixtures.length} NFTs disponíveis
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {nftFixtures.map((nft) => (
          <NFTCard key={nft.id} nft={nft} />
        ))}
      </div>
    </section>
  )
}
