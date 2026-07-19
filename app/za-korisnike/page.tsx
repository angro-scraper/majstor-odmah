import type { Metadata } from 'next'
import { PageShell } from '@/components/page-shell'
import { PlatformOverview } from '@/components/platform-overview'

export const metadata: Metadata = {
  title: 'Za korisnike — balkan.works',
  description: 'Pronađite proverene lokalne firme, usluge i prilike kroz balkan.works platformu.',
}

export default function ZaKorisnikePage() {
  return <PageShell pageKey="users"><PlatformOverview audience="users" /></PageShell>
}
