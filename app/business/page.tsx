import { Eye, Phone, MessageSquare, TrendingUp, Star, Zap } from 'lucide-react'
import { AnalyticsCard } from '@/components/business/analytics-card'
import { LeadsChart } from '@/components/business/leads-chart'
import { RecentActivity } from '@/components/business/recent-activity'

export const metadata = {
  title: 'Dashboard — balkan.works Business',
}

export default function BusinessDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your business performance.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          icon={Eye}
          label="Profile Views"
          value="2,481"
          change="+12.5%"
          trend="up"
          subtitle="This month"
        />
        <AnalyticsCard
          icon={Phone}
          label="Phone Calls"
          value="324"
          change="+8.2%"
          trend="up"
          subtitle="This month"
        />
        <AnalyticsCard
          icon={MessageSquare}
          label="Messages"
          value="89"
          change="+2.1%"
          trend="up"
          subtitle="This week"
        />
        <AnalyticsCard
          icon={Star}
          label="Avg Rating"
          value="4.8"
          change="+0.1"
          trend="up"
          subtitle="From 42 reviews"
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
            Optimize Your Profile
          </h3>
          <p className="text-sm text-muted-foreground mb-4">Complete your business profile to attract more customers</p>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition">
            Optimize Now
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            Growth Tips
          </h3>
          <p className="text-sm text-muted-foreground mb-4">Get AI-powered suggestions to grow your business</p>
          <button className="px-4 py-2 rounded-lg border border-amber-500/50 text-amber-600 text-sm font-semibold hover:bg-amber-500/10 transition">
            View Tips
          </button>
        </div>
      </div>
    </div>
  )
}
