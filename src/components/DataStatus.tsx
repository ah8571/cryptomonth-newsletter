import React from 'react';
import { Clock, RefreshCw } from 'lucide-react';

interface DataStatusProps {
  lastUpdated: Date | null;
  onRefresh: () => void;
  isLoading: boolean;
}

export const DataStatus: React.FC<DataStatusProps> = ({ lastUpdated, onRefresh, isLoading }) => {
  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock size={16} />
            <span>
              {lastUpdated ? (
                <>Last updated: {formatLastUpdated(lastUpdated)}</>
              ) : (
                'Loading data...'
              )}
            </span>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-600 font-medium">LIVE DATA</span>
        </div>
        
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 font-medium"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          <span>{isLoading ? 'Fetching with CoinMarketCap...' : 'Refresh Data Now'}</span>
        </button>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        Data sources: CoinGecko (250+ established coins) • DexScreener (trending DEX pairs) • CoinMarketCap (CORS blocked in browser - normal behavior)
      </div>
    </div>
  );
};