'use client'

import { Paperclip, Search, Send } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { FormEvent, Suspense, useMemo, useState } from 'react'

const conversations = [
  { id: 1, name: 'Elite Električari', avatar: 'E', lastMessage: 'Termin je potvrđen za sutra', time: 'Pre 2 min', unread: 2 },
  { id: 2, name: 'Brzi Vodoinstalateri', avatar: 'B', lastMessage: 'Hvala na recenziji!', time: 'Pre 1 h', unread: 0 },
  { id: 3, name: 'Pro Krečenje', avatar: 'P', lastMessage: 'Možemo pomoći sa terminom', time: 'Juče', unread: 0 },
]

type ChatMessage = { id: number; sender: 'them' | 'me'; text: string; time: string }

const initialMessages: ChatMessage[] = [
  { id: 1, sender: 'them', text: 'Zdravo! Hvala na rezervaciji kod nas.', time: '10:30' },
  { id: 2, sender: 'me', text: 'Hvala, radujem se terminu.', time: '10:35' },
  { id: 3, sender: 'them', text: 'Vaš termin je potvrđen za sutra u 10:00.', time: '10:40' },
]

function MessagesExperience() {
  const searchParams = useSearchParams()
  const initialSelected = Number(searchParams.get('business')) || 1
  const [selected, setSelected] = useState(initialSelected)
  const [message, setMessage] = useState('')
  const [filter, setFilter] = useState('')
  const [messages, setMessages] = useState(initialMessages)
  const activeConversation = conversations.find((conversation) => conversation.id === selected) ?? conversations[0]
  const visibleConversations = useMemo(() => conversations.filter((conversation) => conversation.name.toLowerCase().includes(filter.toLowerCase().trim())), [filter])

  const submitMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!message.trim()) return
    setMessages((current) => [...current, { id: Date.now(), sender: 'me', text: message.trim(), time: 'Sada' }])
    setMessage('')
  }

  return (
    <div className="h-full space-y-4 px-4 py-6 pb-24">
      <header><h1 className="text-3xl font-bold text-navy">Poruke</h1><p className="mt-1 text-muted-foreground">Dogovori detalje sa lokalnim firmama na jednom mestu.</p></header>
      <div className="grid min-h-[560px] grid-cols-1 gap-4 md:grid-cols-3">
        <aside className="space-y-2 md:border-r md:border-border md:pr-4"><div className="relative mb-3"><Search className="absolute left-3 top-3 size-5 text-muted-foreground" /><input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Pretraži razgovore…" className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary" /></div>{visibleConversations.map((conversation) => <button key={conversation.id} type="button" onClick={() => setSelected(conversation.id)} className={`w-full rounded-xl border p-3 text-left transition ${selected === conversation.id ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/40'}`}><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">{conversation.avatar}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-navy">{conversation.name}</p><p className="mt-0.5 truncate text-xs text-muted-foreground">{conversation.lastMessage}</p></div><div className="text-right"><p className="text-xs text-muted-foreground">{conversation.time}</p>{conversation.unread ? <span className="mt-1 inline-grid size-5 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{conversation.unread}</span> : null}</div></div></button>)}{visibleConversations.length === 0 ? <p className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">Nema razgovora za ovu pretragu.</p> : null}</aside>
        <section className="flex min-h-[440px] flex-col overflow-hidden rounded-2xl border border-border bg-card md:col-span-2"><header className="flex items-center justify-between border-b border-border p-4"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-full bg-primary/10 font-bold text-primary">{activeConversation.avatar}</div><div><h2 className="font-semibold text-navy">{activeConversation.name}</h2><p className="text-xs text-turquoise">Aktivan sada</p></div></div><button type="button" aria-label="Opcije razgovora" className="rounded-lg px-2 py-1 text-muted-foreground hover:bg-secondary">•••</button></header><div className="flex-1 space-y-3 overflow-y-auto p-4">{messages.map((item) => <div key={item.id} className={`flex ${item.sender === 'me' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-xs rounded-2xl px-4 py-2.5 ${item.sender === 'me' ? 'bg-primary text-primary-foreground' : 'border border-border bg-secondary text-navy'}`}><p className="text-sm">{item.text}</p><p className={`mt-1 text-xs ${item.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{item.time}</p></div></div>)}</div><form onSubmit={submitMessage} className="flex gap-2 border-t border-border p-3"><button type="button" aria-label="Priloži datoteku" className="rounded-lg p-2 hover:bg-secondary"><Paperclip className="size-5 text-muted-foreground" /></button><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Napiši poruku…" className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" /><button type="submit" aria-label="Pošalji poruku" className="rounded-xl bg-primary p-2.5 text-primary-foreground transition hover:bg-primary/90"><Send className="size-5" /></button></form></section>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return <Suspense fallback={<div className="px-4 py-6 text-sm text-muted-foreground">Učitavam poruke…</div>}><MessagesExperience /></Suspense>
}
