import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  error: string;
  onRetry: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <div className="flex items-center justify-center mb-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="text-red-600" size={24} />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-red-800 mb-2">
        Unable to Load Data
      </h3>
      <p className="text-red-700 mb-4">
        {error}
      </p>
      <button
        onClick={onRetry}
        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 mx-auto"
      >
        <RefreshCw size={16} />
        <span>Try Again</span>
      </button>
      <p className="text-xs text-red-600 mt-3">
        If the problem persists, please check your internet connection or try again later.
      </p>
    </div>
  );
};