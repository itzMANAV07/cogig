import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">
          <div className="max-w-md w-full rounded-2xl border border-red-500/40 bg-slate-800 p-6 text-center space-y-4 shadow-xl">
            <div className="size-12 mx-auto rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xl">
              !
            </div>
            <h3 className="text-lg font-extrabold text-white">Something went wrong</h3>
            <p className="text-xs text-slate-400">
              {this.state.error?.message || 'An unexpected error occurred while loading this view.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2 rounded-xl bg-indigo text-white text-xs font-bold hover:bg-indigo-dark transition-all"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
