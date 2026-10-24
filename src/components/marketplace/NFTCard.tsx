
import type { NFT } from '../../features/nfts/types'

interface NFTCardProps {
  nft: NFT
}

export function NFTCard({ nft }: NFTCardProps) {
  return (
    <article className="min-w-0 bg-surface p-2">
      <div className="aspect-square overflow-hidden rounded-lg">
        <img
          src={nft.imageUrl}
          alt={nft.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="space-y-2 py-3">
        <h3 className="truncate text-sm font-medium">
          {nft.name}
        </h3>

        <p className="text-xs text-text-secondary">
          {nft.creator}
        </p>

        <p className="font-bold text-accent">
          {nft.priceEth} ETH
        </p>
      </div>
    </article>
  )
}
