import Link from 'next/link'
import {
  Megaphone,
  CalendarCheck,
  CreditCard,
  MessagesSquare,
  LayoutDashboard,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'

const FEATURES = [
  { icon: Megaphone, title: 'Objavite usluge i oglase', desc: 'Predstavite ponudu i poslove hiljadama korisnika u regionu.' },
  { icon: CalendarCheck, title: 'Primajte rezervacije', desc: 'Upravljajte terminima i narudžbinama iz jednog kalendara.' },
  { icon: CreditCard, title: 'Naplaćujte bezbedno', desc: 'Prihvatajte plaćanja karticama i preko novčanika bez brige.' },
  { icon: MessagesSquare, title: 'Komunicirajte sa klijentima', desc: 'Poruke, ponude i podrška — sve u jednom razgovoru.' },
]

export function ForBusiness() {
  return (
    <section id="za-kompanije" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-card sm:p-7">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="flex items-center gap-2 text-sm font-semibold text-navy">
                <LayoutDashboard className="size-4 text-primary" />
                Kontrolna tabla
              </span>
              <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-turquoise">
                Uživo
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: 'Prihod', value: '4.250 €' },
                { label: 'Rezervacije', value: '128' },
                { label: 'Ocena', value: '4.9' },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-surface p-3">
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  <p className="mt-1 text-lg font-bold text-navy">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-border p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-navy">Prihod ove nedelje</p>
                <span className="flex items-center gap-1 text-xs font-semibold text-turquoise">
                  <TrendingUp className="size-3.5" /> +18%
                </span>
              </div>
              <div className="mt-4 flex h-28 items-end gap-2">
                {[45, 62, 38, 70, 52, 84, 60].map((h, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-md bg-primary/80"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[9px] text-muted-foreground">
                      {['P', 'U', 'S', 'Č', 'P', 'S', 'N'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 flex flex-col items-start gap-6 lg:order-2">
          <span className="inline-flex items-center rounded-full border border-primary/15 bg-secondary px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
            Za kompanije
          </span>
          <h2 className="text-balance text-3xl font-bold leading-[1.1] tracking-tight text-navy sm:text-4xl lg:text-[2.75rem]">
            Vodite ceo biznis sa jednog mesta
          </h2>
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            Bilo da ste samostalni profesionalac ili kompanija, balkan.works vam
            daje sve alate za rast — od oglašavanja do naplate i podrške.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex flex-col gap-2">
                <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                  <f.icon className="size-5" />
                </span>
                <h3 className="text-sm font-semibold text-navy">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>

          <Link
            href="/za-kompanije"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-float transition-transform hover:-translate-y-0.5"
          >
            Registrujte svoju kompaniju
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
