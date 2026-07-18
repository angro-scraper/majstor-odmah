'use client'

import { Search, Send, Paperclip } from 'lucide-react'
import { useState } from 'react'

const conversations = [
  { id: 1, name: 'Elite Electricians', avatar: 'E', lastMessage: 'Your appointment is confirmed for tomorrow', time: '2 min ago', unread: 2 },
  { id: 2, name: 'Quick Plumbing Co', avatar: 'Q', lastMessage: 'Thank you for your review!', time: '1 hour ago', unread: 0 },
  { id: 3, name: 'John Smith', avatar: 'J', lastMessage: 'Can you send me the invoice?', time: '3 hours ago', unread: 1 },
  { id: 4, name: 'Pro Painting Services', avatar: 'P', lastMessage: 'We are happy to help', time: '1 day ago', unread: 0 },
]

export default function MessagesPage() {
  const [selected, setSelected] = useState(1)
  const [message, setMessage] = useState('')

  const messages = [
    { id: 1, sender: 'them', text: 'Hi! Thanks for booking with us', time: '10:30 AM' },
    { id: 2, sender: 'me', text: 'Thanks! Looking forward to it', time: '10:35 AM' },
    { id: 3, sender: 'them', text: 'Your appointment is confirmed for tomorrow at 10 AM', time: '10:40 AM' },
    { id: 4, sender: 'them', text: 'Please let us know if you have any questions', time: '10:42 AM' },
  ]

  return (
    <div className="px-4 py-6 space-y-0 pb-24 h-full">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground mt-1">Chat with businesses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full max-h-[calc(100vh-180px)]">
        {/* Conversations List */}
        <div className="md:col-span-1 border-r border-border space-y-2 overflow-y-auto">
          <div className="relative sticky top-0 z-10 mb-4">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelected(conv.id)}
              className={`p-3 rounded-lg border cursor-pointer transition ${
                selected === conv.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                  {conv.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{conv.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{conv.time}</p>
                  {conv.unread > 0 && (
                    <span className="inline-block mt-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat View */}
        <div className="md:col-span-2 hidden md:flex flex-col border border-border rounded-lg overflow-hidden bg-card">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                {conversations.find(c => c.id === selected)?.avatar}
              </div>
              <div>
                <p className="font-semibold">{conversations.find(c => c.id === selected)?.name}</p>
                <p className="text-xs text-muted-foreground">Active now</p>
              </div>
            </div>
            <button className="text-muted-foreground hover:text-foreground">···</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2.5 rounded-2xl ${
                    msg.sender === 'me'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground border border-border'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'opacity-75' : 'text-muted-foreground'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <button className="p-2 hover:bg-secondary rounded-lg transition">
                <Paperclip className="w-5 h-5 text-muted-foreground" />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <button className="p-2 hover:bg-secondary rounded-lg transition">
                <Send className="w-5 h-5 text-primary" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
