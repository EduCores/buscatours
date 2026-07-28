import React from 'react';
import { LanguageContext } from '../../i18n/LanguageContext';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  tabName?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

interface ErrorBoundaryStateExt extends ErrorBoundaryState {
  componentStack?: string;
}

export default class TabErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryStateExt> {
  static contextType = LanguageContext;
  declare context: React.ContextType<typeof LanguageContext>;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null, componentStack: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[AdminTab] Error capturado en la pestaña:', this.props.tabName, error, info);
    this.componentStack = info.componentStack || '';
  }

  handleReset = () => {
    this.setState({ error: null, componentStack: '' });
    this.props.onReset?.();
  };

  render() {
    if (this.state.error) {
      return (
        <div className="glass-card p-8 rounded-2xl border border-rose-500/20 bg-rose-500/5 text-center space-y-4">
          <div className="inline-flex p-3 bg-rose-500/15 text-rose-400 rounded-2xl">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-black text-base text-white">{this.context.t('errorBoundary.title', 'Esta sección falló al cargar')}</h3>
            <p className="text-[11px] text-slate-400 font-mono leading-relaxed break-words">
              {this.state.error.message || this.context.t('errorBoundary.unexpected', 'Error inesperado')}
            </p>
            {this.state.componentStack ? (
              <pre className="text-left text-[10px] text-rose-300/70 font-mono whitespace-pre-wrap break-words max-h-40 overflow-auto mt-2 p-2 bg-black/30 rounded">
                {this.state.componentStack}
              </pre>
            ) : null}
          </div>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded text-xs transition-all"
          >
            {this.context.t('errorBoundary.retry', 'Reintentar')}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
