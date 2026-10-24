
import { createFileRoute } from '@tanstack/react-router'
import { Header } from '../components/layout/Header'
import { Hero } from '../components/home/Hero'
import { NFTCatalog } from '../components/marketplace/NFTCatalog'

type SortOrder = 'recent' | 'price-asc' | 'price-desc'
type CatalogView = 'all' | 'new' | 'trending'

function validPrice(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined
  }

  const number = Number(value)

  return Number.isFinite(number) && number >= 0
    ? number
    : undefined
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>) => {
    const rawPage = Number(search.page)
    const page =
      Number.isInteger(rawPage) && rawPage > 0
        ? rawPage
        : 1

    const sortOptions: SortOrder[] = [
      'recent',
      'price-asc',
      'price-desc',
    ]

    const viewOptions: CatalogView[] = [
      'all',
      'new',
      'trending',
    ]

    return {
      search:
        typeof search.search === 'string'
          ? search.search
          : '',
      category:
        typeof search.category === 'string'
          ? search.category
          : 'Todas',
      minPrice: validPrice(search.minPrice),
      maxPrice: validPrice(search.maxPrice),
      sort: sortOptions.includes(search.sort as SortOrder)
        ? (search.sort as SortOrder)
        : 'recent',
      view: viewOptions.includes(search.view as CatalogView)
        ? (search.view as CatalogView)
        : 'all',
      page,
    }
  },
  component: HomePage,
})

function HomePage() {
  const search = Route.useSearch()

  return (
    <>
      <Header />

      <main className="mx-auto max-w-300 px-4 sm:px-6 xl:px-0">
        <Hero />
        <NFTCatalog searchParams={search} />
      </main>
    </>
  )
}
