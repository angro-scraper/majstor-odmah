'use client'

import { LoaderCircle, ShieldCheck, Sparkles } from 'lucide-react'
import { useState } from 'react'

type Insight = { area: string; priority: string; suggestion: string }
const apiUrl = (process.env.NEXT_PUBLIC_API_URL || '/api/v1').replace(/\/$/, '')

export default function AICoachPage() {
  const [businessId, setBusinessId] = useState('')
  const [insights, setInsights] = useState<Insight[]>([])
  const [message, setMessage] = useState('Unesite ID svoje firme da biste dobili analizu javnog profila i aktivnosti.')
  const [loading, setLoading] = useState(false)

  const analyze = async () => {
    if (!businessId.trim() || loading) return
    setLoading(true)
    try {
      const token = window.localStorage.getItem('access_token')
      if (!token) throw new Error('Prijavite se kao vlasnik firme da biste koristili AI savetnika.')
      const response = await fetch(`${apiUrl}/business/ai/analyze`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ businessId: businessId.trim() }) })
      const payload = await response.json()
      if (!response.ok || !payload.success) throw new Error(payload?.error?.message || 'Analiza trenutno nije dostupna.')
      setInsights(payload.data.suggestions || [])
      setMessage(payload.data.suggestions?.length ? 'Predlozi su zasnovani na podacima tvog javnog profila i poslednjih 30 dana aktivnosti.' : 'Profil je trenutno dobro popunjen. Nastavi da ažuriraš ponude i informacije.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Došlo je do greške pri analizi.') } finally { setLoading(false) }
  }

  return <div className="space-y-6"><div><h1 className="text-3xl font-bold flex items-center gap-2"><Sparkles className="w-8 h-8 text-primary" />Balkan AI za firme</h1><p className="text-muted-foreground mt-1">Jasni predlozi za vidljivost, ponude i profil — bez automatskih izmena.</p></div><div className="rounded-2xl border border-primary/15 bg-primary/5 p-4 flex gap-3 text-sm text-muted-foreground"><ShieldCheck className="h-5 w-5 shrink-0 text-primary" />AI ne objavljuje kampanje, ne menja podatke i ne pokreće finansijske radnje. Svaka akcija ostaje pod kontrolom vlasnika firme.</div><div className="rounded-2xl border border-border bg-card p-5"><label htmlFor="business-id" className="font-semibold">Analiziraj firmu</label><div className="mt-3 flex gap-3"><input id="business-id" value={businessId} onChange={(event) => setBusinessId(event.target.value)} placeholder="ID firme" className="min-w-0 flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm" /><button onClick={analyze} disabled={loading} className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">{loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : 'Pokreni analizu'}</button></div></div><div className="rounded-2xl border border-border bg-card p-5"><h2 className="font-semibold">AI uvid</h2><p className="mt-2 text-sm text-muted-foreground">{message}</p>{insights.length ? <div className="mt-4 space-y-3">{insights.map((insight, index) => <div key={`${insight.area}-${index}`} className="rounded-xl bg-secondary/60 p-4"><span className="text-xs font-semibold uppercase text-primary">{insight.area} · {insight.priority}</span><p className="mt-1 text-sm">{insight.suggestion}</p></div>)}</div> : null}</div></div>
}
