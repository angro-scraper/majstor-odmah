import type { Metadata } from 'next'
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react'
import { PageShell } from '@/components/page-shell'
import { ContactForm } from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Kontakt — balkan.works',
  description:
    'Kontaktirajte tim balkan.works. Tu smo za sva pitanja korisnika i kompanija, svakog dana.',
}

const INFO = [
  { icon: Mail, label: 'Email', value: 'podrska@balkan.works' },
  { icon: Phone, label: 'Telefon', value: '+381 11 123 4567' },
  { icon: MapPin, label: 'Adresa', value: 'Bulevar Mihajla Pupina 10, Beograd' },
  { icon: MessageSquare, label: 'Podrška', value: 'Uživo chat 24/7 u aplikaciji' },
]

export default function KontaktPage() {
  return (
    <PageShell pageKey="contact">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col gap-4">
            {INFO.map((i) => (
              <div key={i.label} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                  <i.icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">{i.label}</p>
                  <p className="text-sm text-muted-foreground">{i.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
            <h2 className="text-xl font-semibold text-navy">Pošaljite poruku</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Popunite formular i naš tim će vam se javiti u najkraćem roku.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </PageShell>
  )
}
