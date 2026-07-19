'use client'

import { Search, Ban, CheckCircle } from 'lucide-react'
import { useState } from 'react'

const users = [
  { id: 1, name: 'Marko Marković', email: 'marko@primer.rs', joined: 'jan 2024', status: 'active', bookings: 24 },
  { id: 2, name: 'Ana Nikolić', email: 'ana@primer.rs', joined: 'dec 2023', status: 'active', bookings: 12 },
  { id: 3, name: 'Jovan Jovanović', email: 'jovan@primer.rs', joined: 'nov 2023', status: 'suspended', bookings: 8 },
  { id: 4, name: 'Jelena Marić', email: 'jelena@primer.rs', joined: 'okt 2023', status: 'active', bookings: 34 },
  { id: 5, name: 'Dejan Stojanović', email: 'dejan@primer.rs', joined: 'sep 2023', status: 'active', bookings: 19 },
]

export default function UsersPage() {
  const [search, setSearch] = useState('')

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upravljanje korisnicima</h1>
        <p className="text-muted-foreground mt-1">Pregled korisnika i njihovih dozvola</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Ukupno korisnika', value: '12.482' },
          { label: 'Aktivni', value: '11.940' },
          { label: 'Suspendovani', value: '42' },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl border border-border bg-card">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Pretraži korisnike..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        />
      </div>

      {/* Users Table */}
      <div className="border border-border rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary/50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Ime</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Pridružen</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Rezervacije</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Akcije</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-secondary/30 transition">
                <td className="px-6 py-4 text-sm font-medium">{user.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{user.joined}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    user.status === 'active'
                      ? 'bg-green-500/20 text-green-600'
                      : 'bg-red-500/20 text-red-600'
                  }`}>
                    {user.status === 'active' ? 'Aktivan' : 'Suspendovan'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{user.bookings}</td>
                <td className="px-6 py-4 text-sm">
                  <button className="p-1.5 hover:bg-secondary rounded transition">
                    {user.status === 'active' ? (
                      <Ban className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
