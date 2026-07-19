'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { day: 'Pon', leads: 24, contacted: 12, converted: 3 },
  { day: 'Uto', leads: 31, contacted: 15, converted: 4 },
  { day: 'Sre', leads: 28, contacted: 18, converted: 5 },
  { day: 'Čet', leads: 42, contacted: 25, converted: 7 },
  { day: 'Pet', leads: 35, contacted: 20, converted: 6 },
  { day: 'Sub', leads: 28, contacted: 14, converted: 4 },
  { day: 'Ned', leads: 15, contacted: 8, converted: 2 },
]

export function LeadsChart() {
  return (
    <div className="p-6 rounded-2xl border border-border bg-card">
      <h2 className="text-lg font-semibold mb-4">Upiti ove nedelje</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
          <XAxis dataKey="day" stroke="rgba(0,0,0,0.5)" />
          <YAxis stroke="rgba(0,0,0,0.5)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Line type="monotone" dataKey="leads" stroke="#2563eb" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="contacted" stroke="#10b981" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="converted" stroke="#f59e0b" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-muted-foreground">Novi upiti</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-muted-foreground">Kontaktirani</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-muted-foreground">Pretvoreni</span>
        </div>
      </div>
    </div>
  )
}
