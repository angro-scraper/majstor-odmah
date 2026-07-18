'use client'

import { Sparkles, Send } from 'lucide-react'
import { useState } from 'react'

export function AISearch() {
  const [query, setQuery] = useState('')

  return (
    <div className="px-4 space-y-3">
      <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-primary bg-primary/10 rounded-full w-fit">
        <Sparkles className="w-3 h-3" />
        AI-Powered Search
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="I need an electrician today..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-3 rounded-2xl border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button className="px-4 py-3 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition">
          <Send className="w-5 h-5" />
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {['Electrician', 'Plumber', 'Today', 'Nearby'].map((tag) => (
          <button
            key={tag}
            className="px-3 py-1.5 text-xs rounded-full bg-secondary text-secondary-foreground border border-border hover:border-primary transition"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}
