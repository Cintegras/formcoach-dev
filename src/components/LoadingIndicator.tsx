import React from 'react';
import {Loader2} from 'lucide-react';

interface LoadingIndicatorProps {
    size?: 'small' | 'medium' | 'large';
    text?: string;
    fullScreen?: boolean;
    className?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
                                                               size = 'medium',
                                                               text = 'Loading...',
                                                               fullScreen = false,
                                                               className = '',
                                                           }) => {
    // Determine icon size based on the size prop
    const iconSize = {
        small: 16,
        medium: 24,
        large: 36,
    }[size];

    // Determine text size based on the size prop
    const textSize = {
        small: 'text-xs',
        medium: 'text-sm',
        large: 'text-base',
    }[size];

    // Base component
    const indicator = (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <Loader2
                size={iconSize}
                className="text-[#00C4B4] animate-spin"
            />
            {text && (
                <p className={`mt-2 text-[#A4B1B7] ${textSize}`}>
                    {text}
                </p>
            )}
        </div>
    );

    // If fullScreen is true, center the indicator in the viewport
    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-[#020D0C] bg-opacity-80 z-50">
                {indicator}
            </div>
        );
    }

    return indicator;
};

// Convenience components for different sizes
LoadingIndicator.Small = (props: Omit<LoadingIndicatorProps, 'size'>) => (
    <LoadingIndicator size="small" {...props} />
);

LoadingIndicator.Medium = (props: Omit<LoadingIndicatorProps, 'size'>) => (
    <LoadingIndicator size="medium" {...props} />
);

LoadingIndicator.Large = (props: Omit<LoadingIndicatorProps, 'size'>) => (
    <LoadingIndicator size="large" {...props} />
);

// Convenience component for full screen loading
LoadingIndicator.FullScreen = (props: Omit<LoadingIndicatorProps, 'fullScreen'>) => (
    <LoadingIndicator fullScreen {...props} />
);

export default LoadingIndicator;