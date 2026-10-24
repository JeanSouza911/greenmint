
import { Link } from '@tanstack/react-router'

export function Header() {
  return (
    <header className="border-b border-[#3b2922]">
      <div className="mx-auto flex min-h-18 max-w-300 items-center justify-between gap-6 px-4 sm:px-6 xl:px-0">
        <Link
          to="/"
          aria-label="Kurio - página inicial"
          className="text-sm font-bold tracking-[0.2em]"
        >
          KURIO
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-9 md:flex"
        >
          <Link
            to="/"
            aria-current="page"
            className="border-b-2 border-accent py-5 font-bold text-accent"
          >
            Início
          </Link>

          <a
            href="#mercado"
            className="transition-colors hover:text-accent"
          >
            Mercado
          </a>

          <span className="text-text-secondary">
            Criadores
          </span>

          <span className="text-text-secondary">
            Aprenda
          </span>
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            disabled
            aria-label="Buscar NFTs - em breve"
            className="hidden opacity-60 sm:block"
          >
            <SearchIcon />
          </button>

          <button
            type="button"
            disabled
            aria-label="Carrinho - em breve"
            className="opacity-60"
          >
            <CartIcon />
          </button>

          <button
            type="button"
            disabled
            className="rounded bg-accent px-4 py-2 font-bold text-page opacity-70"
          >
            Entrar
          </button>
        </div>
      </div>
    </header>
  )
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.5 13h12l2.5-9H6" />
    </svg>
  )
}
