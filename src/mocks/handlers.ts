
import { http, HttpResponse } from 'msw'
import { nftFixtures } from '../features/nfts/fixtures'
import type { NFT } from '../features/nfts/types'

export const handlers = [
  http.get('/api/nfts', ({ request }) => {
    const url = new URL(request.url)
    const params = url.searchParams

    const search = params.get('search')?.toLowerCase() ?? ''
    const category = params.get('category')
    const sort = params.get('sort') ?? 'recent'

    const rawPage = Number(params.get('page') ?? 1)
    const rawLimit = Number(params.get('limit') ?? 2)

    const page =
      Number.isInteger(rawPage) && rawPage > 0
        ? rawPage
        : 1

    const limit =
      Number.isInteger(rawLimit) && rawLimit > 0
        ? Math.min(rawLimit, 50)
        : 2

    const minPrice = Number(params.get('minPrice') ?? 0)
    const maxPrice = Number(
      params.get('maxPrice') ?? Number.MAX_SAFE_INTEGER,
    )

    let results: NFT[] = nftFixtures.filter((nft) => {
      const matchesSearch =
        nft.name.toLowerCase().includes(search) ||
        nft.creator.toLowerCase().includes(search)

      const matchesCategory =
        !category ||
        category === 'Todas' ||
        nft.category === category

      const price = Number(nft.priceEth)

      const matchesPrice =
        price >= minPrice && price <= maxPrice

      return matchesSearch && matchesCategory && matchesPrice
    })

    results = [...results].sort((a, b) => {
      if (sort === 'price-asc') {
        return Number(a.priceEth) - Number(b.priceEth)
      }

      if (sort === 'price-desc') {
        return Number(b.priceEth) - Number(a.priceEth)
      }

      return b.createdAt.localeCompare(a.createdAt)
    })
    const view = params.get('view') ?? 'all'

    if (view === 'new') {
    results.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    results = results.slice(0, 2)
}

if (view === 'trending') {
  results.sort((a, b) => b.popularityScore - a.popularityScore)
  results = results.slice(0, 2)
}
    const total = results.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit

    return HttpResponse.json({
      items: results.slice(start, start + limit),
      total,
      page,
      totalPages,
    })
  }),
]
