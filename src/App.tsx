import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { PerformanceChart } from './components/PerformanceChart';
import { CryptoCard } from './components/CryptoCard';
import { NewsletterSignup } from './components/NewsletterSignup';
import { NewsletterPreview } from './components/NewsletterPreview';
import { AdvertiserLanding } from './components/AdvertiserLanding';
import { AdvertiserDisplay } from './components/AdvertiserDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { DataStatus } from './components/DataStatus';
import { InlineNewsletterForm } from './components/InlineNewsletterForm';
import { useRealCryptoData } from './hooks/useRealCryptoData';
import { mockCryptoData } from './data/mockData';

function App() {
  const { cryptoData, loading, error, lastUpdated, refetch } = useRealCryptoData();
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [showAdvertiserLanding, setShowAdvertiserLanding] = useState(false);
  
  console.log(`📊 App received ${cryptoData.length} cryptocurrencies from hook (loading: ${loading}, error: ${error})`);

  // Use real data if available, fallback to mock data only if no real data and not loading
  const dataToUse = cryptoData.length > 0 ? cryptoData : mockCryptoData;
  console.log(`📊 App using ${dataToUse.length} cryptocurrencies (${cryptoData.length > 0 ? 'REAL' : 'MOCK'} data)`);
  console.log(`📊 Data source decision: cryptoData.length=${cryptoData.length}, loading=${loading}, using=${cryptoData.length > 0 ? 'REAL' : 'MOCK'}`);
  
  const allCryptosSorted = useMemo(() => {
    if (dataToUse.length === 0) {
      console.log('📊 No data to sort, returning empty array');
      return [];
    }
    // Sort by absolute change to show biggest movers first
    const sorted = [...dataToUse].sort((a, b) => Math.abs(b.monthlyChange) - Math.abs(a.monthlyChange));
    console.log(`📊 App sorted data: Top performer is ${sorted[0]?.name} with ${sorted[0]?.monthlyChange.toFixed(1)}% change (${cryptoData.length > 0 ? 'REAL' : 'MOCK'} data)`);
    return sorted;
  }, [dataToUse]);

  // Check if we should show advertiser landing page
  if (showAdvertiserLanding) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdvertiserLanding onBack={() => setShowAdvertiserLanding(false)} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How CryptoMonth Works
          </h2>
          <div className="space-y-3 mb-6 text-left max-w-2xl mx-auto">
            <p className="text-gray-700">
              <span className="font-semibold">1. Weekly Newsletter:</span> We send a newsletter weekly summarizing information about the top gains and losses in the cryptocurrency markets.
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">2. Real-Time Analysis:</span> Advanced algorithms analyze news content and market data to determine sentiment and identify the biggest movers in real-time.
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">3. Investment Insights:</span> Combine live price data with news sentiment analysis to identify top gainers and biggest losers for optimal trading insights.
            </p>
          </div>
          <div className="text-center">
            <button
              onClick={() => setShowInlineForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Subscribe to Newsletter
            </button>
          </div>
        </div>

        {/* Inline Newsletter Form */}
        <InlineNewsletterForm 
          isVisible={showInlineForm}
          onClose={() => setShowInlineForm(false)}
        />

        {/* Text-Based Ads Section */}
        <div className="mb-8">
          <AdvertiserDisplay />
        </div>

        {/* Data Status */}
        {!loading && !error && (
          <DataStatus 
            lastUpdated={lastUpdated}
            onRefresh={refetch}
            isLoading={loading}
          />
        )}

        {/* Loading State */}
        {loading && cryptoData.length === 0 && <LoadingSpinner />}

        {/* Error State */}
        {error && !loading && cryptoData.length === 0 && (
          <ErrorMessage error={error} onRetry={refetch} />
        )}

        {/* Main Content */}
        {(!loading || cryptoData.length > 0) && !error && (
          <>
            {/* Performance Chart */}
            <PerformanceChart
              cryptos={allCryptosSorted}
            />

            {/* Content Grid */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Detailed Analysis with News Mentions & Exchange Listings
              </h2>
              <p className="text-gray-600 mb-6">
                Each cryptocurrency includes recent news mentions, sentiment analysis, current exchange listings, and detailed performance metrics. 
                Click any cryptocurrency symbol in the chart above to jump directly to its detailed analysis below.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {allCryptosSorted.slice(0, 500).map((crypto, index) => (
                  <CryptoCard
                    key={crypto.id}
                    crypto={crypto}
                    rank={index + 1}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Footer Info */}
        <div className="mt-16 text-center">
          {/* Newsletter Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <NewsletterSignup />
            <NewsletterPreview cryptos={allCryptosSorted} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
