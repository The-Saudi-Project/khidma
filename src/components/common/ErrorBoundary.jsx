import React from 'react'

function ErrorFallback({ error, onReset }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center mb-4">
        <span className="text-white font-bold text-xl">K</span>
      </div>
      <h1 className="text-lg font-bold text-white mb-1">Something went wrong</h1>
      <p className="text-slate-400 text-sm mb-1">حدث خطأ ما</p>
      {error?.message && (
        <p className="text-xs text-slate-400 mb-4 max-w-md break-words">{error.message}</p>
      )}
      <button type="button" onClick={onReset} className="btn-primary">
        Try again · إعادة المحاولة
      </button>
    </div>
  )
}

export default class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('Boundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          onReset={() => this.setState({ hasError: false, error: null })}
        />
      )
    }
    return this.props.children
  }
}
