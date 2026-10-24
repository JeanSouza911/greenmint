
import { useState } from 'react'
import type { NFT } from '../../features/nfts/types'

interface NFTGalleryProps {
  nft: NFT
}

export function NFTGallery({ nft }: NFTGalleryProps) {
  const images = nft.images.length > 0
    ? nft.images
    : [nft.imageUrl]

  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-xl bg-surface">
        <img
          src={images[selectedIndex]}
          alt={`${nft.name} - imagem ${selectedIndex + 1}`}
          className="h-full w-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <div
          className="mt-4 flex flex-wrap gap-3"
          role="group"
          aria-label="Galeria de imagens do NFT"
        >
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Visualizar imagem ${index + 1}`}
              aria-pressed={selectedIndex === index}
              className={`h-20 w-20 overflow-hidden rounded-lg border-2 ${
                selectedIndex === index
                  ? 'border-accent'
                  : 'border-transparent'
              }`}
            >
              <img
                src={image}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
