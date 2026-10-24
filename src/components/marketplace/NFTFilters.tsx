
import { useState, type FormEvent } from 'react'

export interface PriceRange {
  min: number
  max: number
}

interface NFTFiltersProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  onPriceApply: (range: PriceRange | null) => void
}

export function NFTFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  onPriceApply,
}: NFTFiltersProps) {
  const [minPrice, setMinPrice] = useState('0')
  const [maxPrice, setMaxPrice] = useState('12.30')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const min = Number(minPrice)
    const max = Number(maxPrice)

    if (
      minPrice.trim() === '' ||
      maxPrice.trim() === '' ||
      !Number.isFinite(min) ||
      !Number.isFinite(max) ||
      min < 0 ||
      max < min
    ) {
      setError('Informe uma faixa de preços válida.')
      return
    }

    setError('')
    onPriceApply({ min, max })
  }

  function handleClear() {
    setMinPrice('0')
    setMaxPrice('12.30')
    setError('')
    onPriceApply(null)
  }

  return (
    <aside
      aria-label="Filtros do marketplace"
      className="self-start rounded-lg bg-surface p-5"
    >
      <h2 className="mb-6 text-lg font-bold">
        Coleções
      </h2>

      <div className="flex flex-col gap-4">
        {categories.map((category) => {
          const isSelected = selectedCategory === category

          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              aria-pressed={isSelected}
              className={`text-left text-sm transition-colors hover:text-accent ${
                isSelected
                  ? 'font-bold text-accent'
                  : 'text-text-secondary'
              }`}
            >
              {category}
            </button>
          )
        })}
      </div>

      <form onSubmit={handleSubmit} className="mt-10">
        <fieldset>
          <legend className="mb-5 text-base font-bold">
            Faixa de preço
          </legend>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="min-price"
                className="mb-2 block text-xs"
              >
                Mínimo (ETH)
              </label>

              <input
                id="min-price"
                type="number"
                min="0"
                step="0.01"
                required
                value={minPrice}
                onChange={(event) =>
                  setMinPrice(event.target.value)
                }
                aria-invalid={Boolean(error)}
                aria-describedby={
                  error ? 'price-error' : undefined
                }
                className="w-full rounded border border-[#674531] bg-page px-2 py-3 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="max-price"
                className="mb-2 block text-xs"
              >
                Máximo (ETH)
              </label>

              <input
                id="max-price"
                type="number"
                min="0"
                step="0.01"
                required
                value={maxPrice}
                onChange={(event) =>
                  setMaxPrice(event.target.value)
                }
                aria-invalid={Boolean(error)}
                aria-describedby={
                  error ? 'price-error' : undefined
                }
                className="w-full rounded border border-[#674531] bg-page px-2 py-3 text-sm"
              />
            </div>
          </div>

          {error && (
            <p
              id="price-error"
              role="alert"
              className="mt-3 text-sm text-red-400"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-5 w-full rounded bg-accent px-4 py-3 text-sm font-bold text-page hover:brightness-110"
          >
            Aplicar
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="mt-3 w-full text-sm text-text-secondary hover:text-accent"
          >
            Limpar preço
          </button>
        </fieldset>
      </form>
    </aside>
  )
}
