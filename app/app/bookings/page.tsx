import { Calendar, Clock } from 'lucide-react'

export const metadata = {
  title: 'Bookings — balkan.works',
}

export default function BookingsPage() {
  const bookings = [
    { id: 1, service: 'Electrical Repair', business: 'Elite Electricians', date: 'Jan 20, 2024', time: '10:00 AM', status: 'confirmed', price: '$120' },
    { id: 2, service: 'Plumbing', business: 'Quick Plumbing Co', date: 'Jan 22, 2024', time: '2:00 PM', status: 'pending', price: '$85' },
    { id: 3, service: 'Painting', business: 'Pro Painting Services', date: 'Jan 25, 2024', time: '9:00 AM', status: 'confirmed', price: '$450' },
  ]

  return (
    <div className="px-4 py-6 space-y-6 pb-24">
      <div>
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground mt-1">Manage your upcoming appointments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Confirmed', value: '2', color: 'bg-green-500/20 text-green-600' },
          { label: 'Pending', value: '1', color: 'bg-amber-500/20 text-amber-600' },
          { label: 'Completed', value: '12', color: 'bg-blue-500/20 text-blue-600' },
        ].map((stat) => (
          <div key={stat.label} className={`p-3 rounded-xl border border-border ${stat.color}`}>
            <p className="text-xs font-medium opacity-75">{stat.label}</p>
            <p className="text-xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {bookings.map((booking) => (
          <div key={booking.id} className="p-4 rounded-2xl border border-border bg-card hover:border-primary transition">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{booking.service}</h3>
                <p className="text-sm text-muted-foreground">{booking.business}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded ${
                booking.status === 'confirmed' ? 'bg-green-500/20 text-green-600' : 'bg-amber-500/20 text-amber-600'
              }`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {booking.date}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                {booking.time}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-sm font-semibold text-primary">{booking.price}</span>
              <button className="text-xs px-3 py-1.5 rounded bg-secondary hover:bg-secondary/80 transition">
                {booking.status === 'confirmed' ? 'Reschedule' : 'Confirm'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State Message */}
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-sm">This feature is coming soon with real-time booking and calendar integration</p>
      </div>
    </div>
  )
}
