import type { Metadata } from 'next'
import { PageShell } from '@/components/page-shell'
import { PlatformOverview } from '@/components/platform-overview'

export const metadata: Metadata = {
  title: 'Platforma — balkan.works',
  description: 'Balkan.works je web platforma koja povezuje korisnike, firme i partnere širom regiona.',
}

export default function PlatformaPage() {
  return <PageShell pageKey="platform"><PlatformOverview /></PageShell>
}
