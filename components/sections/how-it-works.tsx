import { UserPlus, ListChecks, CalendarCheck, ShieldCheck } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'

const STEPS = [
  {
    icon: UserPlus,
    title: 'Napravite nalog',
    description: 'Registrujte se za par minuta i pristupite svim uslugama sa jednim nalogom.',
  },
  {
    icon: ListChecks,
    title: 'Izaberite uslugu',
    description: 'Pretražite kategorije i pronađite tačno ono što vam treba u vašem gradu.',
  },
  {
    icon: CalendarCheck,
    title: 'Povežite se ili rezervišite',
    description: 'Kontaktirajte pružaoca, dogovorite termin ili rezervišite odmah.',
  },
  {
    icon: ShieldCheck,
    title: 'Platite bezbedno',
    description: 'Završite plaćanje unutar aplikacije uz punu zaštitu vaših sredstava.',
  },
]

export function HowItWorks() {
  return (
    <section id="kako-funkcionise" className="bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Kako funkcioniše"
          title="Do rešenja u četiri koraka"
          description="Jednostavan proces koji vas povezuje sa pravim ljudima i uslugama."
        />

        <div className="relative mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block"
          />
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="relative flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft"
            >
              <div className="flex w-full items-center justify-between">
                <span className="grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-float">
                  <step.icon className="size-6" />
                </span>
                <span className="font-display text-4xl font-bold text-secondary">
                  0{i + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-navy">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
