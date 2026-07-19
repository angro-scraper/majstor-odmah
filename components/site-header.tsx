'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Download } from 'lucide-react'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { CountrySwitcher } from '@/components/country-switcher'
import { useI18n } from '@/lib/i18n/context'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { t } = useI18n()

  const navLinks = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.services, href: '/usluge' },
    { label: t.nav.forUsers, href: '/#kako-funkcionise' },
    { label: t.nav.forCompanies, href: '/za-kompanije' },
    { label: t.nav.about, href: '/o-nama' },
    { label: t.nav.contact, href: '/kontakt' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="balkan.works početna">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Glavna navigacija">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-navy"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <CountrySwitcher />
          <LanguageSwitcher />
          <Link
            href="/app"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-navy transition-colors hover:text-primary"
          >
            {t.cta.signIn}
          </Link>
          <Link
            href="/preuzmi"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_8px_20px_-8px_rgba(37,99,235,0.8)] transition-transform hover:-translate-y-0.5"
          >
            <Download className="size-4" />
            {t.cta.download}
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <CountrySwitcher />
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-xl border border-border text-navy"
            aria-label={open ? t.cta.closeMenu : t.cta.openMenu}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          'overflow-hidden border-t border-border bg-background lg:hidden',
          open ? 'max-h-[420px]' : 'max-h-0 border-t-0',
          'transition-all duration-300',
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobilna navigacija">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-secondary"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
            <Link
              href="/app"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-border px-4 py-2.5 text-center text-sm font-semibold text-navy"
            >
              {t.cta.signIn}
            </Link>
            <Link
              href="/preuzmi"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              <Download className="size-4" />
              {t.cta.download}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
