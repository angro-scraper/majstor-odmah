import type { Metadata } from 'next'
import { PageShell } from '@/components/page-shell'
import { PlatformOverview } from '@/components/platform-overview'

export const metadata: Metadata = {
  title: 'Partneri — balkan.works',
  description: 'Povežite svoj sistem, kampanje i publiku sa balkan.works platformom.',
}

export default function PartneriPage() {
  return <PageShell pageKey="partners"><PlatformOverview audience="partners" /></PageShell>
}
