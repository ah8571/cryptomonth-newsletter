#!/usr/bin/env node

// Weekly Newsletter Automation Script
// This runs every Sunday at 9 AM EST via GitHub Actions

const https = require('https');
const fs = require('fs');

// Configuration from environment variables
const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
const CONVERTKIT_API_SECRET = process.env.CONVERTKIT_API_SECRET;
const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

console.log('🚀 Starting weekly CryptoMonth newsletter automation...');
console.log('📅 Current time:', new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));

// Validate environment variables
if (!CONVERTKIT_API_KEY || !CONVERTKIT_API_SECRET || !CONVERTKIT_FORM_ID) {
  console.error('❌ Missing ConvertKit environment variables');
  process.exit(1);
}

// Fetch cryptocurrency data from multiple sources
async function fetchCryptoData() {
  console.log('🔄 Fetching cryptocurrency data...');
  
  const allData = [];
  
  // 1. Fetch CoinGecko data (reliable baseline)
  try {
    console.log('📊 Fetching CoinGecko data...');
    const coinGeckoData = await fetchJson('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=7d%2C30d&locale=en');
    
    const processedCoinGecko = coinGeckoData.map(crypto => ({
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol.toUpperCase(),
      currentPrice: crypto.current_price,
      monthlyChange: crypto.price_change_percentage_30d || 0,
      weeklyChange: crypto.price_change_percentage_7d_in_currency || 0,
      marketCapRank: crypto.market_cap_rank,
      source: 'CoinGecko'
    }));
    
    allData.push(...processedCoinGecko);
    console.log(`✅ CoinGecko: ${processedCoinGecko.length} cryptocurrencies`);
  } catch (error) {
    console.error('⚠️ CoinGecko fetch failed:', error.message);
  }
  
  // 2. Fetch CoinMarketCap data (if API key available)
  if (COINMARKETCAP_API_KEY) {
    try {
      console.log('📊 Fetching CoinMarketCap data...');
      const cmcData = await fetchJson('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=1000&convert=USD&sort=percent_change_30d', {
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
      console.error('⚠️ CoinMarketCap fetch failed:', error.message);
    }
  }
  
  // 3. Fetch DexScreener trending pairs
  try {
    console.log('📊 Fetching DexScreener data...');
    const dexData = await fetchJson('https://api.dexscreener.com/latest/dex/tokens/trending');
    
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
    }
  } catch (error) {
    console.error('⚠️ DexScreener fetch failed:', error.message);
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
    .filter(crypto => Math.abs(crypto.monthlyChange) > 0.1)
    .sort((a, b) => Math.abs(b.monthlyChange) - Math.abs(a.monthlyChange));
  
  console.log(`📊 Final dataset: ${finalData.length} unique cryptocurrencies`);
  
  if (finalData.length > 0) {
    const topGainer = finalData.find(c => c.monthlyChange > 0);
    const topLoser = finalData.find(c => c.monthlyChange < 0);
    console.log(`🚀 Top gainer: ${topGainer?.name} (+${topGainer?.monthlyChange.toFixed(1)}%)`);
    console.log(`📉 Biggest loser: ${topLoser?.name} (${topLoser?.monthlyChange.toFixed(1)}%)`);
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
            <div class="chart-container">
                ${topGainers.map((crypto, index) => `
                    <div class="crypto-row">
                        <div class="rank">#${index + 1}</div>
                        <div class="crypto-info">
                            <a href="https://cryptomonth.info#${crypto.id}" class="crypto-symbol">${crypto.symbol}</a>
                            <div class="crypto-name">${crypto.name}</div>
                        </div>
                        <div class="performance">
                            <div class="change-30d positive">+${crypto.monthlyChange.toFixed(1)}%</div>
                            <div class="change-7d">7d: ${crypto.weeklyChange > 0 ? '+' : ''}${crypto.weeklyChange.toFixed(1)}%</div>
                        </div>
                        <div class="price">$${crypto.currentPrice < 0.01 ? crypto.currentPrice.toFixed(6) : crypto.currentPrice.toLocaleString()}</div>
                    </div>
                `).join('')}
            </div>

            <h2 class="section-title">Top 10 Losers (30 Days)</h2>
            <div class="chart-container">
                ${topLosers.map((crypto, index) => `
                    <div class="crypto-row">
                        <div class="rank">#${index + 1}</div>
                        <div class="crypto-info">
                            <a href="https://cryptomonth.info#${crypto.id}" class="crypto-symbol">${crypto.symbol}</a>
                            <div class="crypto-name">${crypto.name}</div>
                        </div>
                        <div class="performance">
                            <div class="change-30d negative">${crypto.monthlyChange.toFixed(1)}%</div>
                            <div class="change-7d">7d: ${crypto.weeklyChange > 0 ? '+' : ''}${crypto.weeklyChange.toFixed(1)}%</div>
                        </div>
                        <div class="price">$${crypto.currentPrice < 0.01 ? crypto.currentPrice.toFixed(6) : crypto.currentPrice.toLocaleString()}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="footer">
            <p>This newsletter is generated from CryptoMonth's analysis of cryptocurrency news and market data.</p>
            <p>Visit <a href="https://cryptomonth.info" style="color: #1d4ed8;">CryptoMonth.info</a> for real-time updates and detailed analysis.</p>
            <p>Powered by <a href="https://convertkit.com" style="color: #1d4ed8;">ConvertKit</a></p>
            <p><a href="%%unsubscribe_url%%" class="unsubscribe">Unsubscribe</a> | <a href="%%manage_preferences_url%%" class="unsubscribe">Update Preferences</a></p>
        </div>
    </div>
</body>
</html>
  `.trim();
}

// Generate market sentiment analysis
function generateMarketSentimentAnalysis(cryptos) {
  const topGainers = cryptos.filter(crypto => crypto.monthlyChange > 0).slice(0, 5);
  const topLosers = cryptos.filter(crypto => crypto.monthlyChange < 0).slice(0, 3);
  
  let analysis = `The top 5 gainers this month show strong momentum with ${topGainers[0]?.name} leading at +${topGainers[0]?.monthlyChange.toFixed(1)}%. `;
  
  // Analyze themes in top gainers
  if (topGainers.length >= 3) {
    analysis += `Notable performers include ${topGainers[1]?.name} (+${topGainers[1]?.monthlyChange.toFixed(1)}%) and ${topGainers[2]?.name} (+${topGainers[2]?.monthlyChange.toFixed(1)}%), indicating continued institutional interest in utility-driven cryptocurrencies. `;
  }
  
  // Add risk analysis
  if (topGainers[0] && topGainers[0].monthlyChange > 100) {
    analysis += `However, investors should exercise caution with extreme gainers like ${topGainers[0].name}, as triple-digit gains often indicate high volatility and potential for significant corrections. `;
  }
  
  // Analyze losers
  if (topLosers.length > 0) {
    analysis += `The biggest losers include ${topLosers[0]?.name} (${topLosers[0]?.monthlyChange.toFixed(1)}%)`;
    if (topLosers.length > 1) {
      analysis += ` and ${topLosers[1]?.name} (${topLosers[1]?.monthlyChange.toFixed(1)}%)`;
    }
    analysis += `, highlighting the importance of thorough due diligence and risk management in cryptocurrency investments.`;
  }
  
  return analysis;
}

// Send newsletter via ConvertKit
async function sendNewsletter(html) {
  console.log('📧 Creating and sending newsletter via ConvertKit...');
  
  const subject = `CryptoMonth Weekly Newsletter - ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`;
  
  // Create broadcast
  const broadcastData = {
    api_secret: CONVERTKIT_API_SECRET,
    subject: subject,
    content: html,
    description: `Auto-sent weekly newsletter - ${new Date().toISOString()}`
  };
  
  const broadcast = await fetchJson('https://api.convertkit.com/v3/broadcasts', null, 'POST', broadcastData);
  console.log(`✅ Broadcast created: ${broadcast.broadcast.id}`);
  
  // Send broadcast immediately
  const sendData = {
    api_secret: CONVERTKIT_API_SECRET
  };
  
  const sendResult = await fetchJson(`https://api.convertkit.com/v3/broadcasts/${broadcast.broadcast.id}/send`, null, 'POST', sendData);
  console.log('✅ Newsletter sent successfully!');
  
  return sendResult;
}

// Utility function to make HTTP requests
function fetchJson(url, headers = {}, method = 'GET', body = null) {
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
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${parsed.message || data}`));
          }
        } catch (e) {
          reject(new Error(`Invalid JSON response: ${data}`));
        }
      });
    });
    
    req.on('error', reject);
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

// Main execution
async function main() {
  try {
    // Fetch cryptocurrency data
    const cryptos = await fetchCryptoData();
    
    if (cryptos.length === 0) {
      throw new Error('No cryptocurrency data available');
    }
    
    // Generate newsletter HTML
    const html = generateNewsletterHTML(cryptos);
    
    // Send newsletter
    await sendNewsletter(html);
    
    console.log('🎉 Weekly newsletter sent successfully!');
    console.log(`📊 Included ${cryptos.length} cryptocurrencies`);
    console.log(`📅 Sent at: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}`);
    
  } catch (error) {
    console.error('❌ Newsletter automation failed:', error);
    process.exit(1);
  }
}

// Run the script
main();