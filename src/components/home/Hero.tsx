
import heroImage from '../../assets/hero-nft.png'

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="grid items-center gap-12 py-12 md:grid-cols-2 md:gap-16 md:py-16"
    >
      <div>
        <p className="mb-5 text-sm tracking-widest">
          Bem-vindo à Kurio
        </p>

        <h1
          id="hero-title"
          className="max-w-150 text-3xl leading-tight font-bold md:text-4xl lg:text-5xl"
        >
          SEJA DONO DO FUTURO DA ARTE DIGITAL
        </h1>

        <p className="mt-6 max-w-140 text-sm leading-7 text-text-secondary">
          Descubra NFTs selecionados de criadores emergentes
          e consagrados. Colecione arte digital rara, apoie
          artistas e tenha uma parte da cultura da internet.
        </p>

        <a
          href="#mercado"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded bg-accent px-6 py-3 text-sm font-bold text-page transition-colors hover:bg-[#e8a765]"
        >
          EXPLORAR
        </a>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="aspect-square w-full max-w-100 overflow-hidden rounded-2xl bg-surface">
          <img
            src={heroImage}
            alt="NFT em destaque no marketplace Kurio"
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
        </div>

        <div
          className="flex items-center gap-2"
          aria-label="Imagem 1 de 3"
        >
          <span className="h-2 w-2 rounded-full bg-accent" />
          <span className="h-2 w-2 rounded-full bg-text-secondary" />
          <span className="h-2 w-2 rounded-full bg-text-secondary" />
        </div>
      </div>
    </section>
  )
}
