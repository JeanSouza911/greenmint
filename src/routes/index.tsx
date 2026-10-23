
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main>
      <h1>GreenMint</h1>
      <p>Marketplace de NFTs</p>
    </main>
  )
}
