'use client'

type SkeletonVariant = 'card' | 'stat' | 'table-row' | 'chart' | 'text' | 'avatar' | 'button'

interface SkeletonProps {
  variant: SkeletonVariant
  className?: string
  count?: number
}

function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div
      className={`bg-white/[0.03] rounded-xl relative overflow-hidden ${className || ''}`}
    >
      <div className="absolute inset-0 animate-shimmer rounded-xl" />
    </div>
  )
}

function SkeletonStatInner({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 ${className || ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          {/* Title line */}
          <ShimmerBlock className="h-3 w-24 rounded-md" />
          {/* Value line */}
          <ShimmerBlock className="h-7 w-32 rounded-lg" />
          {/* Subtitle line */}
          <ShimmerBlock className="h-2.5 w-20 rounded-md" />
        </div>
        {/* Icon placeholder top-right */}
        <ShimmerBlock className="w-10 h-10 rounded-xl flex-shrink-0" />
      </div>
      {/* Trend line */}
      <div className="mt-3">
        <ShimmerBlock className="h-3 w-28 rounded-md" />
      </div>
    </div>
  )
}

function SkeletonCardInner({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm ${className || ''}`}
    >
      {/* Header line */}
      <ShimmerBlock className="h-5 w-40 rounded-lg mb-4" />
      {/* Content lines */}
      <div className="space-y-3">
        <ShimmerBlock className="h-3 w-full rounded-md" />
        <ShimmerBlock className="h-3 w-4/5 rounded-md" />
        <ShimmerBlock className="h-3 w-3/5 rounded-md" />
      </div>
    </div>
  )
}

function SkeletonTableRow({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-4 py-3 px-3 border-b border-white/[0.03] ${className || ''}`}
    >
      <ShimmerBlock className="h-3.5 w-24 rounded-md" />
      <ShimmerBlock className="h-3.5 w-20 rounded-md" />
      <ShimmerBlock className="h-3.5 w-28 rounded-md" />
      <ShimmerBlock className="h-3.5 w-16 rounded-md" />
      <ShimmerBlock className="h-3.5 w-14 rounded-md" />
    </div>
  )
}

function SkeletonChartInner({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 ${className || ''}`}
    >
      {/* Chart header */}
      <ShimmerBlock className="h-5 w-36 rounded-lg mb-6" />
      {/* Chart area with wave-like top edge */}
      <div className="relative h-52 flex items-end gap-1">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id="skeleton-wave-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.04" />
              <stop offset="100%" stopColor="white" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          <path
            d="M0,120 C40,80 80,140 120,100 C160,60 200,130 240,90 C280,50 320,110 360,80 C380,70 400,90 400,90 L400,200 L0,200 Z"
            fill="url(#skeleton-wave-grad)"
          />
          <path
            d="M0,120 C40,80 80,140 120,100 C160,60 200,130 240,90 C280,50 320,110 360,80 C380,70 400,90 400,90"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
        {/* Bar placeholders */}
        {[40, 65, 50, 80, 55, 70, 45, 75, 60, 85, 50, 68].map((h, i) => (
          <div key={i} className="flex-1 flex items-end" style={{ height: '100%' }}>
            <div
              className="w-full bg-white/[0.03] rounded-t-md relative overflow-hidden"
              style={{ height: `${h}%` }}
            >
              <div className="absolute inset-0 animate-shimmer rounded-t-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SkeletonText({ className }: { className?: string }) {
  return (
    <div className={`space-y-2 ${className || ''}`}>
      <ShimmerBlock className="h-3 w-full rounded-md" />
      <ShimmerBlock className="h-3 w-3/4 rounded-md" />
    </div>
  )
}

function SkeletonAvatar({ className }: { className?: string }) {
  return <ShimmerBlock className={`w-10 h-10 rounded-full ${className || ''}`} />
}

function SkeletonButton({ className }: { className?: string }) {
  return <ShimmerBlock className={`h-9 w-28 rounded-xl ${className || ''}`} />
}

const variantMap: Record<SkeletonVariant, React.FC<{ className?: string }>> = {
  stat: SkeletonStatInner,
  card: SkeletonCardInner,
  'table-row': SkeletonTableRow,
  chart: SkeletonChartInner,
  text: SkeletonText,
  avatar: SkeletonAvatar,
  button: SkeletonButton,
}

export default function Skeleton({ variant, className, count = 1 }: SkeletonProps) {
  const Component = variantMap[variant]
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <Component key={i} className={className} />
      ))}
    </>
  )
}

// Named helper exports
export function SkeletonStat({ className, count = 1 }: { className?: string; count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonStatInner key={i} className={className} />
      ))}
    </>
  )
}

export function SkeletonCard({ className, count = 1 }: { className?: string; count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCardInner key={i} className={className} />
      ))}
    </>
  )
}

export function SkeletonTable({ className, count = 5 }: { className?: string; count?: number }) {
  return (
    <div className={`bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden ${className || ''}`}>
      {/* Table header */}
      <div className="flex items-center gap-4 py-3 px-3 border-b border-white/[0.06]">
        <ShimmerBlock className="h-3 w-20 rounded-md" />
        <ShimmerBlock className="h-3 w-16 rounded-md" />
        <ShimmerBlock className="h-3 w-24 rounded-md" />
        <ShimmerBlock className="h-3 w-14 rounded-md" />
        <ShimmerBlock className="h-3 w-12 rounded-md" />
      </div>
      {/* Table rows */}
      {Array.from({ length: count }, (_, i) => (
        <SkeletonTableRow key={i} />
      ))}
    </div>
  )
}

export function SkeletonChart({ className }: { className?: string }) {
  return <SkeletonChartInner className={className} />
}
