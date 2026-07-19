import { Star, MapPin, Clock, Phone, MessageSquare, Globe, Bookmark, Share2, CheckCircle } from 'lucide-react'
import { use } from 'react'

export default function BusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <div className="pb-24" data-business-id={id}>
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-br from-primary/30 to-secondary/30 border-b border-border" />

      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold">Elite Electricians</h1>
              <CheckCircle className="w-5 h-5 text-primary fill-primary/20" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">Electrical Services</p>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold">4.9</span>
                <span className="text-sm text-muted-foreground">(234 reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                0.5 km away
              </div>
            </div>
          </div>
          <button className="p-3 rounded-lg bg-secondary border border-border hover:border-primary transition">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Quality Score', value: '98%' },
            { label: 'Response Rate', value: '99%' },
            { label: 'Verified', value: '✓' },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-lg bg-secondary/50 border border-border text-center">
              <p className="text-lg font-bold text-primary">{item.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition">
            <Phone className="w-5 h-5" />
            Call
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border bg-card hover:border-primary transition">
            <MessageSquare className="w-5 h-5" />
            Message
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border bg-card hover:border-primary transition">
            <Globe className="w-5 h-5" />
            Website
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border bg-card hover:border-primary transition">
            <Share2 className="w-5 h-5" />
            Share
          </button>
        </div>

        {/* About */}
        <div className="space-y-2">
          <h2 className="font-semibold">About</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Professional electrical services for residential and commercial properties. Licensed, insured, and certified. Available for emergency repairs, installations, and inspections.
          </p>
        </div>

        {/* Services */}
        <div className="space-y-3">
          <h2 className="font-semibold">Services</h2>
          <div className="space-y-2">
            {['Electrical Repairs', 'Wiring & Installation', 'Panel Upgrades', 'Emergency Service'].map((service) => (
              <div key={service} className="p-3 rounded-lg bg-secondary/50 border border-border">
                <p className="text-sm font-medium">{service}</p>
                <p className="text-xs text-muted-foreground mt-1">Professional • Licensed</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hours */}
        <div className="p-4 rounded-lg bg-secondary/50 border border-border space-y-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Working Hours
          </h3>
          <div className="text-sm space-y-1 text-muted-foreground">
            <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
            <p>Saturday: 9:00 AM - 4:00 PM</p>
            <p>Sunday & Holidays: Available for emergencies</p>
          </div>
        </div>

        {/* Reviews */}
        <div className="space-y-3">
          <h2 className="font-semibold">Recent Reviews</h2>
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm">Review #{i}</p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">"Excellent service! Very professional and quick response."</p>
              <p className="text-xs text-muted-foreground mt-2">2 days ago</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
