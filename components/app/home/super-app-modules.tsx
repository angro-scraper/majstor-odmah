import Link from 'next/link'
import { CalendarDays, HeartPulse, CarFront, Plane, House, GraduationCap, UsersRound, CreditCard } from 'lucide-react'

const modules = [
  { name: 'Događaji', description: 'Šta se dešava u tvom gradu', href: '/app/category/events', icon: CalendarDays, color: 'bg-violet-500/10 text-violet-600', active: true },
  { name: 'Zajednica', description: 'Lokalne preporuke i grupe', href: '/app/discover', icon: UsersRound, color: 'bg-sky-500/10 text-sky-600', active: true },
  { name: 'Balkan Card', description: 'Pogodnosti i tvoj status', href: '/app/profile', icon: CreditCard, color: 'bg-primary/10 text-primary', active: true },
  { name: 'Zdravlje', description: 'Apoteke i podsetnici', href: '/app/category/health', icon: HeartPulse, color: 'bg-emerald-500/10 text-emerald-600', active: false },
  { name: 'Auto', description: 'Servisi i podsetnici', href: '/app/category/auto', icon: CarFront, color: 'bg-orange-500/10 text-orange-600', active: false },
  { name: 'Putovanja', description: 'Iskustva širom Balkana', href: '/app/category/travel', icon: Plane, color: 'bg-cyan-500/10 text-cyan-600', active: false },
  { name: 'Nekretnine', description: 'Stanovi i poslovni prostori', href: '/app/category/real-estate', icon: House, color: 'bg-purple-500/10 text-purple-600', active: false },
  { name: 'Edukacija', description: 'Kursevi i nove veštine', href: '/app/category/education', icon: GraduationCap, color: 'bg-pink-500/10 text-pink-600', active: false },
]

export function SuperAppModules() {
  return (
    <section className="space-y-3 px-4" aria-labelledby="super-app-modules-title">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Balkan.works</p>
          <h2 id="super-app-modules-title" className="text-lg font-semibold text-navy">Jedna aplikacija, više mogućnosti</h2>
        </div>
        <span className="text-xs text-muted-foreground">AI bira šta ti je važno</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {modules.map((module) => {
          const Icon = module.icon
          return (
            <Link key={module.name} href={module.href} className="group rounded-2xl border border-border bg-card p-3 transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-card">
              <div className={`mb-3 grid size-10 place-items-center rounded-xl ${module.color}`}><Icon className="size-5" /></div>
              <div className="flex items-center gap-1.5"><h3 className="text-sm font-semibold text-navy">{module.name}</h3>{!module.active && <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground">uskoro</span>}</div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{module.description}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
