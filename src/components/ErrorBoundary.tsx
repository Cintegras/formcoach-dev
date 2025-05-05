import React, {Component, ErrorInfo, ReactNode} from 'react';
import {AlertTriangle} from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return {hasError: true, error};
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('Error caught by ErrorBoundary:', error, errorInfo);

        // Call the optional onError callback
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    public render(): ReactNode {
        if (this.state.hasError) {
            // If a custom fallback is provided, use it
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Otherwise, use the default error UI
            return (
                <div className="p-6 bg-red-500 bg-opacity-10 rounded-lg text-center">
                    <AlertTriangle size={48} className="mx-auto mb-4 text-red-500"/>
                    <h2 className="text-xl font-semibold text-red-500 mb-2">Something went wrong</h2>
                    <p className="text-red-400 mb-4">
                        {this.state.error?.message || 'An unexpected error occurred'}
                    </p>
                    <button
                        onClick={() => this.setState({hasError: false, error: null})}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Try again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;