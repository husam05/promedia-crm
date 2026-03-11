import { AlertSeverity } from '@/types'

const severityStyles: Record<AlertSeverity, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  medium: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  low: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

const severityLabels: Record<AlertSeverity, string> = {
  critical: 'حرج',
  high: 'عالي',
  medium: 'متوسط',
  low: 'منخفض',
}

export default function AlertBadge({ severity }: { severity: AlertSeverity }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${severityStyles[severity]}`}>
      {severityLabels[severity]}
    </span>
  )
}
