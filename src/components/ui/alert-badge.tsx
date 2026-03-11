import { AlertSeverity } from '@/types'

const severityStyles: Record<AlertSeverity, string> = {
  critical: 'bg-red-500/10 text-red-400 border-red-500/15',
  high: 'bg-amber-500/10 text-amber-400 border-amber-500/15',
  medium: 'bg-blue-500/10 text-blue-400 border-blue-500/15',
  low: 'bg-white/[0.03] text-gray-400 border-white/[0.06]',
}

const severityLabels: Record<AlertSeverity, string> = {
  critical: 'حرج',
  high: 'عالي',
  medium: 'متوسط',
  low: 'منخفض',
}

export default function AlertBadge({ severity }: { severity: AlertSeverity }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-medium border ${severityStyles[severity]}`}>
      {severityLabels[severity]}
    </span>
  )
}
