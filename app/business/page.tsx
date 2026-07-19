import { Eye, Phone, MessageSquare, TrendingUp, Star, Zap } from 'lucide-react'
import { AnalyticsCard } from '@/components/business/analytics-card'
import { LeadsChart } from '@/components/business/leads-chart'
import { RecentActivity } from '@/components/business/recent-activity'
import Link from 'next/link'

export const metadata = {
  title: 'Kontrolna tabla — balkan.works Biznis',
}

export default function BusinessDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Kontrolna tabla</h1>
        <p className="text-muted-foreground mt-1">Dobro došli! Ovo je pregled rezultata vaše firme.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          icon={Eye}
          label="Pregledi profila"
          value="2,481"
          change="+12.5%"
          trend="up"
          subtitle="Ovog meseca"
        />
        <AnalyticsCard
          icon={Phone}
          label="Pozivi"
          value="324"
          change="+8.2%"
          trend="up"
          subtitle="Ovog meseca"
        />
        <AnalyticsCard
          icon={MessageSquare}
          label="Poruke"
          value="89"
          change="+2.1%"
          trend="up"
          subtitle="Ove nedelje"
        />
        <AnalyticsCard
          icon={Star}
          label="Prosečna ocena"
          value="4.8"
          change="+0.1"
          trend="up"
          subtitle="Na osnovu 42 ocene"
        />
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LeadsChart />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Unapredite profil
          </h3>
          <p className="text-sm text-muted-foreground mb-4">Dopunite poslovni profil da biste privukli više kupaca.</p>
          <Link href="/business/settings" className="inline-flex px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition">
            Uredi profil
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            Saveti za rast
          </h3>
          <p className="text-sm text-muted-foreground mb-4">Dobijte AI predloge za rast svoje firme.</p>
          <Link href="/business/ai-coach" className="inline-flex px-4 py-2 rounded-lg border border-amber-500/50 text-amber-600 text-sm font-semibold hover:bg-amber-500/10 transition">
            Pogledaj savete
          </Link>
        </div>
      </div>
    </div>
  )
}
