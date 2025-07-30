import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import type { CryptoData } from '../types/crypto';

interface PerformanceChartProps {
  cryptos: CryptoData[];
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ cryptos }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'gainers' | 'losers'>('gainers');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 50;
  
  console.log(`📊 PerformanceChart received ${cryptos.length} cryptocurrencies`);
  
  // Separate gainers and losers, get top 500 gains and top 100 losses
  const gainers = cryptos
    .filter(crypto => crypto.monthlyChange > 0)
    .sort((a, b) => b.monthlyChange - a.monthlyChange)
    .slice(0, 500);
    
  const losers = cryptos
    .filter(crypto => crypto.monthlyChange < 0)
    .sort((a, b) => a.monthlyChange - b.monthlyChange)
    .slice(0, 100);
  
  // Combine and sort by absolute change for "all" view
  const allCombined = [...gainers, ...losers]
    .sort((a, b) => Math.abs(b.monthlyChange) - Math.abs(a.monthlyChange));
  
  console.log(`📊 Chart data: ${gainers.length} gainers, ${losers.length} losers, ${allCombined.length} total`);
  
  const getDisplayData = () => {
    switch (activeFilter) {
      case 'gainers': return gainers;
      case 'losers': return losers;
      default: return allCombined.slice(0, 600); // Top 600 biggest movers (500 gains + 100 losses)
    }
  };
  
  const displayData = getDisplayData();
  const maxAbsChange = Math.max(...displayData.map(crypto => Math.abs(crypto.monthlyChange)));
  
  // Pagination
  const totalPages = Math.ceil(displayData.length / itemsPerPage);
  const currentData = displayData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleFilterChange = (filter: 'all' | 'gainers' | 'losers') => {
    setActiveFilter(filter);
    setCurrentPage(0); // Reset to first page when changing filters
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
      {/* Header with filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="text-green-600" size={24} />
            <TrendingDown className="text-red-600" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Top 500 Gains and 100 Losses in Crypto Last 30 days
            </h3>
            <p className="text-sm text-gray-600">
              30-day and 7-day performance with exchange listings
            </p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {gainers.length} Gains • {losers.length} Losses
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        <button
          onClick={() => handleFilterChange('gainers')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
            activeFilter === 'gainers'
              ? 'bg-white text-green-700 shadow-sm'
              : 'text-gray-600 hover:text-green-700 hover:bg-gray-50'
          }`}
        >
          <TrendingUp size={16} />
          <span>Top 500 Gains</span>
        </button>
        <button
          onClick={() => handleFilterChange('losers')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
            activeFilter === 'losers'
              ? 'bg-white text-red-700 shadow-sm'
              : 'text-gray-600 hover:text-red-700 hover:bg-gray-50'
          }`}
        >
          <TrendingDown size={16} />
          <span>Top 100 Losses</span>
        </button>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          Showing {currentPage * itemsPerPage + 1}-{Math.min((currentPage + 1) * itemsPerPage, displayData.length)} of {displayData.length} cryptocurrencies
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      
      {/* Chart */}
      <div className="space-y-2">
        {currentData.map((crypto, index) => {
          const globalRank = currentPage * itemsPerPage + index + 1;
          const barWidth = (Math.abs(crypto.monthlyChange) / maxAbsChange) * 100;
          const isPositive = crypto.monthlyChange > 0;
          const weeklyChange = crypto.weeklyChange || 0;
          
          return (
            <div key={crypto.id} className="flex items-center space-x-3 py-3 hover:bg-gray-50 rounded-lg px-2 border-b border-gray-100">
              {/* Rank */}
              <div className="w-12 text-center">
                <span className="text-sm font-bold text-gray-900">#{globalRank}</span>
              </div>
              
              {/* Crypto Info */}
              <div className="w-40 flex-shrink-0">
                <a 
                  href={`#${crypto.id}`}
                  className="block hover:bg-gray-100 rounded p-1 -m-1 transition-colors duration-200"
                >
                  <div className="font-bold text-blue-600 hover:text-blue-800 text-sm cursor-pointer">
                    {crypto.symbol}
                  </div>
                  <div className="text-xs text-gray-500 truncate hover:text-gray-700">
                    {crypto.name}
                  </div>
                </a>
              </div>
              
              {/* Performance Bar */}
              <div className="flex-1 flex items-center justify-between px-4">
                <div className="flex items-center space-x-4">
                  <span className={`text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    30d: {crypto.monthlyChange > 0 ? '+' : ''}{crypto.monthlyChange.toFixed(1)}%
                  </span>
                  <span className={`text-sm font-medium ${weeklyChange > 0 ? 'text-green-500' : weeklyChange < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                    7d: {weeklyChange > 0 ? '+' : ''}{weeklyChange.toFixed(1)}%
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  ${crypto.currentPrice < 0.01 
                    ? crypto.currentPrice.toFixed(6) 
                    : crypto.currentPrice.toLocaleString()}
                </span>
              </div>
              
              {/* Exchanges */}
              <div className="w-36 text-right">
                <div className="text-xs text-gray-600">
                  {crypto.exchanges?.slice(0, 2).join(', ')}
                  {crypto.exchanges && crypto.exchanges.length > 2 && (
                    <span className="text-gray-400"> +{crypto.exchanges.length - 2}</span>
                  )}
                </div>
              </div>
              
              {/* Mentions */}
              <div className="w-20 text-right">
                <div className="text-sm font-bold text-gray-900">{crypto.mentions}</div>
                <div className="text-xs text-gray-500">mentions</div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Bottom Pagination */}
      <div className="flex items-center justify-center mt-6 space-x-2">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
          <span>Previous 50</span>
        </button>
        <span className="text-sm text-gray-600 px-4">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages - 1}
          className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Next 50</span>
          <ChevronRight size={16} />
        </button>
      </div>
      
      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span>Gainers</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span>Losers</span>
            </div>
            <span>•</span>
            <span>30d/7d % Change</span>
            <span>•</span>
            <span>Exchange Listings</span>
            <span>•</span>
            <span>News Mentions</span>
          </div>
          <div>
            Showing 50 per page • Click crypto symbols to jump to details
          </div>
        </div>
      </div>
    </div>
  );
};