'use client'

import { CATEGORIES } from '@/lib/site'
import { SectionHeading } from '@/components/section-heading'
import { cn } from '@/lib/utils'
import { useI18n } from '@/lib/i18n/context'

const ACCENT: Record<string, string> = {
  blue: 'bg-secondary text-primary',
  cyan: 'bg-accent text-cyan-accent',
  teal: 'bg-[#e6faf5] text-turquoise',
}

export function Categories() {
  const { t } = useI18n()

  return (
    <section id="usluge" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <SectionHeading
        eyebrow={t.categories.eyebrow}
        title={t.categories.title}
        description={t.categories.description}
      />

      <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {CATEGORIES.map((cat) => {
          const item = t.categoryItems[cat.key as keyof typeof t.categoryItems]
          return (
            <button
              key={cat.key}
              type="button"
              className="group flex flex-col items-start gap-3.5 rounded-3xl border border-border bg-card p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card"
            >
              <span
                className={cn(
                  'grid size-12 place-items-center rounded-2xl transition-transform group-hover:scale-105',
                  ACCENT[cat.accent],
                )}
              >
                <cat.icon className="size-5" />
              </span>
              <span className="text-base font-semibold text-navy">{item.title}</span>
              <span className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
