import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  // @ts-ignore
  state: State;
  // @ts-ignore
  props: Props;
  // @ts-ignore
  setState: (state: Partial<State> | ((prevState: State) => Partial<State>)) => void;

  constructor(props: Props) {
    super(props);
    this.props = props;
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      showDetails: false,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
    window.location.hash = '#/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
          <div
            role="alert"
            aria-live="assertive"
            className="max-w-xl w-full bg-slate-800/90 border border-red-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Application Error</h1>
                <p className="text-sm text-slate-400">An unexpected runtime exception occurred.</p>
              </div>
            </div>

            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              CinemaPulse encountered an unexpected error. You can recover by resetting the application.
            </p>

            <div className="flex flex-wrap gap-3 mb-6">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors focus:ring-2 focus:ring-indigo-400 focus:outline-none min-h-[44px] min-w-[44px]"
              >
                <RefreshCw className="w-4 h-4" />
                Recover & Reset App
              </button>

              <a
                href="#/"
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium text-sm transition-colors focus:ring-2 focus:ring-slate-400 focus:outline-none min-h-[44px] min-w-[44px]"
              >
                <Home className="w-4 h-4" />
                Return to Home
              </a>
            </div>

            {this.state.error && (
              <div className="border-t border-slate-700/60 pt-4">
                <button
                  type="button"
                  onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors focus:outline-none focus:underline min-h-[44px]"
                  aria-expanded={this.state.showDetails}
                >
                  {this.state.showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  {this.state.showDetails ? 'Hide Diagnostics' : 'View Diagnostics'}
                </button>

                {this.state.showDetails && (
                  <div className="mt-3 p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs font-mono text-red-300 overflow-x-auto max-h-48">
                    <p className="font-semibold text-red-200 mb-1">{this.state.error.toString()}</p>
                    {this.state.errorInfo?.componentStack && (
                      <pre className="text-slate-400 text-[11px] whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
