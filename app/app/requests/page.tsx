import { DollarSign } from 'lucide-react'

export const metadata = {
  title: 'Service Requests — balkan.works',
}

export default function RequestsPage() {
  const requests = [
    {
      id: 1,
      title: 'Fix kitchen sink',
      description: 'Leaking kitchen sink, needs repair',
      category: 'Plumbing',
      status: 'quoted',
      quotes: 3,
      date: '2 hours ago',
    },
    {
      id: 2,
      title: 'Paint bedroom walls',
      description: 'Repaint two bedroom walls, light color',
      category: 'Painting',
      status: 'pending',
      quotes: 0,
      date: '1 day ago',
    },
    {
      id: 3,
      title: 'Replace light fixtures',
      description: 'Replace 4 light fixtures in hallway',
      category: 'Electrical',
      status: 'quoted',
      quotes: 2,
      date: '3 days ago',
    },
  ]

  return (
    <div className="px-4 py-6 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Service Requests</h1>
          <p className="text-muted-foreground mt-1">Post jobs and get quoted by professionals</p>
        </div>
        <button className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition">
          + New Request
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Requests', value: '8' },
          { label: 'Pending Quotes', value: '3' },
          { label: 'Completed', value: '5' },
        ].map((stat) => (
          <div key={stat.label} className="p-3 rounded-xl border border-border bg-card">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-lg font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {requests.map((request) => (
          <div key={request.id} className="p-4 rounded-2xl border border-border bg-card hover:border-primary transition">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold flex items-center gap-2">
                  {request.title}
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                    request.status === 'quoted' ? 'bg-green-500/20 text-green-600' :
                    request.status === 'pending' ? 'bg-amber-500/20 text-amber-600' :
                    'bg-blue-500/20 text-blue-600'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{request.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
              <span>{request.category}</span>
              <span>•</span>
              <span>{request.date}</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-4">
                {request.quotes > 0 && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold">{request.quotes} quotes</span>
                  </div>
                )}
              </div>
              <button className="text-xs px-3 py-1.5 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium">
                {request.quotes > 0 ? 'View Quotes' : 'View Details'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30">
        <h3 className="font-semibold mb-2">Coming Soon: Smart Matching</h3>
        <p className="text-sm text-muted-foreground">Get automatically matched with qualified professionals who can complete your requests</p>
      </div>
    </div>
  )
}
