import React from 'react';
import { BarChart3 } from 'lucide-react';

export const Header: React.FC = () => {

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CryptoMonth</h1>
              <p className="text-sm text-gray-500">News-Driven Crypto Intelligence</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};