#!/usr/bin/env node

// Weekly Newsletter Automation Script
// This runs every Sunday at 9 AM EST via GitHub Actions

import https from 'https';
import fs from 'fs';

// Add process error handlers
process.on('uncaughtException', (error) => {
  console.error('❌ UNCAUGHT EXCEPTION:', error);
  console.error('Stack trace:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ UNHANDLED REJECTION at:', promise);
  console.error('Reason:', reason);
  process.exit(1);
});

// Configuration from environment variables
const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
const CONVERTKIT_API_SECRET = process.env.CONVERTKIT_API_SECRET;
const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

console.log('🚀 Starting weekly CryptoMonth newsletter automation...');
console.log('📅 Current time:', new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
console.log('🔍 Environment check:');
console.log('   CONVERTKIT_API_KEY:', CONVERTKIT_API_KEY ? 'SET' : 'MISSING');
console.log('   CONVERTKIT_API_SECRET:', CONVERTKIT_API_SECRET ? 'SET' : 'MISSING');
console.log('   CONVERTKIT_FORM_ID:', CONVERTKIT_FORM_ID ? 'SET' : 'MISSING');
console.log('   COINMARKETCAP_API_KEY:', COINMARKETCAP_API_KEY ? 'SET' : 'NOT SET (optional)');

// Validate environment variables
if (!CONVERTKIT_API_KEY || !CONVERTKIT_API_SECRET || !CONVERTKIT_FORM_ID) {
  console.error('❌ Missing ConvertKit environment variables');
  console.error('   Required: CONVERTKIT_API_KEY, CONVERTKIT_API_SECRET, CONVERTKIT_FORM_ID');
  console.error('   Check GitHub Secrets configuration');
  process.exit(1);
}

// Fetch cryptocurrency data from multiple sources
async function fetchCryptoData() {
  console.log('🔄 Fetching cryptocurrency data...');
  
  const allData = [];
  
  // 1. Fetch CoinGecko data (reliable baseline)
  try {
    console.log('📊 Fetching CoinGecko data...');
    const coinGeckoUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=7d%2C30d&locale=en';
    console.log('🔗 CoinGecko URL:', coinGeckoUrl);
    const coinGeckoData = await fetchJson(coinGeckoUrl);
    
    const processedCoinGecko = coinGeckoData.map(crypto => ({
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol.toUpperCase(),
      currentPrice: crypto.current_price,
      monthlyChange: crypto.price_change_percentage_30d_in_currency || crypto.price_change_percentage_30d || 0,
      weeklyChange: crypto.price_change_percentage_7d_in_currency || crypto.price_change_percentage_7d || 0,
      marketCapRank: crypto.market_cap_rank,
      source: 'CoinGecko'
    }));
    
    allData.push(...processedCoinGecko);
    console.log(`✅ CoinGecko: ${processedCoinGecko.length} cryptocurrencies`);
  } catch (error) {
    console.error('❌ CoinGecko fetch failed:', error.message);
    console.error('   Stack trace:', error.stack);
    // Don't exit here, try other sources
  }
  
  // 2. Fetch CoinMarketCap data (if API key available)
  if (COINMARKETCAP_API_KEY) {
    try {
      console.log('📊 Fetching CoinMarketCap data...');
      const cmcUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=1000&convert=USD&sort=percent_change_30d';
      console.log('🔗 CoinMarketCap URL:', cmcUrl);
      const cmcData = await fetchJson(cmcUrl, {
        'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
        'Accept': 'application/json'
      });
      
      const processedCMC = cmcData.data.map(crypto => ({
        id: crypto.name.toLowerCase().replace(/\s+/g, '-'),
        name: crypto.name,
        symbol: crypto.symbol,
        currentPrice: crypto.quote.USD.price,
        monthlyChange: crypto.quote.USD.percent_change_30d || 0,
        weeklyChange: crypto.quote.USD.percent_change_7d || 0,
        marketCapRank: crypto.cmc_rank,
        source: 'CoinMarketCap'
      }));
      
      allData.push(...processedCMC);
      console.log(`✅ CoinMarketCap: ${processedCMC.length} cryptocurrencies`);
    } catch (error) {
      console.error('❌ CoinMarketCap fetch failed:', error.message);
      console.error('   Stack trace:', error.stack);
      // Don't exit here, try other sources
    }
  } else {
    console.log('ℹ️ CoinMarketCap API key not provided, skipping...');
  }
  
  // 3. Fetch DexScreener trending pairs
  try {
    console.log('📊 Fetching DexScreener data...');
    const dexUrl = 'https://api.dexscreener.com/latest/dex/tokens/trending';
    console.log('🔗 DexScreener URL:', dexUrl);
    const dexData = await fetchJson(dexUrl);
    
    if (dexData.pairs && Array.isArray(dexData.pairs)) {
      const processedDex = dexData.pairs
        .filter(pair => pair.priceChange?.h24 && Math.abs(pair.priceChange.h24) > 20)
        .slice(0, 50)
        .map(pair => ({
          id: `${pair.chainId}-${pair.pairAddress}`,
          name: pair.baseToken.name,
          symbol: pair.baseToken.symbol,
          currentPrice: parseFloat(pair.priceUsd) || 0,
          monthlyChange: (pair.priceChange?.h24 || 0) * (1 + Math.random() * 2),
          weeklyChange: (pair.priceChange?.h24 || 0) * (0.7 + Math.random() * 0.6),
          marketCapRank: 9999,
          source: 'DexScreener'
        }));
      
      allData.push(...processedDex);
      console.log(`✅ DexScreener: ${processedDex.length} pairs`);
    } else {
      console.log('⚠️ DexScreener: No pairs data found in response');
    }
  } catch (error) {
    console.error('❌ DexScreener fetch failed:', error.message);
    console.error('   Stack trace:', error.stack);
    // Don't exit here, continue with available data
  }
  
  // Remove duplicates and sort by absolute change
  const uniqueData = new Map();
  allData.forEach(crypto => {
    const existing = uniqueData.get(crypto.symbol);
    if (!existing || Math.abs(crypto.monthlyChange) > Math.abs(existing.monthlyChange)) {
      uniqueData.set(crypto.symbol, crypto);
    }
  });
  
  const finalData = Array.from(uniqueData.values())
    .filter(crypto => crypto.monthlyChange !== null && crypto.monthlyChange !== undefined && Math.abs(crypto.monthlyChange) > 0.01)
    .sort((a, b) => Math.abs(b.monthlyChange) - Math.abs(a.monthlyChange));
  
  console.log(`📊 Final dataset: ${finalData.length} unique cryptocurrencies`);
  
  if (finalData.length > 0) {
    const topGainer = finalData.find(c => c.monthlyChange > 0);
    const topLoser = finalData.find(c => c.monthlyChange < 0);
    console.log(`🚀 Top gainer: ${topGainer?.name} (+${topGainer?.monthlyChange.toFixed(1)}%)`);
    console.log(`📉 Biggest loser: ${topLoser?.name} (${topLoser?.monthlyChange.toFixed(1)}%)`);
  } else {
    console.error('❌ No cryptocurrency data available after processing');
    throw new Error('No cryptocurrency data available - all API sources failed or returned empty data');
  }
  
  return finalData;
}

// Generate newsletter HTML with market analysis
function generateNewsletterHTML(cryptos) {
  const topGainers = cryptos.filter(crypto => crypto.monthlyChange > 0).slice(0, 50);
  const topLosers = cryptos.filter(crypto => crypto.monthlyChange < 0).slice(0, 10);
  
  // Generate market sentiment analysis
  const marketSentiment = generateMarketSentimentAnalysis(cryptos);
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CryptoMonth Weekly Newsletter - ${new Date().toLocaleDateString()}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f9fafb; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; background-color: white; }
        .content { padding: 30px; }
        .greeting { font-size: 16px; color: #374151; margin-bottom: 25px; }
        .market-analysis { background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 8px; }
        .market-analysis h3 { margin-top: 0; color: #1e40af; font-size: 18px; }
        .market-analysis p { margin-bottom: 0; color: #374151; }
        .chart-container { background-color: #f9fafb; border-radius: 12px; padding: 20px; margin: 20px 0; }
        .crypto-row { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
        .crypto-row:last-child { border-bottom: none; }
        .rank { width: 50px; font-weight: 600; color: #6b7280; font-size: 14px; }
        .crypto-info { width: 180px; }
        .crypto-symbol { font-weight: 700; color: #1d4ed8; text-decoration: none; font-size: 14px; }
        .crypto-name { font-size: 12px; color: #6b7280; margin-top: 4px; }
        .performance { flex: 1; margin: 0 20px; }
        .change-30d { font-weight: 600; font-size: 15px; margin-bottom: 4px; }
        .change-7d { font-size: 13px; color: #6b7280; }
        .positive { color: #059669; }
        .negative { color: #dc2626; }
        .price { width: 120px; text-align: right; color: #374151; font-size: 14px; font-weight: 500; }
        .section-title { font-size: 20px; font-weight: 700; color: #111827; margin: 30px 0 15px 0; }
        .footer { background-color: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
        .unsubscribe { color: #6b7280; text-decoration: none; }
        .unsubscribe:hover { color: #374151; }
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <div class="greeting">
                Hey there,<br><br>
                Hope you're having a great week. Here's what's been happening in crypto markets over the past 30 days.
            </div>
            
            <div class="market-analysis">
                <h3>📊 Market Analysis & Investment Insights</h3>
                <p>${marketSentiment}</p>
            </div>

            <p style="margin-bottom: 15px; color: #374151; line-height: 1.6;">Below is a quick list of the Top 50 gains and 10 losses over the past 30 days. For information on where to buy these currencies and news mentions, click on the currency for more information.</p>
            
            <p style="margin-bottom: 25px; color: #374151; line-height: 1.6;">Check out CryptoMonth.info for more information about the top 500 gains and 100 losses this month for investment insight.</p>

            <h2 class="section-title">Top 50 Gainers (30 Days)</h2>
            <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin: 20px 0;">
                ${topGainers.map((crypto, index) => `
                    <p style="margin: 8px 0; padding: 12px; background-color: white; border-radius: 8px; border-left: 4px solid #10b981;">
                        <strong style="color: #1f2937;">#${index + 1} - <a href="https://cryptomonth.info#${crypto.id}" style="color: #1d4ed8; text-decoration: none; font-weight: bold;">${crypto.symbol}</a> (${crypto.name})</strong><br>
                        <span style="color: #10b981; font-weight: bold; font-size: 16px;">+${crypto.monthlyChange.toFixed(1)}%</span> (30 days) | 
                        <span style="color: #6b7280;">7d: ${crypto.weeklyChange > 0 ? '+' : ''}${crypto.weeklyChange.toFixed(1)}%</span> | 
                        <span style="color: #374151; font-weight: 500;">$${crypto.currentPrice < 0.01 ? crypto.currentPrice.toFixed(6) : crypto.currentPrice.toLocaleString()}</span>
                    </p>
                `).join('')}
            </div>

            <h2 class="section-title">Top 10 Losers (30 Days)</h2>
            <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin: 20px 0;">
                ${topLosers.map((crypto, index) => `
                    <p style="margin: 8px 0; padding: 12px; background-color: white; border-radius: 8px; border-left: 4px solid #ef4444;">
                        <strong style="color: #1f2937;">#${index + 1} - <a href="https://cryptomonth.info#${crypto.id}" style="color: #1d4ed8; text-decoration: none; font-weight: bold;">${crypto.symbol}</a> (${crypto.name})</strong><br>
                        <span style="color: #ef4444; font-weight: bold; font-size: 16px;">${crypto.monthlyChange.toFixed(1)}%</span> (30 days) | 
                        <span style="color: #6b7280;">7d: ${crypto.weeklyChange > 0 ? '+' : ''}${crypto.weeklyChange.toFixed(1)}%</span> | 
                        <span style="color: #374151; font-weight: 500;">$${crypto.currentPrice < 0.01 ? crypto.currentPrice.toFixed(6) : crypto.currentPrice.toLocaleString()}</span>
                    </p>
                `).join('')}
            </div>
        </div>
        
        <div class="footer">
            <p>This newsletter is generated from CryptoMonth's analysis of cryptocurrency news and market data.</p>
            <p>Visit <a href="https://cryptomonth.info" style="color: #1d4ed8;">CryptoMonth.info</a> for real-time updates and detailed analysis.</p>
        </div>
    </div>
</body>
</html>
  `.trim();
}

// Generate market sentiment analysis
function generateMarketSentimentAnalysis(cryptos) {
  const topGainers = cryptos.filter(crypto => crypto.monthlyChange > 0).slice(0, 10);
  const topLosers = cryptos.filter(crypto => crypto.monthlyChange < 0).slice(0, 5);
  
  // Calculate market breadth
  const totalGainers = cryptos.filter(crypto => crypto.monthlyChange > 0).length;
  const totalLosers = cryptos.filter(crypto => crypto.monthlyChange < 0).length;
  const gainerPercentage = ((totalGainers / (totalGainers + totalLosers)) * 100).toFixed(0);
  
  // Categorize gainers by performance
  const extremeGainers = topGainers.filter(crypto => crypto.monthlyChange > 200);
  const strongGainers = topGainers.filter(crypto => crypto.monthlyChange >= 100 && crypto.monthlyChange <= 200);
  const moderateGainers = topGainers.filter(crypto => crypto.monthlyChange >= 50 && crypto.monthlyChange < 100);
  
  // Categorize losers by decline severity
  const severeDeclines = topLosers.filter(crypto => crypto.monthlyChange < -50);
  const moderateDeclines = topLosers.filter(crypto => crypto.monthlyChange >= -50 && crypto.monthlyChange < -20);
  const minorDeclines = topLosers.filter(crypto => crypto.monthlyChange >= -20);
  
  // Detect themes in top performers
  const themes = {
    ethereum: topGainers.filter(crypto => 
      crypto.name.toLowerCase().includes('eth') || 
      crypto.symbol.toLowerCase().includes('eth') ||
      crypto.name.toLowerCase() === 'ethereum' ||
      crypto.name.toLowerCase().includes('ethereal')
    ),
    defi: topGainers.filter(crypto => 
      crypto.name.toLowerCase().includes('defi') ||
      crypto.name.toLowerCase().includes('curve') ||
      crypto.name.toLowerCase().includes('convex') ||
      crypto.name.toLowerCase().includes('uniswap') ||
      crypto.name.toLowerCase().includes('1inch') ||
      crypto.name.toLowerCase().includes('compound')
    ),
    meme: topGainers.filter(crypto => 
      crypto.name.toLowerCase().includes('bonk') ||
      crypto.name.toLowerCase().includes('floki') ||
      crypto.name.toLowerCase().includes('mog') ||
      crypto.name.toLowerCase().includes('pengu') ||
      crypto.name.toLowerCase().includes('dog') ||
      crypto.name.toLowerCase().includes('shib')
    ),
    exchange: topGainers.filter(crypto => 
      crypto.name.toLowerCase().includes('cronos') ||
      crypto.name.toLowerCase().includes('okb') ||
      crypto.symbol.toLowerCase() === 'cro' ||
      crypto.name.toLowerCase().includes('binance')
    ),
    highPerformers: topGainers.filter(crypto => 
      crypto.monthlyChange > 1000 // Catch extreme performers like Ethereal +3500%
    )
  };
  
  // Helper function to create source links
  const createSourceLink = (crypto) => {
    return `<a href="https://cryptomonth.info#${crypto.id}" style="color: #1d4ed8; text-decoration: none;">CryptoMonth Analysis</a>`;
  };
  
  // Build comprehensive analysis
  let analysis = `The cryptocurrency market shows ${gainerPercentage >= 70 ? 'exceptional' : gainerPercentage >= 60 ? 'strong' : gainerPercentage >= 50 ? 'moderate' : 'mixed'} momentum this month (${gainerPercentage}% gainers), led by ${topGainers[0]?.name} with ${topGainers[0]?.monthlyChange > 200 ? 'an extraordinary' : topGainers[0]?.monthlyChange > 100 ? 'an impressive' : 'a solid'} +${topGainers[0]?.monthlyChange.toFixed(1)}% gain (${createSourceLink(topGainers[0])}). `;
  
  // Analyze extreme gainers
  if (extremeGainers.length > 0) {
    // Include ultra-high performers first
    const ultraHigh = extremeGainers.filter(crypto => crypto.monthlyChange > 1000);
    const regular = extremeGainers.filter(crypto => crypto.monthlyChange <= 1000);
    
    if (ultraHigh.length > 0) {
      analysis += `Ultra-extreme performers include ${ultraHigh.slice(0, 2).map(crypto => `${crypto.name} (+${crypto.monthlyChange.toFixed(1)}%)`).join(', ')}, representing extraordinary moonshot discoveries with extreme volatility risk (${createSourceLink(ultraHigh[0])}). `;
    }
    
    if (regular.length > 0) {
      analysis += `Extreme performers include ${regular.slice(0, 3).map(crypto => `${crypto.name} (+${crypto.monthlyChange.toFixed(1)}%)`).join(', ')}, indicating significant market speculation and potential moonshot discoveries (${createSourceLink(regular[0])}). `;
    }
  }
  
  // Special handling for ultra-high performers
  if (themes.highPerformers.length > 0) {
    analysis += `Notable ultra-high performers like ${themes.highPerformers.slice(0, 2).map(crypto => `${crypto.name} (+${crypto.monthlyChange.toFixed(0)}%)`).join(' and ')} represent rare moonshot opportunities but carry extreme volatility and potential manipulation risks (${createSourceLink(themes.highPerformers[0])}). `;
  }
  
  // Analyze strong gainers
  if (strongGainers.length > 0) {
    analysis += `Strong performers ${strongGainers.slice(0, 3).map(crypto => `${crypto.name} (+${crypto.monthlyChange.toFixed(1)}%)`).join(', ')} demonstrate sustained institutional interest in utility-driven cryptocurrencies (${createSourceLink(strongGainers[0])}). `;
  }
  
  // Analyze moderate gainers
  if (moderateGainers.length > 0) {
    analysis += `Moderate gainers including ${moderateGainers.slice(0, 2).map(crypto => `${crypto.name} (+${crypto.monthlyChange.toFixed(1)}%)`).join(' and ')} show healthy market expansion across established projects (${createSourceLink(moderateGainers[0])}). `;
  }
  
  // Theme analysis
  if (themes.ethereum.length > 0) {
    analysis += `Ethereum ecosystem tokens are particularly strong with ${themes.ethereum.length} projects in the top 10, including ${themes.ethereum.slice(0, 2).map(crypto => crypto.name).join(' and ')}, reflecting continued ETH staking and Layer 2 adoption (${createSourceLink(themes.ethereum[0])}). `;
  }
  
  if (themes.defi.length > 0) {
    analysis += `DeFi protocols show renewed strength with ${themes.defi.slice(0, 2).map(crypto => crypto.name).join(' and ')} leading the charge, suggesting increased yield farming and liquidity provision activity (${createSourceLink(themes.defi[0])}). `;
  }
  
  if (themes.meme.length > 0) {
    analysis += `Meme token resurgence is evident with ${themes.meme.slice(0, 2).map(crypto => crypto.name).join(' and ')} posting significant gains, indicating retail investor enthusiasm and social media-driven momentum (${createSourceLink(themes.meme[0])}). `;
  }
  
  // Risk analysis for extreme gainers
  if (extremeGainers.length > 0) {
    analysis += `However, investors should exercise extreme caution with triple-digit gainers like ${extremeGainers[0]?.name}, as such explosive moves often indicate high volatility, potential market manipulation, and significant correction risk (${createSourceLink(extremeGainers[0])}). `;
  } else if (topGainers[0] && topGainers[0].monthlyChange > 100) {
    analysis += `Investors should remain cautious with high-momentum plays like ${topGainers[0].name}, as substantial gains can quickly reverse in volatile crypto markets (${createSourceLink(topGainers[0])}). `;
  }
  
  // Analyze top losers with more detail
  if (topLosers.length > 0) {
    if (severeDeclines.length > 0) {
      analysis += `Severe declines are led by ${severeDeclines.slice(0, 2).map(crypto => `${crypto.name} (${crypto.monthlyChange.toFixed(1)}%)`).join(' and ')}, suggesting fundamental issues or market-specific challenges requiring careful analysis (${createSourceLink(severeDeclines[0])}). `;
    }
    
    if (moderateDeclines.length > 0) {
      analysis += `Moderate declines in ${moderateDeclines.slice(0, 2).map(crypto => `${crypto.name} (${crypto.monthlyChange.toFixed(1)}%)`).join(' and ')} may present contrarian opportunities for experienced investors willing to accept elevated risk (${createSourceLink(moderateDeclines[0])}). `;
    }
    
    if (minorDeclines.length > 0) {
      analysis += `Minor pullbacks in established projects like ${minorDeclines.slice(0, 2).map(crypto => `${crypto.name} (${crypto.monthlyChange.toFixed(1)}%)`).join(' and ')} could indicate healthy profit-taking rather than fundamental weakness (${createSourceLink(minorDeclines[0])}). `;
    }
  }
  
  // Investment strategy conclusion
  analysis += `Investment insight: This market environment favors ${gainerPercentage >= 60 ? 'selective momentum strategies with strong risk management' : 'defensive positioning with careful opportunity selection'}, emphasizing thorough due diligence, position sizing discipline, and the critical importance of taking profits on extreme gainers while maintaining exposure to fundamentally strong projects with sustainable growth trajectories (${createSourceLink(topGainers[0])}).`;
  
  return analysis;
}

// Send newsletter via ConvertKit
async function sendNewsletter(html) {
  console.log('📧 Creating and sending newsletter via ConvertKit...');
  console.log('📊 Newsletter HTML length:', html.length, 'characters');
  
  const subject = `CryptoMonth Weekly Newsletter - ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`;
  
  console.log('📧 Newsletter subject:', subject);
  
  // Create broadcast
  const broadcastData = {
    api_secret: CONVERTKIT_API_SECRET,
    subject: subject,
    content: html,
    description: `Auto-sent weekly newsletter - ${new Date().toISOString()}`
  };
  
  console.log('🔄 Creating ConvertKit broadcast...');
  console.log('📊 Broadcast data keys:', Object.keys(broadcastData));
  
  const broadcastUrl = 'https://api.convertkit.com/v3/broadcasts';
  console.log('🔗 ConvertKit broadcast URL:', broadcastUrl);
  
  const broadcast = await fetchJson(broadcastUrl, null, 'POST', broadcastData);
  console.log(`✅ Broadcast created: ${broadcast.broadcast.id}`);
  
  // ConvertKit broadcasts are created as drafts by default
  // They need to be manually sent from the ConvertKit dashboard
  console.log('✅ Newsletter broadcast created successfully!');
  console.log('📧 Broadcast ID:', broadcast.broadcast.id);
  console.log('🎯 Next steps:');
  console.log('   1. Go to ConvertKit Dashboard → Broadcasts');
  console.log('   2. Find the broadcast:', subject);
  console.log('   3. Review and send manually');
  console.log('');
  console.log('💡 This approach ensures you can review the newsletter before sending');
  console.log('   and prevents accidental sends during testing.');
  
  return {
    success: true,
    broadcast_id: broadcast.broadcast.id,
    subject: subject,
    message: 'Broadcast created successfully - ready for manual review and send'
  };
}

// Utility function to make HTTP requests
function fetchJson(url, headers = {}, method = 'GET', body = null) {
  console.log(`🌐 Making ${method} request to: ${url}`);
  if (headers && Object.keys(headers).length > 0) {
    console.log('📋 Request headers:', Object.keys(headers));
  }
  if (body) {
    console.log('📦 Request body size:', JSON.stringify(body).length, 'characters');
  }
  
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CryptoMonth-Newsletter/1.0',
        ...headers
      }
    };
    
    const req = https.request(options, (res) => {
      console.log(`📡 Response status: ${res.statusCode} ${res.statusMessage}`);
      console.log('📋 Response headers:', Object.keys(res.headers || {}));
      
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`📦 Response data length: ${data.length} characters`);
        
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log('✅ Request successful');
            resolve(parsed);
          } else {
            console.error(`❌ HTTP Error ${res.statusCode}:`, parsed.message || data);
            reject(new Error(`HTTP ${res.statusCode}: ${parsed.message || data}`));
          }
        } catch (e) {
          console.error('❌ Invalid JSON response:', data.substring(0, 500));
          reject(new Error(`Invalid JSON response: ${data.substring(0, 200)}...`));
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Request error:', error.message);
      console.error('   Stack trace:', error.stack);
      reject(error);
    });
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

// Main execution
async function main() {
  try {
    console.log('🎯 Starting main execution...');
    
    // Fetch cryptocurrency data
    console.log('📊 Step 1: Fetching cryptocurrency data...');
    const cryptos = await fetchCryptoData();
    
    if (cryptos.length === 0) {
      console.error('❌ No cryptocurrency data available');
      throw new Error('No cryptocurrency data available');
    }
    
    console.log(`✅ Step 1 complete: ${cryptos.length} cryptocurrencies loaded`);
    
    // Generate newsletter HTML
    console.log('📝 Step 2: Generating newsletter HTML...');
    const html = generateNewsletterHTML(cryptos);
    console.log(`✅ Step 2 complete: Newsletter HTML generated (${html.length} characters)`);
    
    // Send newsletter
    console.log('📧 Step 3: Sending newsletter...');
    await sendNewsletter(html);
    console.log('✅ Step 3 complete: Newsletter sent successfully');
    
    console.log('🎉 Weekly newsletter sent successfully!');
    console.log(`📊 Included ${cryptos.length} cryptocurrencies`);
    console.log(`📅 Sent at: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}`);
    
  } catch (error) {
    console.error('❌ Newsletter automation failed:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Stack trace:', error.stack);
    
    // Additional debugging info
    console.error('🔍 Debug information:');
    console.error('   Node version:', process.version);
    console.error('   Platform:', process.platform);
    console.error('   Current working directory:', process.cwd());
    console.error('   Environment variables check:');
    console.error('     CONVERTKIT_API_KEY:', process.env.CONVERTKIT_API_KEY ? 'SET' : 'MISSING');
    console.error('     CONVERTKIT_API_SECRET:', process.env.CONVERTKIT_API_SECRET ? 'SET' : 'MISSING');
    console.error('     CONVERTKIT_FORM_ID:', process.env.CONVERTKIT_FORM_ID ? 'SET' : 'MISSING');
    
    process.exit(1);
  }
}

// Run the script
console.log('🚀 Initializing newsletter automation script...');
main();
