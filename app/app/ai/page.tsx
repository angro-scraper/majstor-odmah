'use client'

import { MessageSquare, Sparkles, Send } from 'lucide-react'
import { useState } from 'react'

export default function AIPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI assistant. Tell me what you need and I'll find the best local solutions for you.",
      sender: 'ai',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    
    setMessages([
      ...messages,
      { id: messages.length + 1, text: input, sender: 'user', timestamp: new Date() },
    ])
    setInput('')
  }

  return (
    <div className="px-4 py-6 flex flex-col h-full max-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Sparkles className="w-8 h-8 text-primary" />
          AI Assistant
        </h1>
        <p className="text-muted-foreground">Describe what you need, we'll find it</p>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2.5 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground border border-border'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="I need..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-4 py-3 rounded-2xl border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          onClick={handleSend}
          className="px-4 py-3 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
