'use client'

import { LoaderCircle, Send, ShieldCheck, Sparkles } from 'lucide-react'
import { useState } from 'react'

type Recommendation = { entityId: string; title: string; subtitle: string; reason: string; actionUrl: string }
type Message = { id: number; text: string; sender: 'ai' | 'user'; recommendations?: Recommendation[] }

const apiUrl = (process.env.NEXT_PUBLIC_API_URL || '/api/v1').replace(/\/$/, '')

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'ai', text: 'Zdravo! Opiši šta ti treba, a Balkan AI će pretražiti javno dostupne firme i aktivne ponude. Ne izvršavam rezervacije, plaćanja ni izmene bez tvoje potvrde.' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    const message = input.trim()
    if (!message || loading) return
    setMessages((current) => [...current, { id: Date.now(), text: message, sender: 'user' }])
    setInput('')
    setLoading(true)

    try {
      const token = window.localStorage.getItem('access_token')
      const response = await fetch(`${apiUrl}${token ? '/ai/chat' : '/search/ai'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(token ? { message } : { query: message }),
      })
      const payload = await response.json()
      if (!response.ok || !payload.success) throw new Error(payload?.error?.message || 'AI trenutno nije dostupan.')
      const data = payload.data
      const recommendations: Recommendation[] = data.recommendations ?? (data.results ?? []).slice(0, 5).map((business: { id: string; name: string; description?: string; slug?: string }) => ({
        entityId: business.id, title: business.name, subtitle: business.description || 'Lokalna firma', reason: 'Podudaranje sa zahtevom i javnim poslovnim profilom.', actionUrl: `/app/business/${business.id}`,
      }))
      setMessages((current) => [...current, { id: Date.now() + 1, sender: 'ai', text: data.answer || data.explanation || 'Evo rezultata iz javnih poslovnih profila.', recommendations }])
    } catch (error) {
      setMessages((current) => [...current, { id: Date.now() + 1, sender: 'ai', text: error instanceof Error ? error.message : 'Došlo je do greške pri AI pretrazi. Pokušaj ponovo.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 py-6 flex flex-col h-full max-h-screen">
      <div className="mb-5">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2"><Sparkles className="w-8 h-8 text-primary" />Balkan AI</h1>
        <p className="text-muted-foreground">Opiši potrebu prirodnim jezikom — pronaći ćemo lokalne opcije.</p>
      </div>
      <div className="mb-5 flex items-start gap-2 rounded-2xl border border-primary/15 bg-primary/5 p-3 text-xs text-muted-foreground"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />Preporuke koriste javne profile i aktivne ponude. Uloguj se za personalizaciju prema sačuvanim interesovanjima i lokaciji.</div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-sm ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground border border-border'} px-4 py-3 rounded-2xl`}>
              <p className="text-sm leading-6">{msg.text}</p>
              {msg.recommendations?.length ? <div className="mt-3 space-y-2">{msg.recommendations.map((recommendation) => <a key={recommendation.entityId} href={recommendation.actionUrl} className="block rounded-xl border border-border bg-card p-3 text-foreground transition hover:border-primary/40"><p className="font-semibold text-sm">{recommendation.title}</p><p className="mt-1 text-xs text-muted-foreground">{recommendation.subtitle}</p><p className="mt-2 text-xs text-primary">AI razlog: {recommendation.reason}</p></a>)}</div> : null}
            </div>
          </div>
        ))}
        {loading ? <div className="flex items-center gap-2 text-sm text-muted-foreground"><LoaderCircle className="h-4 w-4 animate-spin" />Pretražujem proverene podatke...</div> : null}
      </div>

      <div className="flex gap-2">
        <input aria-label="Pitanje za Balkan AI" type="text" placeholder="Treba mi dobar majstor za klimu danas..." value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && handleSend()} className="flex-1 px-4 py-3 rounded-2xl border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        <button aria-label="Pošalji AI zahtev" disabled={loading} onClick={handleSend} className="px-4 py-3 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition disabled:opacity-60"><Send className="w-5 h-5" /></button>
      </div>
    </div>
  )
}
