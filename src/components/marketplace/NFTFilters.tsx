
interface NFTFiltersProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function NFTFilters({
  categories,
  selectedCategory,
  onCategoryChange,
}: NFTFiltersProps) {
  return (
    <aside
      aria-label="Filtros do marketplace"
      className="rounded-lg bg-surface p-5"
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
    </aside>
  )
}
