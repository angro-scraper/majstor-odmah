import { Phone, MessageSquare, Star, CheckCircle } from 'lucide-react'

const activities = [
  { id: 1, type: 'call', text: 'Poziv od Jovana', time: 'Pre 2 sata', icon: Phone },
  { id: 2, type: 'message', text: 'Nova poruka od Sare', time: 'Pre 1 dana', icon: MessageSquare },
  { id: 3, type: 'review', text: 'Primljena recenzija sa 5 zvezdica', time: 'Pre 2 dana', icon: Star },
  { id: 4, type: 'conversion', text: 'Upit je pretvoren u rezervaciju', time: 'Pre 3 dana', icon: CheckCircle },
]

export function RecentActivity() {
  return (
    <div className="p-6 rounded-2xl border border-border bg-card">
      <h2 className="text-lg font-semibold mb-4">Nedavna aktivnost</h2>
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
