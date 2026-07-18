import Link from 'next/link'
import { Globe, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'
import { Logo } from '@/components/logo'

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Platforma',
    links: [
      { label: 'Kako funkcioniše', href: '/#kako-funkcionise' },
      { label: 'AI pomoćnik', href: '/#ai-pomocnik' },
      { label: 'Novčanik', href: '/#usluge' },
      { label: 'Preuzmi aplikaciju', href: '/preuzmi' },
    ],
  },
  {
    title: 'Kategorije',
    links: [
      { label: 'Poslovi', href: '/poslovi' },
      { label: 'Majstori i usluge', href: '/usluge' },
      { label: 'Dostava hrane', href: '/usluge' },
      { label: 'Putovanja', href: '/usluge' },
    ],
  },
  {
    title: 'Kompanija',
    links: [
      { label: 'O nama', href: '/o-nama' },
      { label: 'Za kompanije', href: '/za-kompanije' },
      { label: 'Karijera', href: '/o-nama' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
  },
  {
    title: 'Pravno',
    links: [
      { label: 'Uslovi korišćenja', href: '/kontakt' },
      { label: 'Politika privatnosti', href: '/kontakt' },
      { label: 'Bezbednost', href: '/#bezbednost' },
      { label: 'Kolačići', href: '/kontakt' },
    ],
  },
]

const SOCIALS = [
  { label: 'Facebook', icon: Facebook, href: '#' },
  { label: 'Instagram', icon: Instagram, href: '#' },
  { label: 'LinkedIn', icon: Linkedin, href: '#' },
  { label: 'YouTube', icon: Youtube, href: '#' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Super aplikacija za svakodnevni život i poslovanje širom Balkana.
              Sve usluge koje su vam potrebne — na jednom mestu.
            </p>
            <div className="mt-5 flex gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid size-9 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-navy">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} balkan.works. Sva prava zadržana.
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-navy transition-colors hover:border-primary"
          >
            <Globe className="size-4 text-primary" />
            Srpski (latinica)
          </button>
        </div>
      </div>
    </footer>
  )
}
