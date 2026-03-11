'use client'

import React from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

interface Props {
  children: React.ReactNode
  fallbackTitle?: string
}

interface State {
  hasError: boolean
}

export default class SectionErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Section error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-card p-5 flex flex-col items-center justify-center gap-3 min-h-[120px]">
          <AlertTriangle size={20} className="text-amber-400" />
          <p className="text-sm text-gray-400">{this.props.fallbackTitle || 'حدث خطأ في تحميل هذا القسم'}</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <RotateCcw size={12} />
            إعادة المحاولة
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
