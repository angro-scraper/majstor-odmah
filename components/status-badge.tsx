import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, XCircle, Eye } from 'lucide-react'

export type StatusType = 'active' | 'pending' | 'completed' | 'cancelled' | 'quoted' | 'verified'

const statusConfig: Record<StatusType, { icon: React.ReactNode; variant: 'success' | 'warning' | 'destructive' | 'default'; label: string }> = {
  active: { icon: <CheckCircle className="w-3 h-3" />, variant: 'success', label: 'Active' },
  pending: { icon: <Clock className="w-3 h-3" />, variant: 'warning', label: 'Pending' },
  completed: { icon: <CheckCircle className="w-3 h-3" />, variant: 'success', label: 'Completed' },
  cancelled: { icon: <XCircle className="w-3 h-3" />, variant: 'destructive', label: 'Cancelled' },
  quoted: { icon: <Eye className="w-3 h-3" />, variant: 'default', label: 'Quoted' },
  verified: { icon: <CheckCircle className="w-3 h-3" />, variant: 'success', label: 'Verified' },
}

export function StatusBadge({ status }: { status: StatusType }) {
  const config = statusConfig[status]
  return (
    <Badge variant={config.variant} className="flex items-center gap-1.5">
      {config.icon}
      {config.label}
    </Badge>
  )
}
