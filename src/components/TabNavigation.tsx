import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'gainers' | 'losers';
  onTabChange: (tab: 'gainers' | 'losers') => void;
  gainersCount: number;
  losersCount: number;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  gainersCount,
  losersCount,
}) => {
  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
      <button
        onClick={() => onTabChange('gainers')}
        className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
          activeTab === 'gainers'
            ? 'bg-white text-green-700 shadow-sm'
            : 'text-gray-600 hover:text-green-700 hover:bg-gray-50'
        }`}
      >
        <TrendingUp size={20} />
        <span>Top Gainers</span>
        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
          {gainersCount}
        </span>
      </button>
      <button
        onClick={() => onTabChange('losers')}
        className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
          activeTab === 'losers'
            ? 'bg-white text-red-700 shadow-sm'
            : 'text-gray-600 hover:text-red-700 hover:bg-gray-50'
        }`}
      >
        <TrendingDown size={20} />
        <span>Biggest Losers</span>
        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
          {losersCount}
        </span>
      </button>
    </div>
  );
};