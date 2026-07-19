'use client'

import Link from 'next/link'
import { Bookmark, Globe, MessageSquare, Phone, Share2 } from 'lucide-react'
import { useState } from 'react'

interface BusinessProfileActionsProps {
  businessId: string
  businessName: string
}

export function BusinessProfileActions({ businessId, businessName }: BusinessProfileActionsProps) {
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareProfile = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: businessName, text: `Pogledaj ${businessName} na balkan.works`, url })
      return
    }
    await navigator.clipboard.writeText(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2"><h1 className="text-2xl font-bold">{businessName}</h1></div>
          <p className="text-sm text-muted-foreground mb-3">Electrical Services</p>
        </div>
        <button type="button" onClick={() => setSaved((current) => !current)} aria-label={saved ? 'Ukloni iz sačuvanog' : 'Sačuvaj firmu'} aria-pressed={saved} className="p-3 rounded-lg bg-secondary border border-border hover:border-primary transition"><Bookmark className={`w-5 h-5 ${saved ? 'fill-primary text-primary' : ''}`} /></button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <a href="tel:+381111234567" className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition"><Phone className="w-5 h-5" />Pozovi</a>
        <Link href={`/app/messages?business=${encodeURIComponent(businessId)}`} className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border bg-card hover:border-primary transition"><MessageSquare className="w-5 h-5" />Poruka</Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <a href="https://www.google.com/maps/search/?api=1&query=Beograd" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border bg-card hover:border-primary transition"><Globe className="w-5 h-5" />Navigacija</a>
        <button type="button" onClick={shareProfile} className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border bg-card hover:border-primary transition"><Share2 className="w-5 h-5" />{copied ? 'Kopirano' : 'Podeli'}</button>
      </div>
    </>
  )
}
