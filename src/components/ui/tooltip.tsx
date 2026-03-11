'use client'

import { useState, useRef, useCallback, type ReactNode } from 'react'

interface TooltipProps {
  children: ReactNode
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const positionStyles: Record<string, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'end-full top-1/2 -translate-y-1/2 me-2',
  right: 'start-full top-1/2 -translate-y-1/2 ms-2',
}

const arrowStyles: Record<string, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-[rgba(17,24,39,0.9)] border-x-transparent border-b-transparent',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[rgba(17,24,39,0.9)] border-x-transparent border-t-transparent',
  left: 'start-full top-1/2 -translate-y-1/2 border-s-[rgba(17,24,39,0.9)] border-y-transparent border-e-transparent',
  right: 'end-full top-1/2 -translate-y-1/2 border-e-[rgba(17,24,39,0.9)] border-y-transparent border-s-transparent',
}

export default function Tooltip({ children, content, position = 'top' }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showTooltip = useCallback(() => {
    timeoutRef.current = setTimeout(() => setVisible(true), 200)
  }, [])

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setVisible(false)
  }, [])

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      {visible && (
        <div
          className={`absolute z-50 pointer-events-none ${positionStyles[position]}`}
          role="tooltip"
        >
          <div
            className="relative px-3 py-1.5 rounded-lg text-xs font-medium text-gray-200 whitespace-nowrap animate-fade-in"
            style={{
              background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.92), rgba(12, 18, 34, 0.95))',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            {content}
            {/* Arrow */}
            <span
              className={`absolute w-0 h-0 border-[5px] ${arrowStyles[position]}`}
            />
          </div>
        </div>
      )}
    </div>
  )
}
