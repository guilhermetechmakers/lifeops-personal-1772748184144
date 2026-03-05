import { useState, useCallback } from 'react'
import { ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FAQ } from '@/types/about-help'

export interface FAQAccordionProps {
  faqs?: FAQ[] | null
  className?: string
}

export function FAQAccordion({ faqs = [], className }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [faqSearch, setFaqSearch] = useState('')

  const items = Array.isArray(faqs) ? faqs : []

  const filteredItems = items.filter((f) => {
    if (!faqSearch || faqSearch.length < 2) return true
    const q = faqSearch.toLowerCase()
    return (
      f?.question?.toLowerCase().includes(q) ||
      f?.answer?.toLowerCase().includes(q) ||
      f?.category?.toLowerCase().includes(q)
    )
  })

  const toggle = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, id: string) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggle(id)
      }
    },
    [toggle]
  )

  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          placeholder="Search FAQs..."
          value={faqSearch}
          onChange={(e) => setFaqSearch(e.target.value ?? '')}
          className="pl-9"
          aria-label="Search FAQs"
        />
      </div>

      <div className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {items.length === 0
              ? 'No FAQs available.'
              : 'No FAQs match your search.'}
          </div>
        ) : (
          filteredItems.map((faq) => {
            const id = faq?.id ?? ''
            const isOpen = openId === id
            return (
              <div
                key={id}
                className="border-border last:border-b-0"
                role="group"
              >
                <button
                  type="button"
                  onClick={() => toggle(id)}
                  onKeyDown={(e) => handleKeyDown(e, id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${id}`}
                  id={`faq-question-${id}`}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                >
                  <span className="font-medium text-sm sm:text-base">
                    {faq?.question ?? ''}
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200',
                      isOpen && 'rotate-180'
                    )}
                    aria-hidden
                  />
                </button>
                <div
                  id={`faq-answer-${id}`}
                  role="region"
                  aria-labelledby={`faq-question-${id}`}
                  className={cn(
                    'grid transition-all duration-200 ease-out',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-border px-5 py-4 text-muted-foreground text-sm">
                      {faq?.answer ?? ''}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
