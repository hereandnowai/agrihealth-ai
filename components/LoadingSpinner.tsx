
import React from 'react';
import { BRAND_SECONDARY_COLOR } from '../constants';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div
        className={`animate-spin rounded-full border-4 border-t-transparent ${sizeClasses[size]}`}
        style={{ borderColor: BRAND_SECONDARY_COLOR, borderTopColor: 'transparent' }}
      ></div>
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
    