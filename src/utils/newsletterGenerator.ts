import type { CryptoData } from '../types/crypto';
import { advertiserService } from '../services/advertiserService';

interface NewsletterData {
  cryptos: CryptoData[];
  weekDate: string;
  baseUrl: string;
}

// Generate market sentiment analysis for top gainers and losers
const generateMarketSentimentAnalysis = (cryptos: CryptoData[]): string => {
  const topGainers = cryptos.filter(crypto => crypto.monthlyChange > 0).slice(0, 5);
  const topLosers = cryptos.filter(crypto => crypto.monthlyChange < 0).slice(0, 3);
  
  // Analyze common themes in top gainers
  const gainerThemes = new Map<string, string[]>();
  
  topGainers.forEach(crypto => {
    const quotes = crypto.quotes.map(q => q.text.toLowerCase());
    const allText = quotes.join(' ');
    
    // Identify key themes
    if (allText.includes('defi') || allText.includes('decentralized')) {
      if (!gainerThemes.has('defi')) gainerThemes.set('defi', []);
      gainerThemes.get('defi')!.push(crypto.name);
    }
    if (allText.includes('ai') || allText.includes('artificial intelligence')) {
      if (!gainerThemes.has('ai')) gainerThemes.set('ai', []);
      gainerThemes.get('ai')!.push(crypto.name);
    }
    if (allText.includes('gaming') || allText.includes('nft')) {
      if (!gainerThemes.has('gaming')) gainerThemes.set('gaming', []);
      gainerThemes.get('gaming')!.push(crypto.name);
    }
    if (allText.includes('layer') || allText.includes('scaling')) {
      if (!gainerThemes.has('scaling')) gainerThemes.set('scaling', []);
      gainerThemes.get('scaling')!.push(crypto.name);
    }
  });
  
  // Generate consolidated insights for gainers
  let gainerAnalysis = `The top 5 gainers this month show strong momentum with ${topGainers[0]?.name} leading at +${topGainers[0]?.monthlyChange.toFixed(1)}% (<a href="${topGainers[0]?.quotes[0]?.link}" style="color: #1d4ed8;">${topGainers[0]?.quotes[0]?.source}</a>). `;
  
  if (gainerThemes.has('defi') && gainerThemes.get('defi')!.length > 1) {
    const defiTokens = gainerThemes.get('defi')!.slice(0, 2);
    const defiToken1 = topGainers.find(c => c.name === defiTokens[0]);
    const defiToken2 = topGainers.find(c => c.name === defiTokens[1]);
    gainerAnalysis += `DeFi protocols including ${defiTokens.join(' and ')} are benefiting from increased institutional adoption and yield farming opportunities (<a href="${defiToken1?.quotes[0]?.link}" style="color: #1d4ed8;">${defiToken1?.quotes[0]?.source}</a>). `;
  }
  if (gainerThemes.has('ai') && gainerThemes.get('ai')!.length > 0) {
    const aiToken = topGainers.find(c => gainerThemes.get('ai')!.includes(c.name));
    gainerAnalysis += `AI-focused tokens are gaining traction as the sector attracts significant investment and development activity (<a href="${aiToken?.quotes[0]?.link}" style="color: #1d4ed8;">${aiToken?.quotes[0]?.source}</a>). `;
  }
  if (gainerThemes.has('scaling') && gainerThemes.get('scaling')!.length > 0) {
    const scalingToken = topGainers.find(c => gainerThemes.get('scaling')!.includes(c.name));
    gainerAnalysis += `Layer 2 and scaling solutions continue to see adoption as Ethereum gas fees drive users to more efficient alternatives (<a href="${scalingToken?.quotes[0]?.link}" style="color: #1d4ed8;">${scalingToken?.quotes[0]?.source}</a>). `;
  }
  
  // Add risk analysis for top gainers
  const highestGainer = topGainers[0];
  let riskAnalysis = '';
  if (highestGainer && highestGainer.monthlyChange > 100) {
    riskAnalysis = ` However, investors should exercise caution with extreme gainers like ${highestGainer.name}, as triple-digit gains often indicate high volatility and potential for significant corrections (<a href="${topGainers[2]?.quotes[0]?.link}" style="color: #1d4ed8;">${topGainers[2]?.quotes[0]?.source}</a>). `;
  } else if (highestGainer && highestGainer.monthlyChange > 50) {
    riskAnalysis = ` While these gains are impressive, investors should be aware that rapid price appreciation can lead to increased volatility and potential pullbacks (<a href="${topGainers[2]?.quotes[0]?.link}" style="color: #1d4ed8;">${topGainers[2]?.quotes[0]?.source}</a>). `;
  }
  
  gainerAnalysis += riskAnalysis + `Investment insight: These gains suggest continued institutional interest in utility-driven cryptocurrencies with real-world applications and strong development teams (<a href="${topGainers[1]?.quotes[0]?.link}" style="color: #1d4ed8;">${topGainers[1]?.quotes[0]?.source}</a>).`;
  
  // Analyze top losers
  let loserAnalysis = '';
  if (topLosers.length > 0) {
    loserAnalysis = ` The biggest losers include ${topLosers[0]?.name} (${topLosers[0]?.monthlyChange.toFixed(1)}%)`;
    if (topLosers.length > 1) {
      loserAnalysis += `, ${topLosers[1]?.name} (${topLosers[1]?.monthlyChange.toFixed(1)}%)`;
    }
    if (topLosers.length > 2) {
      loserAnalysis += `, and ${topLosers[2]?.name} (${topLosers[2]?.monthlyChange.toFixed(1)}%)`;
    }
    
    // Analyze common themes in losers
    const loserThemes: string[] = [];
    topLosers.forEach(crypto => {
      const quotes = crypto.quotes.map(q => q.text.toLowerCase());
      const allText = quotes.join(' ');
      
      if (allText.includes('regulatory') || allText.includes('legal')) {
        loserThemes.push('regulatory concerns');
      }
      if (allText.includes('bankruptcy') || allText.includes('liquidation')) {
        loserThemes.push('financial distress');
      }
      if (allText.includes('hack') || allText.includes('exploit')) {
        loserThemes.push('security issues');
      }
    });
    
    if (loserThemes.length > 0) {
      const uniqueThemes = [...new Set(loserThemes)];
      loserAnalysis += `, primarily due to ${uniqueThemes.slice(0, 2).join(' and ')} (<a href="${topLosers[0]?.quotes[0]?.link}" style="color: #1d4ed8;">${topLosers[0]?.quotes[0]?.source}</a>)`;
    }
    
    // Add rebound analysis for losers
    let reboundAnalysis = '';
    const worstLoser = topLosers[0];
    if (worstLoser && Math.abs(worstLoser.monthlyChange) > 30) {
      reboundAnalysis = ` Some analysts suggest that oversold conditions in tokens like ${worstLoser.name} could present contrarian opportunities for experienced investors willing to accept high risk (<a href="${topLosers[1]?.quotes[0]?.link}" style="color: #1d4ed8;">${topLosers[1]?.quotes[0]?.source}</a>). `;
    } else if (worstLoser && Math.abs(worstLoser.monthlyChange) > 15) {
      reboundAnalysis = ` Market analysts note that some of these declining tokens may find support at current levels, though recovery timelines remain uncertain (<a href="${topLosers[1]?.quotes[0]?.link}" style="color: #1d4ed8;">${topLosers[1]?.quotes[0]?.source}</a>). `;
    }
    
    loserAnalysis += `.${reboundAnalysis}Investment insight: These declines highlight the importance of thorough due diligence and risk management in cryptocurrency investments, particularly avoiding projects with unclear fundamentals or regulatory challenges (<a href="${topLosers[2]?.quotes[0]?.link}" style="color: #1d4ed8;">${topLosers[2]?.quotes[0]?.source}</a>).`;
  }
  
  return gainerAnalysis + loserAnalysis;
};

const addCryptoMonthReference = (marketSentiment: string): string => {
  return marketSentiment;
};

export const generateNewsletterHTML = ({ cryptos, weekDate, baseUrl }: NewsletterData): string => {
  const sortedCryptos = [...cryptos].sort((a, b) => Math.abs(b.monthlyChange) - Math.abs(a.monthlyChange));
  
  const topGainers = sortedCryptos.filter(crypto => crypto.monthlyChange > 0).slice(0, 50);
  const topLosers = sortedCryptos.filter(crypto => crypto.monthlyChange < 0).slice(0, 10);
  
  const marketSentiment = addCryptoMonthReference(generateMarketSentimentAnalysis(sortedCryptos));

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CryptoMonth Weekly Newsletter - ${weekDate}</title>
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
        .crypto-symbol:hover { color: #1e40af; }
        .crypto-name { font-size: 12px; color: #6b7280; margin-top: 4px; }
        .performance { flex: 1; margin: 0 20px; }
        .change-30d { font-weight: 600; font-size: 15px; margin-bottom: 4px; }
        .change-7d { font-size: 13px; color: #6b7280; }
        .positive { color: #059669; }
        .negative { color: #dc2626; }
        .price { width: 120px; text-align: right; color: #374151; font-size: 14px; font-weight: 500; }
        .section-title { font-size: 20px; font-weight: 700; color: #111827; margin: 30px 0 15px 0; }
        .ad-section { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center; }
        .ad-label { font-size: 12px; color: #6b7280; margin-bottom: 10px; }
        .footer { background-color: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
        .unsubscribe { color: #6b7280; text-decoration: none; }
        .unsubscribe:hover { color: #374151; }
        @media (max-width: 600px) {
            .content { padding: 20px; }
            .crypto-row { flex-direction: column; align-items: flex-start; padding: 18px 0; }
            .crypto-info { width: 100%; margin-bottom: 8px; }
            .performance { margin: 10px 0; }
            .price { width: 100%; text-align: left; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <div class="greeting">
                Hey there,<br><br>
                Hope you're having a great week. Here's what's been happening in crypto markets over the past 30 days.
            </div>
            
            <p style="margin-bottom: 25px; color: #374151; line-height: 1.6;">${marketSentiment}</p>

            ${generateAdvertiserSection()}

            <p style="margin-bottom: 15px; color: #374151; line-height: 1.6;">Below is a quick list of the Top 50 gains and 10 losses over the past 30 days. For information on where to buy these currencies and news mentions, click on the currency for more information.</p>
            
            <p style="margin-bottom: 25px; color: #374151; line-height: 1.6;">Check out CryptoMonth.info for more information about the top 500 gains and 100 losses this month for investment insight.</p>

            <h2 class="section-title">Top 50 Gainers (30 Days)</h2>
            <p style="margin-bottom: 15px; color: #6b7280; font-size: 14px; text-align: center;">(Click the crypto for market analysis)</p>
            <div class="chart-container">
                ${topGainers.map((crypto, index) => `
                    <div class="crypto-row">
                        <div class="rank">#${index + 1}</div>
                        <div class="crypto-info">
                            <a href="${baseUrl}#${crypto.id}" class="crypto-symbol">${crypto.symbol}</a>
                            <div class="crypto-name">${crypto.name}</div>
                        </div>
                        <div class="performance">
                            <div class="change-30d positive">+${crypto.monthlyChange.toFixed(1)}%</div>
                            <div class="change-7d">7d: ${crypto.weeklyChange && crypto.weeklyChange > 0 ? '+' : ''}${(crypto.weeklyChange || 0).toFixed(1)}%</div>
                        </div>
                        <div class="price">$${crypto.currentPrice < 0.01 ? crypto.currentPrice.toFixed(6) : crypto.currentPrice.toLocaleString()}</div>
                    </div>
                `).join('')}
            </div>

            <h2 class="section-title">Top 10 Losers (30 Days)</h2>
            <p style="margin-bottom: 15px; color: #6b7280; font-size: 14px; text-align: center;">(Click the crypto for market analysis)</p>
            <div class="chart-container">
                ${topLosers.map((crypto, index) => `
                    <div class="crypto-row">
                        <div class="rank">#${index + 1}</div>
                        <div class="crypto-info">
                            <a href="${baseUrl}#${crypto.id}" class="crypto-symbol">${crypto.symbol}</a>
                            <div class="crypto-name">${crypto.name}</div>
                        </div>
                        <div class="performance">
                            <div class="change-30d negative">${crypto.monthlyChange.toFixed(1)}%</div>
                            <div class="change-7d">7d: ${crypto.weeklyChange && crypto.weeklyChange > 0 ? '+' : ''}${(crypto.weeklyChange || 0).toFixed(1)}%</div>
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
};

const generateAdvertiserSection = (): string => {
  const currentAdvertiser = advertiserService.getCurrentAdvertiser();
  
  if (currentAdvertiser) {
    const formatWeekRange = (startDate: string, endDate: string) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    };

    return `
            <div class="ad-section" style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: left;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div class="ad-label" style="font-size: 12px; color: #6b7280;">Sponsored Content</div>
                    <div style="font-size: 10px; color: #6b7280;">${formatWeekRange(currentAdvertiser.weekStartDate, currentAdvertiser.weekEndDate)}</div>
                </div>
                <h3 style="font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 10px;">${currentAdvertiser.companyName}</h3>
                <p style="color: #374151; line-height: 1.6; margin-bottom: 10px;">${currentAdvertiser.pitch}</p>
                <p style="color: #374151; line-height: 1.6; margin-bottom: 10px;">
                    <a href="${currentAdvertiser.website}" target="_blank" rel="noopener noreferrer" style="color: #1d4ed8; text-decoration: underline; font-weight: 500;">
                        Learn more about ${currentAdvertiser.companyName}
                    </a>
                </p>
                <div style="font-size: 10px; color: #6b7280; padding-top: 10px; border-top: 1px solid #d1d5db;">
                    This is a paid advertisement. Visit <a href="https://cryptomonth.info/advertise" style="color: #1d4ed8;">CryptoMonth.info</a> to learn more about advertising opportunities.
                </div>
            </div>
    `;
  } else {
    return `
            <div class="ad-section">
                <div class="ad-label">Advertisement</div>
                <p>If you would like to sponsor this newsletter, visit our <a href="https://cryptomonth.info/advertise" style="color: #1d4ed8;">advertiser portal</a></p>
            </div>
    `;
  }
};

export const generateNewsletterPreview = (cryptos: CryptoData[]): string => {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return generateNewsletterHTML({
    cryptos,
    weekDate: currentDate,
    baseUrl: 'https://cryptomonth.info'
  });
};