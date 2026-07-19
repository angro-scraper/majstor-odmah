import Link from 'next/link'
import { Bell, ChevronRight, Globe2, LockKeyhole, MapPin, UserRound } from 'lucide-react'

const settings = [
  { title: 'Lični podaci', description: 'Ime, email i podaci profila', icon: UserRound, href: '/app/profile' },
  { title: 'Lokacija', description: 'Beograd, Srbija', icon: MapPin, href: '/app/discover' },
  { title: 'Obaveštenja', description: 'Poruke, ponude i podsetnici', icon: Bell, href: '/app/messages' },
  { title: 'Jezik i region', description: 'Srpski (latinica) · RSD', icon: Globe2, href: '/app' },
  { title: 'Privatnost i bezbednost', description: 'Upravljanje pristupom nalogu', icon: LockKeyhole, href: '/app/profile' },
]

export const metadata = { title: 'Podešavanja — balkan.works' }

export default function SettingsPage() {
  return (
    <div className="space-y-6 px-4 py-6 pb-24">
      <header><p className="text-xs font-semibold tracking-wide text-primary">NALOG</p><h1 className="mt-1 text-3xl font-bold text-navy">Podešavanja</h1><p className="mt-1 text-muted-foreground">Prilagodi aplikaciju svojim potrebama.</p></header>
      <section className="space-y-2">
        {settings.map((item) => {
          const Icon = item.icon
          return <Link key={item.title} href={item.href} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span><span className="min-w-0 flex-1"><span className="block font-semibold text-navy">{item.title}</span><span className="mt-0.5 block text-sm text-muted-foreground">{item.description}</span></span><ChevronRight className="size-5 text-muted-foreground" /></Link>
        })}
      </section>
    </div>
  )
}
