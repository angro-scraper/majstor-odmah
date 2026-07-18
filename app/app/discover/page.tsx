import { Compass } from 'lucide-react'

export const metadata = {
  title: 'Discover — balkan.works',
}

export default function DiscoverPage() {
  return (
    <div className="px-4 py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Compass className="w-8 h-8" />
          Discover
        </h1>
        <p className="text-muted-foreground">Trending businesses & local highlights</p>
      </div>

      <div className="grid gap-4">
        {['Trending Businesses', 'New Services', 'Local Events', 'Community Highlights'].map((section) => (
          <div key={section} className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border hover:border-primary transition cursor-pointer">
            <h3 className="font-semibold mb-2">{section}</h3>
            <p className="text-sm text-muted-foreground">Curated for your area</p>
          </div>
        ))}
      </div>
    </div>
  )
}
