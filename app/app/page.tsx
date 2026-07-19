import { WelcomeHeader } from '@/components/app/home/welcome-header'
import { AISearch } from '@/components/app/home/ai-search'
import { CategoriesGrid } from '@/components/app/home/categories-grid'
import { RecommendationsSection } from '@/components/app/home/recommendations'
import { NearbyBusinesses } from '@/components/app/home/nearby-businesses'
import { TrendingSection } from '@/components/app/home/trending'
import { OffersCarousel } from '@/components/app/home/offers'
import { SuperAppModules } from '@/components/app/home/super-app-modules'
import Link from 'next/link'
import { Calendar, FileText, Wallet, MessageSquare } from 'lucide-react'

export const metadata = {
  title: 'Početna — balkan.works',
  description: 'Pronađi lokalne usluge i firme u svom kraju',
}

export default function HomePage() {
  return (
    <div className="space-y-6 pt-6">
      <WelcomeHeader />
      <AISearch />
      <SuperAppModules />
      <CategoriesGrid />
      
      <div className="px-4 space-y-3">
        <h2 className="text-lg font-semibold">Brz pristup</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/app/bookings" className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 hover:border-blue-500/50 transition">
            <Calendar className="w-5 h-5 text-blue-600 mb-2" />
            <p className="text-sm font-semibold">Moji termini</p>
            <p className="text-xs text-muted-foreground mt-1">Pregledaj i upravljaj terminima</p>
          </Link>
          <Link href="/app/requests" className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:border-purple-500/50 transition">
            <FileText className="w-5 h-5 text-purple-600 mb-2" />
            <p className="text-sm font-semibold">Zahtevi</p>
            <p className="text-xs text-muted-foreground mt-1">Objavi zahtev za uslugu</p>
          </Link>
          <Link href="/app/wallet" className="p-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 hover:border-green-500/50 transition">
            <Wallet className="w-5 h-5 text-green-600 mb-2" />
            <p className="text-sm font-semibold">Novčanik</p>
            <p className="text-xs text-muted-foreground mt-1">Upravljaj plaćanjima</p>
          </Link>
          <Link href="/app/messages" className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 hover:border-orange-500/50 transition">
            <MessageSquare className="w-5 h-5 text-orange-600 mb-2" />
            <p className="text-sm font-semibold">Poruke</p>
            <p className="text-xs text-muted-foreground mt-1">3 nove poruke</p>
          </Link>
        </div>
      </div>

      <RecommendationsSection />
      <NearbyBusinesses />
      <TrendingSection />
      <OffersCarousel />
    </div>
  )
}
