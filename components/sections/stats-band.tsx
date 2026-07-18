const STATS = [
  { value: '1.2M+', label: 'aktivnih korisnika', sub: 'širom Balkana' },
  { value: '45.000+', label: 'pružalaca usluga', sub: 'provereni partneri' },
  { value: '12M+', label: 'obavljenih transakcija', sub: 'u poslednjih 12 meseci' },
  { value: '4.9/5', label: 'prosečna ocena', sub: 'App Store i Google Play' },
]

export function StatsBand() {
  return (
    <section className="relative overflow-hidden bg-navy">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-24 size-80 rounded-full bg-primary/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-10 size-80 rounded-full bg-cyan-accent/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col gap-1.5">
              <span className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {s.value}
              </span>
              <span className="text-sm font-semibold text-white/90">{s.label}</span>
              <span className="text-xs text-white/55">{s.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
