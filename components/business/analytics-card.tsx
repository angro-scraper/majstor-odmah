import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface AnalyticsCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  change: string
  trend: 'up' | 'down'
  subtitle?: string
}

export function AnalyticsCard({
  icon: Icon,
  label,
  value,
  change,
  trend,
  subtitle,
}: AnalyticsCardProps) {
  return (
    <div className="p-6 rounded-2xl border border-border bg-card hover:border-primary transition">
      <div className="flex items-start justify-between mb-4">
        <Icon className="w-5 h-5 text-muted-foreground" />
        <div className={`flex items-center gap-1 text-sm font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {change}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>}
    </div>
  )
}
