
import { createFileRoute } from '@tanstack/react-router'
import { Header } from '../components/layout/Header'
import { Hero } from '../components/home/Hero'
import { NFTCatalog } from '../components/marketplace/NFTCatalog'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <>
      <Header />

      <main className="mx-auto max-w-300 px-4 sm:px-6 xl:px-0">
        <Hero />
        <NFTCatalog />
      </main>
    </>
  )
}
