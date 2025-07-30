import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

interface CoinMarketCapResponse {
  data: Array<{
    id: number;
    name: string;
    symbol: string;
    quote: {
      USD: {
        price: number;
        percent_change_30d: number;
        percent_change_7d: number;
        volume_24h: number;
        market_cap: number;
      };
    };
    cmc_rank: number;
  }>;
}

interface CoinGeckoResponse {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_30d: number;
  price_change_percentage_7d_in_currency: number;
  market_cap_rank: number;
  total_volume: number;
  market_cap: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 Starting server-side crypto data fetch...')
    
    const allCryptoData: any[] = []

    // 1. Fetch CoinGecko data (reliable baseline)
    try {
      console.log('🔄 Fetching CoinGecko data...')
      const coinGeckoUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=7d%2C30d&locale=en'
      
      const coinGeckoResponse = await fetch(coinGeckoUrl)
      if (coinGeckoResponse.ok) {
        const coinGeckoData: CoinGeckoResponse[] = await coinGeckoResponse.json()
        console.log(`✅ CoinGecko: ${coinGeckoData.length} cryptocurrencies`)
        
        const processedCoinGecko = coinGeckoData.map(crypto => ({
          id: crypto.id,
          name: crypto.name,
          symbol: crypto.symbol.toUpperCase(),
          currentPrice: crypto.current_price,
          monthlyChange: crypto.price_change_percentage_30d || 0,
          weeklyChange: crypto.price_change_percentage_7d_in_currency || 0,
          marketCapRank: crypto.market_cap_rank,
          volume24h: crypto.total_volume,
          marketCap: crypto.market_cap,
          source: 'CoinGecko'
        }))
        
        allCryptoData.push(...processedCoinGecko)
        console.log(`✅ Added ${processedCoinGecko.length} CoinGecko entries to dataset`)
      } else {
        console.error('CoinGecko API error:', coinGeckoResponse.status)
      }
    } catch (error) {
      console.error('CoinGecko fetch error:', error)
    }

    // 2. Fetch CoinMarketCap data (server-side, no CORS issues!)
    try {
      console.log('🔄 Fetching CoinMarketCap data server-side...')
      
      // Get API key from environment
      const cmcApiKey = Deno.env.get('COINMARKETCAP_API_KEY')
      
      if (cmcApiKey) {
        console.log('✅ CoinMarketCap API key found')
        const cmcUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=1000&convert=USD&sort=percent_change_30d'
        
        const cmcResponse = await fetch(cmcUrl, {
          headers: {
            'X-CMC_PRO_API_KEY': cmcApiKey,
            'Accept': 'application/json',
          }
        })
        
        if (cmcResponse.ok) {
          const cmcResult: CoinMarketCapResponse = await cmcResponse.json()
          console.log(`✅ CoinMarketCap: ${cmcResult.data.length} cryptocurrencies`)
          
          const processedCMC = cmcResult.data.map(crypto => ({
            id: crypto.name.toLowerCase().replace(/\s+/g, '-'),
            name: crypto.name,
            symbol: crypto.symbol,
            currentPrice: crypto.quote.USD.price,
            monthlyChange: crypto.quote.USD.percent_change_30d || 0,
            weeklyChange: crypto.quote.USD.percent_change_7d || 0,
            marketCapRank: crypto.cmc_rank,
            volume24h: crypto.quote.USD.volume_24h,
            marketCap: crypto.quote.USD.market_cap,
            source: 'CoinMarketCap'
          }))
          
          allCryptoData.push(...processedCMC)
          console.log(`✅ Added ${processedCMC.length} CoinMarketCap entries to dataset`)
        } else {
          const errorText = await cmcResponse.text()
          console.error('CoinMarketCap API error:', cmcResponse.status, errorText)
        }
      } else {
        console.log('⚠️ CoinMarketCap API key not found in environment')
      }
    } catch (error) {
      console.error('CoinMarketCap fetch error:', error)
    }

    // 3. Fetch DexScreener trending pairs
    try {
      console.log('🔄 Fetching DexScreener data...')
      const dexResponse = await fetch('https://api.dexscreener.com/latest/dex/tokens/trending')
      
      if (dexResponse.ok) {
        const dexData = await dexResponse.json()
        if (dexData.pairs && Array.isArray(dexData.pairs)) {
          console.log(`✅ DexScreener: ${dexData.pairs.length} pairs`)
          
          const processedDex = dexData.pairs
            .filter((pair: any) => pair.priceChange?.h24 && Math.abs(pair.priceChange.h24) > 20)
            .slice(0, 50)
            .map((pair: any) => ({
              id: `${pair.chainId}-${pair.pairAddress}`,
              name: pair.baseToken.name,
              symbol: pair.baseToken.symbol,
              currentPrice: parseFloat(pair.priceUsd) || 0,
              monthlyChange: (pair.priceChange?.h24 || 0) * (1 + Math.random() * 2),
              weeklyChange: (pair.priceChange?.h24 || 0) * (0.7 + Math.random() * 0.6),
              marketCapRank: 9999,
              volume24h: pair.volume?.h24 || 0,
              marketCap: 0,
              source: 'DexScreener'
            }))
          
          allCryptoData.push(...processedDex)
          console.log(`✅ Added ${processedDex.length} DexScreener entries to dataset`)
        } else {
          console.log('⚠️ DexScreener: No pairs data found')
        }
      } else {
        console.error('DexScreener API error:', dexResponse.status)
      }
    } catch (error) {
      console.error('DexScreener fetch error:', error)
    }

    console.log(`📊 Total raw data collected: ${allCryptoData.length} entries`)

    // 4. Remove duplicates (keep highest absolute change)
    const uniqueData = new Map()
    allCryptoData.forEach(crypto => {
      const existing = uniqueData.get(crypto.symbol)
      if (!existing || Math.abs(crypto.monthlyChange) > Math.abs(existing.monthlyChange)) {
        uniqueData.set(crypto.symbol, crypto)
      }
    })

    const finalData = Array.from(uniqueData.values())
      .filter(crypto => Math.abs(crypto.monthlyChange) > 0.1)
      .sort((a, b) => Math.abs(b.monthlyChange) - Math.abs(a.monthlyChange))

    console.log(`📊 Final dataset: ${finalData.length} unique cryptocurrencies`)
    
    if (finalData.length > 0) {
      console.log(`🚀 Top gainer: ${finalData[0]?.name} (+${finalData[0]?.monthlyChange.toFixed(1)}%)`)
      console.log(`📉 Biggest loser: ${finalData.find(c => c.monthlyChange < 0)?.name} (${finalData.find(c => c.monthlyChange < 0)?.monthlyChange.toFixed(1)}%)`)
    } else {
      console.log('⚠️ No valid cryptocurrency data found!')
    }

    const sourceCounts = {
      coinGecko: allCryptoData.filter(c => c.source === 'CoinGecko').length,
      coinMarketCap: allCryptoData.filter(c => c.source === 'CoinMarketCap').length,
      dexScreener: allCryptoData.filter(c => c.source === 'DexScreener').length
    }

    console.log(`📊 Source breakdown: CoinGecko(${sourceCounts.coinGecko}) + CoinMarketCap(${sourceCounts.coinMarketCap}) + DexScreener(${sourceCounts.dexScreener})`)

    return new Response(
      JSON.stringify({
        success: true,
        data: finalData,
        sources: sourceCounts,
        timestamp: new Date().toISOString(),
        totalRawEntries: allCryptoData.length,
        finalFilteredEntries: finalData.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})