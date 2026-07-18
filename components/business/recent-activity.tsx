import { Phone, MessageSquare, Star, CheckCircle } from 'lucide-react'

const activities = [
  { id: 1, type: 'call', text: 'Phone call from John', time: '2 hours ago', icon: Phone },
  { id: 2, type: 'message', text: 'New message from Sarah', time: '1 day ago', icon: MessageSquare },
  { id: 3, type: 'review', text: '5-star review received', time: '2 days ago', icon: Star },
  { id: 4, type: 'conversion', text: 'Lead converted to booking', time: '3 days ago', icon: CheckCircle },
]

export function RecentActivity() {
  return (
    <div className="p-6 rounded-2xl border border-border bg-card">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
              <div className="p-2.5 rounded-lg bg-secondary/50">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.text}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
