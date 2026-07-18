import { Sparkles, TrendingUp, Star, AlertCircle, CheckCircle } from 'lucide-react'

export default function AICoachPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-primary" />
          AI Business Coach
        </h1>
        <p className="text-muted-foreground mt-1">AI-powered insights to grow your business</p>
      </div>

      {/* Featured Insights */}
      <div className="space-y-4">
        {[
          {
            icon: TrendingUp,
            title: 'Increase Your Prices',
            description: 'Based on your 4.8 rating and 98% quality score, you can safely increase prices by 10-15%',
            action: 'Learn More',
            color: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
          },
          {
            icon: Star,
            title: 'Profile Optimization',
            description: 'Add 3 more service categories to attract 25% more leads',
            action: 'Optimize',
            color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
          },
          {
            icon: AlertCircle,
            title: 'Response Time Alert',
            description: 'Your average response time is 2.1 hours. Improve to 1 hour to get 40% more conversions',
            action: 'Set Reminder',
            color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
          },
        ].map((insight, i) => {
          const Icon = insight.icon
          return (
            <div key={i} className={`p-6 rounded-2xl bg-gradient-to-br ${insight.color} border`}>
              <div className="flex items-start gap-4">
                <Icon className="w-6 h-6 mt-1 text-primary flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{insight.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                  <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition">
                    {insight.action}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recommendations */}
      <div className="p-6 rounded-2xl border border-border bg-card">
        <h2 className="text-lg font-semibold mb-4">Recommendations</h2>
        <div className="space-y-3">
          {[
            { tip: 'Add video gallery to your profile - this increases bookings by 35%', status: 'pending' },
            { tip: 'Set up appointment slots - reduces response overhead by 60%', status: 'pending' },
            { tip: 'Enable online booking - 45% of customers prefer this', status: 'active' },
            { tip: 'Collect more reviews - you need 10 more for premium badge', status: 'pending' },
          ].map((rec, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              {rec.status === 'active' ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              )}
              <p className="text-sm">{rec.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
