'use client'

import { Search, Eye, AlertTriangle, Trash2 } from 'lucide-react'
import { useState } from 'react'

const businesses = [
  { id: 1, name: 'Elite Electricians', owner: 'Marko Marković', category: 'Electrical', verified: true, rating: 4.9, views: 2481 },
  { id: 2, name: 'Quick Plumbing', owner: 'Ana Nikolić', category: 'Plumbing', verified: true, rating: 4.8, views: 1840 },
  { id: 3, name: 'Fast Fixes', owner: 'Unknown', category: 'General', verified: false, rating: 2.1, views: 340 },
  { id: 4, name: 'Pro Painting', owner: 'Dejan Stojanović', category: 'Painting', verified: true, rating: 4.7, views: 1250 },
]

export default function BusinessesPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = businesses.filter(b => {
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false
    if (filter === 'verified' && !b.verified) return false
    if (filter === 'unverified' && b.verified) return false
    if (filter === 'flagged' && b.rating > 3) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Business Management</h1>
        <p className="text-muted-foreground mt-1">Manage platform businesses</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Businesses', value: '3,241' },
          { label: 'Verified', value: '2,940' },
          { label: 'Pending', value: '18' },
          { label: 'Flagged', value: '8' },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl border border-border bg-card">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search businesses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:border-primary"
        >
          <option value="all">All</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>

      {/* Businesses Table */}
      <div className="border border-border rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary/50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Business</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Owner</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Verified</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Rating</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Views</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((business) => (
              <tr key={business.id} className="hover:bg-secondary/30 transition">
                <td className="px-6 py-4 text-sm font-medium">{business.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{business.owner}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{business.category}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    business.verified
                      ? 'bg-green-500/20 text-green-600'
                      : 'bg-amber-500/20 text-amber-600'
                  }`}>
                    {business.verified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">{business.rating}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{business.views.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button className="p-1.5 hover:bg-secondary rounded transition">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </button>
                  {business.rating < 3 && (
                    <button className="p-1.5 hover:bg-secondary rounded transition">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    </button>
                  )}
                  <button className="p-1.5 hover:bg-secondary rounded transition">
                    <Trash2 className="w-4 h-4 text-red-600" />
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
