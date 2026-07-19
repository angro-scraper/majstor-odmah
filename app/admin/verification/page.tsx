'use client'

import { CheckCircle, X, Download, Eye } from 'lucide-react'
import { useState } from 'react'

const pendingBusinesses = [
  {
    id: 1,
    name: 'Elite Električari',
    owner: 'Marko Marković',
    category: 'Električarske usluge',
    documents: { license: '✓', insurance: '✓', id: '✗', address: '✗' },
    submittedDate: 'pre 2 dana',
    progress: 50,
  },
  {
    id: 2,
    name: 'Brzi Vodoinstalateri',
    owner: 'Ana Nikolić',
    category: 'Vodoinstalaterske usluge',
    documents: { license: '✓', insurance: '✓', id: '✓', address: '✓' },
    submittedDate: 'pre 1 dana',
    progress: 100,
  },
  {
    id: 3,
    name: 'Pro Krečenje',
    owner: 'Dejan Stojanović',
    category: 'Krečenje',
    documents: { license: '✓', insurance: '✗', id: '✗', address: '✓' },
    submittedDate: 'pre 3 dana',
    progress: 50,
  },
]

export default function VerificationPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CheckCircle className="w-8 h-8 text-primary" />
          Verifikacija firmi
        </h1>
        <p className="text-muted-foreground mt-1">Pregledajte i odobravajte prijave firmi</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Na čekanju', value: '18', color: 'bg-blue-500/20 text-blue-600' },
          { label: 'Odobreno', value: '2.940', color: 'bg-green-500/20 text-green-600' },
          { label: 'Odbijeno', value: '24', color: 'bg-red-500/20 text-red-600' },
        ].map((stat) => (
          <div key={stat.label} className={`p-4 rounded-xl border border-border ${stat.color}`}>
            <p className="text-sm font-medium opacity-75">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Verification Queue */}
      <div className="space-y-4">
        {pendingBusinesses.map((business) => (
          <div
            key={business.id}
            className="p-6 rounded-2xl border border-border bg-card hover:border-primary transition"
          >
            <div
              onClick={() => setExpandedId(expandedId === business.id ? null : business.id)}
              className="cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold">{business.name}</h3>
                  <p className="text-sm text-muted-foreground">{business.category} • Vlasnik: {business.owner}</p>
                </div>
                <span className="text-xs text-muted-foreground">{business.submittedDate}</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-secondary overflow-hidden mb-4">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${business.progress}%` }}
                />
              </div>

              {/* Documents Grid */}
              <div className="grid grid-cols-4 gap-3">
                {Object.entries(business.documents).map(([doc, status]) => (
                  <div
                    key={doc}
                    className={`p-3 rounded-lg text-center text-xs font-medium ${
                      status === '✓'
                        ? 'bg-green-500/20 text-green-600'
                        : 'bg-red-500/20 text-red-600'
                    }`}
                  >
                    <p className="capitalize">{doc}</p>
                    <p className="mt-1 text-lg">{status}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Expanded Actions */}
            {expandedId === business.id && (
              <div className="mt-6 pt-6 border-t border-border space-y-4">
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Potrebna dokumenta</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {Object.entries(business.documents).map(([doc, status]) => (
                      <li key={doc} className="flex items-center gap-2">
                        {status === '✓' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-600" />
                        )}
                        <span className="capitalize">Provera: {({ license: 'licenca', insurance: 'osiguranje', id: 'identitet', address: 'adresa' }[doc] ?? doc)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3">
                  {Object.values(business.documents).every(v => v === '✓') ? (
                    <>
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-500/20 text-green-600 border border-green-500/50 hover:bg-green-500/30 transition text-sm font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        Odobri firmu
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-secondary hover:bg-secondary/80 transition text-sm font-semibold">
                        <Eye className="w-4 h-4" />
                        Pogledaj detaljnije
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-secondary hover:bg-secondary/80 transition text-sm font-semibold">
                        <Download className="w-4 h-4" />
                        Zatraži dokumenta
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-500/50 bg-red-500/10 hover:bg-red-500/20 transition text-sm font-semibold text-red-600">
                        <X className="w-4 h-4" />
                        Odbij
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
