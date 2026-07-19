'use client'

import Link from 'next/link'
import { Sparkles, Send, Star, Clock, CheckCircle2, ArrowRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

const PROVIDERS = [
  { name: 'Marko Petrović', rating: '4.9', price: 'od 1.500 RSD', when: 'Sutra, 09–12h', verified: true },
  { name: 'Elektro Servis Nikolić', rating: '4.8', price: 'od 1.800 RSD', when: 'Sutra, 12–15h', verified: true },
  { name: 'Ivan Marić', rating: '4.7', price: 'od 1.300 RSD', when: 'Sutra, 15–18h', verified: false },
]

export function AiAssistant() {
  const { t } = useI18n()

  return (
    <section id="ai-pomocnik" className="bg-surface">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-32">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-3 py-1.5 text-xs font-semibold text-primary shadow-soft">
            <Sparkles className="size-3.5" />
            balkan.works AI
          </span>
          <h2 className="text-balance text-3xl font-bold leading-[1.1] tracking-tight text-navy sm:text-4xl lg:text-[2.75rem]">
            {t.ai.title}
          </h2>
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            {t.ai.description}
          </p>
          <ul className="flex flex-col gap-3">
            {t.ai.bullets.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-navy">
                <CheckCircle2 className="size-5 text-turquoise" />
                {f}
              </li>
            ))}
          </ul>
          <Link
            href="/registracija"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-float transition-transform hover:-translate-y-0.5"
          >
            {t.cta.getStarted}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-card sm:p-7">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <span className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Sparkles className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-navy">balkan.works AI</p>
              <p className="flex items-center gap-1 text-xs text-turquoise">
                <span className="size-1.5 rounded-full bg-turquoise" /> Online
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 py-5">
            <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground">
              Pronađi mi električara u blizini za sutra.
            </div>

            <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-secondary px-4 py-3 text-sm text-navy">
              <p>Evo tri provera pružaoca u vašoj blizini dostupna sutra:</p>
              <div className="mt-3 flex flex-col gap-2">
                {PROVIDERS.map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                  >
                    <span className="grid size-9 place-items-center rounded-xl bg-secondary text-sm font-bold text-primary">
                      {p.name.charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1 truncate text-xs font-semibold text-navy">
                        {p.name}
                        {p.verified && <CheckCircle2 className="size-3.5 shrink-0 text-primary" />}
                      </p>
                      <p className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <Star className="size-3 fill-current text-amber-400" />
                          {p.rating}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="size-3" />
                          {p.when}
                        </span>
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-bold text-primary">{p.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-2.5">
            <input
              type="text"
              placeholder="Napišite poruku..."
              className="flex-1 bg-transparent text-sm text-navy outline-none placeholder:text-muted-foreground"
              aria-label="Poruka za AI pomoćnika"
            />
            <button
              type="button"
              className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground"
              aria-label="Pošalji poruku"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
