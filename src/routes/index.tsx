
import { createFileRoute } from '@tanstack/react-router'
import { Header } from '../components/layout/Header'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <>
      <Header />

      <main className="mx-auto max-w-300 px-4 sm:px-6 xl:px-0">
        <section
          aria-labelledby="home-title"
          className="py-16"
        >
          <p className="mb-5 text-sm tracking-widest">
            Bem-vindo à Kurio
          </p>

          <h1
            id="home-title"
            className="max-w-150 text-3xl leading-tight font-bold md:text-5xl"
          >
            SEJA DONO DO FUTURO DA ARTE DIGITAL
          </h1>

          <p className="mt-6 max-w-140 text-sm leading-7 text-text-secondary">
            Descubra NFTs selecionados de criadores
            emergentes e consagrados. Colecione arte
            digital rara, apoie artistas e tenha uma
            parte da cultura da internet.
          </p>
        </section>

        <section
          id="mercado"
          aria-label="Marketplace de NFTs"
        />
      </main>
    </>
  )
}
