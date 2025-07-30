import React, { useState, useEffect } from 'react';
import { ExternalLink, Calendar } from 'lucide-react';
import { advertiserService } from '../services/advertiserService';
import type { AdvertiserSubmission } from '../types/advertiser';

interface AdvertiserDisplayProps {
  showInNewsletter?: boolean;
}

export const AdvertiserDisplay: React.FC<AdvertiserDisplayProps> = ({ showInNewsletter = false }) => {
  const [currentAdvertiser, setCurrentAdvertiser] = useState<AdvertiserSubmission | null>(null);

  useEffect(() => {
    // Cleanup expired ads first
    advertiserService.cleanupExpiredAds();
    
    // Get current advertiser
    const advertiser = advertiserService.getCurrentAdvertiser();
    setCurrentAdvertiser(advertiser);
  }, []);

  if (!currentAdvertiser) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
        <div className="text-sm text-gray-500 mb-2">Advertisement</div>
        <div className="space-y-3">
          <div className="text-gray-600">
            If you would like to sponsor this newsletter, visit our{' '}
            <button 
              onClick={() => window.location.href = '/advertise'}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              advertiser portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatWeekRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className={`border rounded-xl p-6 ${showInNewsletter ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
      <div className="text-sm text-gray-500 mb-3 flex items-center justify-between">
        <span>Sponsored Content</span>
        <div className="flex items-center space-x-1 text-xs">
          <Calendar size={12} />
          <span>{formatWeekRange(currentAdvertiser.weekStartDate, currentAdvertiser.weekEndDate)}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">{currentAdvertiser.companyName}</h3>
          {!showInNewsletter && (
            <ExternalLink className="text-gray-400" size={16} />
          )}
        </div>
        
        <p className="text-gray-700 leading-relaxed">
          {currentAdvertiser.pitch}
        </p>
        
        <p className="text-gray-700 mt-2">
          <a 
            href={currentAdvertiser.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            Learn more about {currentAdvertiser.companyName}
          </a>
        </p>
        
        {showInNewsletter && (
          <div className="text-xs text-gray-500 pt-2 border-t border-gray-300">
            This is a paid advertisement. Visit CryptoMonth.info to learn more about advertising opportunities.
          </div>
        )}
      </div>
    </div>
  );
};