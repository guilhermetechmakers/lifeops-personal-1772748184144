import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  KnowledgeBaseSearchWidget,
  FAQAccordion,
  GuidesPanel,
  StatusWidget,
  SupportContactForm,
  PermissioningTipsPanel,
  PageHeader,
  SectionCard,
} from '@/components/about-help'
import {
  fetchArticles,
  fetchFAQs,
  fetchGuides,
  fetchStatus,
} from '@/api/about-help'
import type { Article, FAQ, Guide, StatusItem } from '@/types/about-help'

export function AboutHelpPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [guides, setGuides] = useState<Guide[]>([])
  const [statusData, setStatusData] = useState<StatusItem[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const [articlesRes, faqsRes, guidesRes, statusRes] = await Promise.all([
          fetchArticles(),
          fetchFAQs(),
          fetchGuides(),
          fetchStatus(),
        ])
        setArticles(Array.isArray(articlesRes?.items) ? articlesRes.items : [])
        setFaqs(Array.isArray(faqsRes?.items) ? faqsRes.items : [])
        setGuides(Array.isArray(guidesRes?.items) ? guidesRes.items : [])
        setStatusData(Array.isArray(statusRes?.items) ? statusRes.items : [])
      } catch {
        setArticles([])
        setFaqs([])
        setGuides([])
        setStatusData([])
      }
    }
    load()
  }, [])

  const categories = [...new Set(articles.map((a) => a?.category).filter(Boolean))]

  return (
    <div className="min-h-screen bg-background">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 h-full w-full bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-60" />
        <div className="absolute -bottom-1/2 -right-1/2 h-full w-full bg-gradient-to-tl from-primary/5 via-transparent to-transparent opacity-60" />
      </div>

      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="font-bold text-xl gradient-text">
            LifeOps
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/about-help" className="text-sm font-medium text-foreground">
              Help
            </Link>
            <Link to="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button className="gradient-primary text-primary-foreground">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <PageHeader
            title="About & Help"
            description="Find documentation, FAQs, getting-started guides, and contact support. Learn how to use LifeOps Personal and configure agent permissions."
            breadcrumbs={[{ label: 'About & Help' }]}
          />

          {/* Knowledge Base */}
          <section className="animate-fade-in-up">
            <SectionCard
              title="Knowledge Base"
              description="Search and browse documentation articles by category."
            >
              <KnowledgeBaseSearchWidget
                articlesData={articles}
                categories={categories}
              />
            </SectionCard>
          </section>

          {/* FAQ */}
          <section id="faq" className="animate-fade-in-up [animation-delay:50ms] scroll-mt-24">
            <SectionCard
              title="Frequently Asked Questions"
              description="Common questions about onboarding, bank linking, publishing, and more."
            >
              <FAQAccordion faqs={faqs} />
            </SectionCard>
          </section>

          {/* Guides */}
          <section className="animate-fade-in-up [animation-delay:100ms]">
            <SectionCard
              title="Getting Started Guides"
              description="Step-by-step guides for Projects, Content, Finance, and Health."
            >
              <GuidesPanel guides={guides} />
            </SectionCard>
          </section>

          {/* Status & Permissioning - two columns on desktop */}
          <div className="grid gap-8 lg:grid-cols-2">
            <section className="animate-fade-in-up [animation-delay:150ms]">
              <StatusWidget statusData={statusData} />
            </section>
            <section className="animate-fade-in-up [animation-delay:150ms]">
              <PermissioningTipsPanel />
            </section>
          </div>

          {/* Support Contact */}
          <section id="support" className="animate-fade-in-up [animation-delay:200ms] scroll-mt-24">
            <SectionCard
              title="Contact Support"
              description="Need help? Send us a message with optional attachments. We typically respond within 24 hours."
            >
              <SupportContactForm />
            </SectionCard>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border px-4 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LifeOps Personal
          </span>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/about-help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Help
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
