const PARTNERS = [
  'Delhaize',
  'mts',
  'Infostud',
  'Wolt',
  'Erste Bank',
  'Telekom',
  'Nelt Group',
]

export function TrustBar() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Poveravaju nam se vodeće kompanije regiona
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
          {PARTNERS.map((name) => (
            <span
              key={name}
              className="text-lg font-bold tracking-tight text-navy/40 transition-colors hover:text-navy/70 sm:text-xl"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
