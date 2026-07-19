import { Users, Building2, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'
import { AnalyticsCard } from '@/components/business/analytics-card'
import Link from 'next/link'

export const metadata = {
  title: 'Administratorska kontrolna tabla — balkan.works',
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Administratorska kontrolna tabla</h1>
        <p className="text-muted-foreground mt-1">Pregled sistema i alati za upravljanje</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <AnalyticsCard
          icon={Users}
          label="Ukupno korisnika"
          value="12,482"
          change="+8.2%"
          trend="up"
          subtitle="Aktivni korisnici"
        />
        <AnalyticsCard
          icon={Building2}
          label="Firme"
          value="3,241"
          change="+12.1%"
          trend="up"
          subtitle="Ovog meseca"
        />
        <AnalyticsCard
          icon={AlertTriangle}
          label="Prijave"
          value="24"
          change="+3"
          trend="up"
          subtitle="Čeka pregled"
        />
        <AnalyticsCard
          icon={CheckCircle}
          label="Verifikovane"
          value="2,940"
          change="+4.2%"
          trend="up"
          subtitle="Verifikovane firme"
        />
        <AnalyticsCard
          icon={TrendingUp}
          label="Stanje platforme"
          value="98.2%"
          change="+0.5%"
          trend="up"
          subtitle="Dostupnost sistema"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: 'Pregled prijava na čekanju', count: 24, color: 'from-red-500/20 to-orange-500/20', href: '/admin/moderation' },
          { title: 'Verifikuj firme', count: 18, color: 'from-blue-500/20 to-cyan-500/20', href: '/admin/verification' },
          { title: 'Suspendovani korisnici', count: 3, color: 'from-yellow-500/20 to-amber-500/20', href: '/admin/users' },
          { title: 'Prijave lažnih recenzija', count: 8, color: 'from-purple-500/20 to-pink-500/20', href: '/admin/moderation' },
          { title: 'Tiketi podrške', count: 42, color: 'from-green-500/20 to-emerald-500/20', href: '/admin/settings' },
          { title: 'Sistemska upozorenja', count: 2, color: 'from-indigo-500/20 to-blue-500/20', href: '/admin/settings' },
        ].map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className={`p-6 rounded-2xl bg-gradient-to-br ${action.color} border border-border hover:border-primary transition cursor-pointer`}
          >
            <p className="text-sm text-muted-foreground mb-2">{action.title}</p>
            <p className="text-3xl font-bold">{action.count}</p>
            <p className="text-xs text-primary mt-3">Pogledaj detalje →</p>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-border bg-card">
          <h2 className="text-lg font-semibold mb-4">Nedavne prijave</h2>
          <div className="space-y-3">
            {[
              { id: 1, type: 'Lažna recenzija', business: 'Elite Usluge', severity: 'Visok' },
              { id: 2, type: 'Neprimeren sadržaj', user: 'Jovan Jovanović', severity: 'Srednji' },
              { id: 3, type: 'Neželjeni sadržaj', business: 'Brza Rešenja', severity: 'Nizak' },
              { id: 4, type: 'Prijava prevare', business: 'Pro Popravke', severity: 'Visok' },
            ].map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition">
                <div>
                  <p className="text-sm font-medium">{report.type}</p>
                  <p className="text-xs text-muted-foreground">{report.business || report.user}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
                  report.severity === 'Visok' ? 'bg-red-500/20 text-red-600' :
                  report.severity === 'Srednji' ? 'bg-amber-500/20 text-amber-600' :
                  'bg-green-500/20 text-green-600'
                }`}>
                  {report.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card">
          <h2 className="text-lg font-semibold mb-4">Verifikacije na čekanju</h2>
          <div className="space-y-3">
            {[
              { business: 'Elite Električari', date: 'pre 2 sata', docs: '3/4' },
              { business: 'Brzi Vodoinstalateri', date: 'pre 5 sati', docs: '2/4' },
              { business: 'Pro Krečenje', date: 'pre 1 dana', docs: '4/4' },
              { business: 'Klima Eksperti', date: 'pre 2 dana', docs: '3/4' },
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
