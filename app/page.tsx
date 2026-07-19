import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Hero } from '@/components/sections/hero'
import { TrustBar } from '@/components/sections/trust-bar'
import { StatsBand } from '@/components/sections/stats-band'
import { Categories } from '@/components/sections/categories'
import { HowItWorks } from '@/components/sections/how-it-works'
import { FeaturedServices } from '@/components/sections/featured-services'
import { AiAssistant } from '@/components/sections/ai-assistant'
import { ForBusiness } from '@/components/sections/for-business'
import { Security } from '@/components/sections/security'
import { Coverage } from '@/components/sections/coverage'
import { Testimonials } from '@/components/sections/testimonials'
import { DownloadCta } from '@/components/sections/download-cta'
import { PlatformOverview } from '@/components/platform-overview'

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <TrustBar />
        <PlatformOverview />
        <Categories />
        <HowItWorks />
        <StatsBand />
        <FeaturedServices />
        <AiAssistant />
        <ForBusiness />
        <Security />
        <Coverage />
        <Testimonials />
        <DownloadCta />
      </main>
      <SiteFooter />
    </div>
  )
}
