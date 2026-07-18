import Link from 'next/link'
import { Globe } from 'lucide-react'
import { Logo } from '@/components/logo'

type IconProps = { className?: string }

function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6c-.3 0-1.3-.1-2.45-.1-2.43 0-4.1 1.48-4.1 4.2v2.2H7.4V13h2.75v8h3.35Z" />
    </svg>
  )
}

function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function LinkedinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.94 8.5H4.06V20h2.88V8.5ZM5.5 3.9a1.67 1.67 0 1 0 0 3.34 1.67 1.67 0 0 0 0-3.34ZM20 20v-6.3c0-3.37-1.8-4.94-4.2-4.94-1.94 0-2.8 1.07-3.28 1.82V8.5H9.64V20h2.88v-6.08c0-.32.02-.64.12-.87.25-.64.84-1.3 1.83-1.3 1.29 0 1.81.98 1.81 2.42V20H20Z" />
    </svg>
  )
}

function YoutubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.27 5 12 5 12 5s-6.27 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.73 19 12 19 12 19s6.27 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3-5.2 3Z" />
    </svg>
  )
}

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
  { label: 'Facebook', icon: FacebookIcon, href: 'https://facebook.com/balkanworks' },
  { label: 'Instagram', icon: InstagramIcon, href: 'https://instagram.com/balkanworks' },
  { label: 'LinkedIn', icon: LinkedinIcon, href: 'https://linkedin.com/company/balkanworks' },
  { label: 'YouTube', icon: YoutubeIcon, href: 'https://youtube.com/@balkanworks' },
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
                  target="_blank"
                  rel="noopener noreferrer"
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
