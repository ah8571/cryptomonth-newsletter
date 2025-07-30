import React from 'react';
import { TrendingUp, TrendingDown, ExternalLink, Calendar, BarChart3 } from 'lucide-react';
import type { CryptoData } from '../types/crypto';

interface CryptoCardProps {
  crypto: CryptoData;
  rank: number;
}

export const CryptoCard: React.FC<CryptoCardProps> = ({ crypto, rank }) => {
  const isPositive = crypto.monthlyChange > 0;
  
  return (
    <div 
      id={crypto.id}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 overflow-hidden scroll-mt-24"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              #{rank}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{crypto.name}</h3>
              <p className="text-sm text-gray-500 uppercase tracking-wide">{crypto.symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`flex items-center space-x-1 mb-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              <span className="text-xl font-bold">
                {isPositive ? '+' : ''}{crypto.monthlyChange.toFixed(2)}%
              </span>
            </div>
            {crypto.weeklyChange !== undefined && (
              <div className={`text-sm ${crypto.weeklyChange > 0 ? 'text-green-500' : crypto.weeklyChange < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                7d: {crypto.weeklyChange > 0 ? '+' : ''}{crypto.weeklyChange.toFixed(1)}%
              </div>
            )}
            <p className="text-sm text-gray-500">${crypto.currentPrice.toLocaleString()}</p>
          </div>
        </div>

        {/* Mentions Stats */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-gray-700">News Mentions (30 days)</span>
            </div>
            <span className="text-lg font-bold text-blue-600">{crypto.mentions}</span>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Sentiment: <span className={`font-medium ${crypto.sentiment > 0 ? 'text-green-600' : crypto.sentiment < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {crypto.sentiment > 0 ? 'Positive' : crypto.sentiment < 0 ? 'Negative' : 'Neutral'} ({crypto.sentiment > 0 ? '+' : ''}{crypto.sentiment.toFixed(1)})
            </span>
          </div>
        </div>

        {/* Quote Cloud */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent News Highlights</h4>
          <div className="space-y-3">
            {crypto.quotes.map((quote, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-200">
                <p className="text-sm text-gray-700 leading-relaxed mb-2">"{quote.text}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Calendar size={12} />
                    <span>{quote.date}</span>
                    <span>•</span>
                    <span className="font-medium">{quote.source}</span>
                  </div>
                  <a 
                    href={quote.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    <ExternalLink size={12} />
                    <span className="text-xs">Read</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investment Signal */}
        <div className={`p-3 rounded-lg ${isPositive ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Investment Signal</span>
            <span className={`text-sm font-bold ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
              {isPositive ? 'BULLISH' : 'BEARISH'}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Based on {crypto.mentions} mentions (30 days) and {crypto.sentiment > 0 ? 'positive' : crypto.sentiment < 0 ? 'negative' : 'neutral'} sentiment
          </p>
        </div>

        {/* Exchange Information */}
        {crypto.exchanges && crypto.exchanges.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">Available On</span>
              <ExternalLink size={14} className="text-blue-600" />
            </div>
            <div className="flex flex-wrap gap-1">
              {crypto.exchanges.map((exchange, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                >
                  {exchange}
                </span>
              ))}
            </div>
            <p className="text-xs text-blue-700 mt-2">
              Always verify listings and do your own research before trading
            </p>
          </div>
        )}
      </div>
    </div>
  );
};