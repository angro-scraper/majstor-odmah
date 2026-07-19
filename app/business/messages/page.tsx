'use client'

import { Send } from 'lucide-react'
import { useState } from 'react'

export default function BusinessMessagesPage() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([{ id: 1, text: 'Zdravo, da li imate slobodan termin sutra?', sender: 'customer' }, { id: 2, text: 'Imamo slobodan termin u 10:00. Da li vam odgovara?', sender: 'business' }])
  const sendMessage = () => { const value = message.trim(); if (!value) return; setMessages((current) => [...current, { id: Date.now(), text: value, sender: 'business' }]); setMessage('') }
  return <div className="space-y-6"><div><h1 className="text-3xl font-bold">Poruke</h1><p className="mt-1 text-muted-foreground">Odgovori korisnicima brzo i jasno.</p></div><section className="overflow-hidden rounded-2xl border border-border bg-card"><header className="border-b border-border p-4"><p className="font-semibold">Marko J.</p><p className="text-xs text-muted-foreground">Upit za uslugu · pre 2 min</p></header><div className="min-h-72 space-y-3 p-4">{messages.map((item) => <div key={item.id} className={`flex ${item.sender === 'business' ? 'justify-end' : 'justify-start'}`}><p className={`max-w-sm rounded-2xl px-4 py-3 text-sm ${item.sender === 'business' ? 'bg-primary text-primary-foreground' : 'border border-border bg-secondary text-foreground'}`}>{item.text}</p></div>)}</div><form onSubmit={(event) => { event.preventDefault(); sendMessage() }} className="flex gap-2 border-t border-border p-3"><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Napiši odgovor…" className="min-w-0 flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm" /><button className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground" aria-label="Pošalji poruku"><Send className="size-4" /></button></form></section></div>
}
