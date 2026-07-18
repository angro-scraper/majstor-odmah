import type { Metadata } from 'next'
import { Briefcase, MapPin, Clock, ArrowUpRight } from 'lucide-react'
import { PageShell } from '@/components/page-shell'

export const metadata: Metadata = {
  title: 'Poslovi — balkan.works',
  description:
    'Pronađite posao ili honorarni angažman širom Balkana. Aktuelni oglasi iz svih industrija na jednom mestu.',
}

const JOBS = [
  { title: 'Front-end Developer', company: 'Nelt Group', loc: 'Beograd · Remote', type: 'Puno radno vreme', pay: '2.000 – 3.000 €', badge: 'Novo' },
  { title: 'Marketing Specijalista', company: 'Infostud', loc: 'Novi Sad · Hibridno', type: 'Puno radno vreme', pay: '1.200 – 1.800 €' },
  { title: 'Vozač B kategorije', company: 'Wolt', loc: 'Zagreb · Teren', type: 'Puno radno vreme', pay: '900 – 1.100 €' },
  { title: 'Grafički dizajner', company: 'Endava', loc: 'Sarajevo · Remote', type: 'Honorarno', pay: '1.000 – 1.500 €', badge: 'Novo' },
  { title: 'Kuvar', company: 'Restoran Dva Jelena', loc: 'Beograd · Teren', type: 'Puno radno vreme', pay: '800 – 1.200 €' },
  { title: 'Računovođa', company: 'Coca-Cola HBC', loc: 'Ljubljana · Kancelarija', type: 'Puno radno vreme', pay: '1.800 – 2.400 €' },
]

const CATS = ['Sve', 'IT', 'Marketing', 'Ugostiteljstvo', 'Transport', 'Finansije', 'Dizajn']

export default function PosloviPage() {
  return (
    <PageShell pageKey="jobs">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {CATS.map((c, i) => (
            <span
              key={c}
              className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                i === 0
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground'
              }`}
            >
              {c}
            </span>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {JOBS.map((job) => (
            <article
              key={job.title}
              className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-card"
            >
              <div className="flex items-start justify-between">
                <span className="grid size-11 place-items-center rounded-2xl bg-secondary text-primary">
                  <Briefcase className="size-5" />
                </span>
                {job.badge && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-turquoise">
                    {job.badge}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-base font-semibold text-navy">{job.title}</h2>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
              <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" /> {job.loc}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5" /> {job.type}
                </span>
              </div>
              <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm font-bold text-primary">{job.pay}</span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-navy transition-colors group-hover:text-primary">
                  Prijavi se <ArrowUpRight className="size-4" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
