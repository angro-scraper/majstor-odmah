import { Bookmark } from 'lucide-react'

export const metadata = {
  title: 'Saved — balkan.works',
}

export default function SavedPage() {
  return (
    <div className="px-4 py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Bookmark className="w-8 h-8" />
          Saved
        </h1>
        <p className="text-muted-foreground">Your favorite businesses & collections</p>
      </div>

      <div className="space-y-4">
        {['Favorites (12)', 'My Collections (3)', 'Recently Saved'].map((section) => (
          <div key={section} className="p-4 rounded-2xl bg-secondary/50 border border-border hover:border-primary transition cursor-pointer">
            <h3 className="font-semibold">{section}</h3>
            <p className="text-xs text-muted-foreground mt-1">Browse your saved items</p>
          </div>
        ))}
      </div>

      <div className="text-center py-12 text-muted-foreground">
        <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-20" />
        <p className="text-sm">Start saving businesses to see them here</p>
      </div>
    </div>
  )
}
