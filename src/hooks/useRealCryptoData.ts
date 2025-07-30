import { useState, useEffect } from 'react';
import { fetchRealCryptoData } from '../services/newsApi';
import type { CryptoData } from '../types/crypto';

export const useRealCryptoData = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Hook: Starting to fetch cryptocurrency data...');
      
      const data = await fetchRealCryptoData();
      console.log(`✅ Hook: Received ${data.length} cryptocurrencies from API`);
      
      if (data.length > 0) {
        console.log(`🚀 Hook: REAL DATA LOADED - Top 5 gainers:`);
        const topGainers = data.filter(c => c.monthlyChange > 0).slice(0, 5);
        topGainers.forEach((crypto, i) => {
          console.log(`   ${i + 1}. ${crypto.name} (${crypto.symbol}): +${crypto.monthlyChange.toFixed(1)}%`);
        });
        
        setCryptoData(data);
        setLastUpdated(new Date());
        console.log(`✅ Hook: State updated with ${data.length} cryptocurrencies`);
      } else {
        console.log('⚠️ Hook: No data received from API');
        setCryptoData([]);
      }
    } catch (err) {
      console.error('❌ Hook: Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch cryptocurrency data');
      setCryptoData([]); // Clear any existing data on error
    } finally {
      setLoading(false);
      console.log('🔄 Hook: Loading state set to false');
    }
  };

  useEffect(() => {
    console.log('🔄 Hook: useEffect triggered - starting initial data fetch...');
    fetchData();
    
    // Refresh data every 2 hours (perfect for newsletter use)
    const interval = setInterval(fetchData, 2 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Debug logging for state changes
  useEffect(() => {
    console.log(`🔍 Hook: State changed - cryptoData: ${cryptoData.length}, loading: ${loading}, error: ${error}`);
  }, [cryptoData, loading, error]);
  return {
    cryptoData,
    loading,
    error,
    lastUpdated,
    refetch: fetchData
  };
}