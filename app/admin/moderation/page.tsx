'use client'

import { AlertTriangle, Trash2, Ban, CheckCircle, Eye } from 'lucide-react'
import { useState } from 'react'

const reports = [
  {
    id: 1,
    type: 'Fake Review',
    reporter: 'Marko Marković',
    target: 'Elite Services',
    description: 'Review seems fabricated, same content as another user',
    status: 'pending',
    severity: 'high',
    date: '2 hours ago',
  },
  {
    id: 2,
    type: 'Spam',
    reporter: 'Ana Nikolić',
    target: 'Fast Fixes',
    description: 'Multiple spam messages in comments',
    status: 'in_review',
    severity: 'medium',
    date: '4 hours ago',
  },
  {
    id: 3,
    type: 'Inappropriate Content',
    reporter: 'System',
    target: 'John Doe',
    description: 'Profile contains inappropriate language',
    status: 'pending',
    severity: 'medium',
    date: '1 day ago',
  },
  {
    id: 4,
    type: 'Scam Accusation',
    reporter: 'Customer',
    target: 'Pro Repairs',
    description: 'Customer claims they were overcharged',
    status: 'resolved',
    severity: 'high',
    date: '3 days ago',
  },
]

export default function ModerationPage() {
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedReport, setSelectedReport] = useState<number | null>(null)

  const filtered = reports.filter(r => filterStatus === 'all' || r.status === filterStatus)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <AlertTriangle className="w-8 h-8 text-destructive" />
          Moderation Center
        </h1>
        <p className="text-muted-foreground mt-1">Review and manage user reports</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Pending', value: '12', color: 'text-blue-600' },
          { label: 'In Review', value: '5', color: 'text-amber-600' },
          { label: 'Resolved', value: '89', color: 'text-green-600' },
          { label: 'Dismissed', value: '23', color: 'text-muted-foreground' },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl border border-border bg-card">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'pending', 'in_review', 'resolved'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition ${
              filterStatus === status
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary border border-border hover:border-primary'
            }`}
          >
            {status === 'all' ? 'All Reports' : status.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filtered.map((report) => (
          <div
            key={report.id}
            onClick={() => setSelectedReport(selectedReport === report.id ? null : report.id)}
            className="p-4 rounded-xl border border-border bg-card hover:border-primary transition cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold flex items-center gap-2">
                  {report.type}
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    report.severity === 'high' ? 'bg-red-500/20 text-red-600' :
                    report.severity === 'medium' ? 'bg-amber-500/20 text-amber-600' :
                    'bg-green-500/20 text-green-600'
                  }`}>
                    {report.severity.toUpperCase()}
                  </span>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span>By: {report.reporter}</span>
                  <span>Target: {report.target}</span>
                  <span>{report.date}</span>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ml-2 ${
                report.status === 'pending' ? 'bg-blue-500/20 text-blue-600' :
                report.status === 'in_review' ? 'bg-amber-500/20 text-amber-600' :
                'bg-green-500/20 text-green-600'
              }`}>
                {report.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {/* Expanded Details */}
            {selectedReport === report.id && (
              <div className="mt-4 pt-4 border-t border-border space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border bg-secondary hover:bg-secondary/80 transition text-sm font-medium">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border bg-secondary hover:bg-secondary/80 transition text-sm font-medium">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Approve
                  </button>
                  <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 transition text-sm font-medium text-amber-600">
                    <Ban className="w-4 h-4" />
                    Suspend User
                  </button>
                  <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-destructive/50 bg-destructive/10 hover:bg-destructive/20 transition text-sm font-medium text-destructive">
                    <Trash2 className="w-4 h-4" />
                    Delete Content
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
