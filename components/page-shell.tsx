'use client'

import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { useI18n } from '@/lib/i18n/context'

type PageKey = 'services' | 'jobs' | 'business' | 'about' | 'contact' | 'download'

export function PageShell({
  pageKey,
  children,
}: {
  pageKey: PageKey
  children: React.ReactNode
}) {
  const { t } = useI18n()

  const eyebrows: Record<PageKey, string> = {
    services: t.nav.services,
    jobs: t.footer.product.jobs,
    business: t.nav.forCompanies,
    about: t.nav.about,
    contact: t.nav.contact,
    download: t.cta.download,
  }

  const eyebrow = eyebrows[pageKey]
  const title = t.pages[pageKey].title
  const description = t.pages[pageKey].subtitle

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-secondary/60 to-background">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex max-w-2xl flex-col gap-4">
              <span className="inline-flex w-fit items-center rounded-full border border-primary/20 bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                {eyebrow}
              </span>
              <h1 className="text-balance text-4xl font-bold tracking-tight text-navy sm:text-5xl">
                {title}
              </h1>
              <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        </section>
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
