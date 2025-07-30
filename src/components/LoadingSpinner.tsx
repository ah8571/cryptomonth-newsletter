import React from 'react';
import { BarChart3 } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
          <BarChart3 className="text-white animate-pulse" size={32} />
        </div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-lg animate-spin"></div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Real-Time Data</h3>
      <p className="text-gray-600 text-center max-w-md">
        Fetching the latest cryptocurrency news, prices, and sentiment analysis from multiple sources...
      </p>
      <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};