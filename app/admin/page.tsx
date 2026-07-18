import { Users, Building2, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'
import { AnalyticsCard } from '@/components/business/analytics-card'

export const metadata = {
  title: 'Admin Dashboard — balkan.works',
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">System overview and management tools</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <AnalyticsCard
          icon={Users}
          label="Total Users"
          value="12,482"
          change="+8.2%"
          trend="up"
          subtitle="Active users"
        />
        <AnalyticsCard
          icon={Building2}
          label="Businesses"
          value="3,241"
          change="+12.1%"
          trend="up"
          subtitle="This month"
        />
        <AnalyticsCard
          icon={AlertTriangle}
          label="Reports"
          value="24"
          change="+3"
          trend="up"
          subtitle="Pending review"
        />
        <AnalyticsCard
          icon={CheckCircle}
          label="Verified"
          value="2,940"
          change="+4.2%"
          trend="up"
          subtitle="Verified businesses"
        />
        <AnalyticsCard
          icon={TrendingUp}
          label="Platform Health"
          value="98.2%"
          change="+0.5%"
          trend="up"
          subtitle="System uptime"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: 'Review Pending Reports', count: 24, color: 'from-red-500/20 to-orange-500/20' },
          { title: 'Verify Businesses', count: 18, color: 'from-blue-500/20 to-cyan-500/20' },
          { title: 'Suspended Users', count: 3, color: 'from-yellow-500/20 to-amber-500/20' },
          { title: 'Fake Review Reports', count: 8, color: 'from-purple-500/20 to-pink-500/20' },
          { title: 'Support Tickets', count: 42, color: 'from-green-500/20 to-emerald-500/20' },
          { title: 'System Alerts', count: 2, color: 'from-indigo-500/20 to-blue-500/20' },
        ].map((action) => (
          <div
            key={action.title}
            className={`p-6 rounded-2xl bg-gradient-to-br ${action.color} border border-border hover:border-primary transition cursor-pointer`}
          >
            <p className="text-sm text-muted-foreground mb-2">{action.title}</p>
            <p className="text-3xl font-bold">{action.count}</p>
            <p className="text-xs text-primary mt-3">View details →</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-border bg-card">
          <h2 className="text-lg font-semibold mb-4">Recent Reports</h2>
          <div className="space-y-3">
            {[
              { id: 1, type: 'Fake Review', business: 'Elite Services', severity: 'High' },
              { id: 2, type: 'Inappropriate Content', user: 'John Doe', severity: 'Medium' },
              { id: 3, type: 'Spam', business: 'Fast Fixes', severity: 'Low' },
              { id: 4, type: 'Scam Accusation', business: 'Pro Repairs', severity: 'High' },
            ].map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition">
                <div>
                  <p className="text-sm font-medium">{report.type}</p>
                  <p className="text-xs text-muted-foreground">{report.business || report.user}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
                  report.severity === 'High' ? 'bg-red-500/20 text-red-600' :
                  report.severity === 'Medium' ? 'bg-amber-500/20 text-amber-600' :
                  'bg-green-500/20 text-green-600'
                }`}>
                  {report.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card">
          <h2 className="text-lg font-semibold mb-4">Pending Verifications</h2>
          <div className="space-y-3">
            {[
              { business: 'Elite Electricians', date: '2 hours ago', docs: '3/4' },
              { business: 'Quick Plumbing', date: '5 hours ago', docs: '2/4' },
              { business: 'Pro Painting', date: '1 day ago', docs: '4/4' },
              { business: 'HVAC Experts', date: '2 days ago', docs: '3/4' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition">
                <div>
                  <p className="text-sm font-medium">{item.business}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
                <span className="text-xs font-semibold text-primary">{item.docs}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
