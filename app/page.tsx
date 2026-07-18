import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Hero } from '@/components/sections/hero'
import { Categories } from '@/components/sections/categories'
import { HowItWorks } from '@/components/sections/how-it-works'
import { FeaturedServices } from '@/components/sections/featured-services'
import { AiAssistant } from '@/components/sections/ai-assistant'
import { ForBusiness } from '@/components/sections/for-business'
import { Security } from '@/components/sections/security'
import { Coverage } from '@/components/sections/coverage'
import { Testimonials } from '@/components/sections/testimonials'
import { DownloadCta } from '@/components/sections/download-cta'

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Categories />
        <HowItWorks />
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
