'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Filter, Phone, MessageSquare } from 'lucide-react'
import { useState } from 'react'

const leads = [
  { id: 1, name: 'Marko Jeremić', service: 'Electrical Repair', date: 'Jan 15', status: 'new', rating: 'Not rated' },
  { id: 2, name: 'Ana Nikolić', service: 'Plumbing', date: 'Jan 14', status: 'contacted', rating: 'Not rated' },
  { id: 3, name: 'Dejan Stojanović', service: 'HVAC', date: 'Jan 12', status: 'converted', rating: '5 stars' },
  { id: 4, name: 'Jelena Marić', service: 'Electrical Repair', date: 'Jan 10', status: 'new', rating: 'Not rated' },
  { id: 5, name: 'Nebojša Pavlović', service: 'Painting', date: 'Jan 9', status: 'converted', rating: '4 stars' },
]

export default function LeadsPage() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filteredLeads = leads.filter(lead => {
    if (filter !== 'all' && lead.status !== filter) return false
    if (search && !lead.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Leads Management</h1>
        <p className="text-muted-foreground mt-1">Manage and track all your inquiries</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'New Leads', value: '12', color: 'bg-blue-500/10 text-blue-600' },
          { label: 'Contacted', value: '24', color: 'bg-amber-500/10 text-amber-600' },
          { label: 'Converted', value: '8', color: 'bg-green-500/10 text-green-600' },
        ].map((stat) => (
          <div key={stat.label} className={`p-4 rounded-xl border border-border ${stat.color}`}>
            <p className="text-sm font-medium opacity-75">{stat.label}</p>
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
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>
        <button className="px-4 py-2.5 rounded-lg border border-border bg-card hover:border-primary transition flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filter
        </button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All Leads ({leads.length})</TabsTrigger>
          <TabsTrigger value="new">New ({leads.filter(l => l.status === 'new').length})</TabsTrigger>
          <TabsTrigger value="contacted">Contacted ({leads.filter(l => l.status === 'contacted').length})</TabsTrigger>
          <TabsTrigger value="converted">Converted ({leads.filter(l => l.status === 'converted').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          <div className="border border-border rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Service</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Rating</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-secondary/30 transition">
                    <td className="px-6 py-4 text-sm font-medium">{lead.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{lead.service}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{lead.date}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        lead.status === 'new' ? 'bg-blue-500/20 text-blue-600' :
                        lead.status === 'contacted' ? 'bg-amber-500/20 text-amber-600' :
                        'bg-green-500/20 text-green-600'
                      }`}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{lead.rating}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded hover:bg-secondary transition">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-secondary transition">
                          <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
