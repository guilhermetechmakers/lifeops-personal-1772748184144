import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArticleCard } from './article-card'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { cn } from '@/lib/utils'
import type { Article } from '@/types/about-help'

export interface KnowledgeBaseSearchWidgetProps {
  articlesData?: Article[] | null
  categories?: string[] | null
  onSearch?: (query: string) => void
  onFilter?: (category: string) => void
  className?: string
}

const MIN_SEARCH_LENGTH = 3

export function KnowledgeBaseSearchWidget({
  articlesData,
  categories = [],
  onSearch,
  onFilter,
  className,
}: KnowledgeBaseSearchWidgetProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const debouncedSearch = useDebouncedValue(searchQuery, 300)

  const articles = Array.isArray(articlesData) ? articlesData : []
  const categoryList = Array.isArray(categories) ? categories : []

  const filteredArticles = useMemo(() => {
    let result = articles

    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((a) => a?.category === selectedCategory)
    }

    if (debouncedSearch && debouncedSearch.length >= MIN_SEARCH_LENGTH) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(
        (a) =>
          a?.title?.toLowerCase().includes(q) ||
          a?.excerpt?.toLowerCase().includes(q) ||
          (a?.tags ?? []).some((t: string) => t.toLowerCase().includes(q))
      )
    }

    return result
  }, [articles, selectedCategory, debouncedSearch])

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    onFilter?.(value)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value ?? ''
    setSearchQuery(v)
    if (v.length >= MIN_SEARCH_LENGTH) {
      onSearch?.(v)
    }
  }

  const uniqueCategories = useMemo(() => {
    const cats = new Set<string>()
    articles.forEach((a) => {
      if (a?.category) cats.add(a.category)
    })
    return [...categoryList, ...Array.from(cats)]
  }, [articles, categoryList])

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search articles (min 3 characters)..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-9"
            aria-label="Search knowledge base"
          />
        </div>
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by category">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {uniqueCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
          <p className="text-muted-foreground">
            {articles.length === 0
              ? 'No articles available yet. Check back soon for documentation.'
              : 'No articles match your search. Try a different term or category.'}
          </p>
          {articles.length > 0 && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <ArticleCard key={article?.id ?? ''} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
