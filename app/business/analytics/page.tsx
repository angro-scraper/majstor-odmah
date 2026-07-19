'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'

const monthlyData = [
  { month: 'Jan', views: 2400, calls: 240, conversions: 24 },
  { month: 'Feb', views: 3210, calls: 340, conversions: 32 },
  { month: 'Mar', views: 2290, calls: 290, conversions: 23 },
  { month: 'Apr', views: 2000, calls: 280, conversions: 22 },
  { month: 'Maj', views: 2181, calls: 280, conversions: 29 },
  { month: 'Jun', views: 2500, calls: 340, conversions: 35 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analitika</h1>
        <p className="text-muted-foreground mt-1">Detaljan uvid u rezultate vaše firme</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Ukupno pregleda', value: '15.482', change: '+23,5%' },
          { label: 'Ukupno poziva', value: '1.842', change: '+12,1%' },
          { label: 'Stopa konverzije', value: '8,4%', change: '+2,3%' },
          { label: 'Prosečno vreme odgovora', value: '2,1 h', change: '-15%' },
        ].map((kpi) => (
          <div key={kpi.label} className="p-4 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted-foreground font-semibold uppercase">{kpi.label}</p>
            <p className="text-2xl font-bold mt-2">{kpi.value}</p>
            <p className="text-xs text-green-600 mt-2">{kpi.change}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-border bg-card">
          <h2 className="text-lg font-semibold mb-4">Trend rezultata</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="month" stroke="rgba(0,0,0,0.5)" />
              <YAxis stroke="rgba(0,0,0,0.5)" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="calls" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-2xl border border-border bg-card">
          <h2 className="text-lg font-semibold mb-4">Konverzije po mesecima</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="month" stroke="rgba(0,0,0,0.5)" />
              <YAxis stroke="rgba(0,0,0,0.5)" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="conversions" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performing Services */}
      <div className="p-6 rounded-2xl border border-border bg-card">
        <h2 className="text-lg font-semibold mb-4">Najuspešnije usluge</h2>
        <div className="space-y-3">
          {[
            { service: 'Popravke elektroinstalacija', views: 1240, calls: 124, rate: '9,8%' },
            { service: 'Vodoinstalaterske usluge', views: 980, calls: 95, rate: '8,2%' },
            { service: 'Ugradnja klima sistema', views: 750, calls: 72, rate: '7,5%' },
            { service: 'Krečenje', views: 640, calls: 58, rate: '6,8%' },
          ].map((service) => (
            <div key={service.service} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition">
              <span className="text-sm font-medium">{service.service}</span>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{service.views} pregleda</span>
                <span>{service.calls} poziva</span>
                <span className="text-primary font-semibold">{service.rate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
