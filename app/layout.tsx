import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'balkan.works — Sve usluge na jednom mestu',
  description:
    'Jedna aplikacija za svakodnevni život i poslovanje širom Balkana. Poslovi, majstori, dostava, putovanja, zdravlje, novčanik i AI pomoćnik na jednom mestu.',
  generator: 'v0.app',
  keywords: [
    'balkan.works',
    'super aplikacija',
    'Balkan',
    'poslovi',
    'usluge',
    'dostava',
    'novčanik',
  ],
  openGraph: {
    title: 'balkan.works — Sve usluge na jednom mestu',
    description:
      'Jedna aplikacija za svakodnevni život i poslovanje širom Balkana.',
    type: 'website',
    locale: 'sr_RS',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#2563eb',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="sr" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="antialiased bg-background">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
