import type { Metadata } from 'next'
import { PageShell } from '@/components/page-shell'
import { Categories } from '@/components/sections/categories'
import { FeaturedServices } from '@/components/sections/featured-services'
import { DownloadCta } from '@/components/sections/download-cta'

export const metadata: Metadata = {
  title: 'Usluge — balkan.works',
  description:
    'Istražite sve kategorije usluga na balkan.works: poslovi, majstori, dostava, putovanja, zdravlje i još mnogo toga.',
}

export default function UslugePage() {
  return (
    <PageShell pageKey="services">
      <Categories />
      <FeaturedServices />
      <DownloadCta />
    </PageShell>
  )
}
