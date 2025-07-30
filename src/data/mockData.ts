import type { CryptoData } from '../types/crypto';

export const mockCryptoData: CryptoData[] = [
  // TOP GAINERS (25)
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    currentPrice: 145.67,
    monthlyChange: 67.8,
    mentions: 1247,
    sentiment: 2.8,
    quotes: [
      {
        text: "Solana's ecosystem continues to expand with major DeFi protocols launching on the network, driving significant adoption.",
        source: 'CryptoNews Daily',
        date: '2025-07-28',
        link: 'https://example.com/solana-news-1'
      },
      {
        text: "Transaction speeds and low fees make Solana an attractive alternative for institutional investors.",
        source: 'Blockchain Today',
        date: '2025-07-25',
        link: 'https://example.com/solana-news-2'
      },
      {
        text: "Several Fortune 500 companies are exploring Solana for their Web3 initiatives.",
        source: 'TechCrypto',
        date: '2025-07-22',
        link: 'https://example.com/solana-news-3'
      }
    ]
  },
  {
    id: 'sui',
    name: 'Sui',
    symbol: 'SUI',
    currentPrice: 2.34,
    monthlyChange: 58.9,
    mentions: 892,
    sentiment: 2.5,
    quotes: [
      {
        text: "Sui's Move programming language attracts developers building next-generation DeFi applications.",
        source: 'DeFi Weekly',
        date: '2025-07-29',
        link: 'https://example.com/sui-news-1'
      },
      {
        text: "Gaming partnerships drive Sui adoption as blockchain gaming enters mainstream.",
        source: 'Gaming Crypto',
        date: '2025-07-26',
        link: 'https://example.com/sui-news-2'
      }
    ]
  },
  {
    id: 'aptos',
    name: 'Aptos',
    symbol: 'APT',
    currentPrice: 12.45,
    monthlyChange: 52.3,
    mentions: 734,
    sentiment: 2.2,
    quotes: [
      {
        text: "Aptos achieves record transaction throughput, positioning itself as Ethereum's fastest competitor.",
        source: 'Blockchain Performance',
        date: '2025-07-30',
        link: 'https://example.com/aptos-news-1'
      },
      {
        text: "Major exchanges announce native Aptos staking rewards, boosting ecosystem growth.",
        source: 'Exchange News',
        date: '2025-07-24',
        link: 'https://example.com/aptos-news-2'
      }
    ]
  },
  {
    id: 'chainlink',
    name: 'Chainlink',
    symbol: 'LINK',
    currentPrice: 28.94,
    monthlyChange: 48.7,
    mentions: 1156,
    sentiment: 2.1,
    quotes: [
      {
        text: "Chainlink's oracle network sees unprecedented demand as more DeFi protocols integrate real-world data.",
        source: 'DeFi Weekly',
        date: '2025-07-27',
        link: 'https://example.com/chainlink-news-1'
      },
      {
        text: "Major banks are piloting Chainlink's Cross-Chain Interoperability Protocol for international transfers.",
        source: 'Financial Crypto',
        date: '2025-07-24',
        link: 'https://example.com/chainlink-news-2'
      }
    ]
  },
  {
    id: 'injective',
    name: 'Injective Protocol',
    symbol: 'INJ',
    currentPrice: 34.67,
    monthlyChange: 45.2,
    mentions: 623,
    sentiment: 2.0,
    quotes: [
      {
        text: "Injective's decentralized derivatives trading sees explosive growth among institutional traders.",
        source: 'Derivatives Today',
        date: '2025-07-28',
        link: 'https://example.com/injective-news-1'
      },
      {
        text: "Cross-chain compatibility makes Injective the go-to platform for multi-asset trading strategies.",
        source: 'Trading Weekly',
        date: '2025-07-21',
        link: 'https://example.com/injective-news-2'
      }
    ]
  },
  {
    id: 'kaspa',
    name: 'Kaspa',
    symbol: 'KAS',
    currentPrice: 0.089,
    monthlyChange: 42.8,
    mentions: 445,
    sentiment: 1.9,
    quotes: [
      {
        text: "Kaspa's BlockDAG technology offers unprecedented scalability without compromising decentralization.",
        source: 'Tech Innovation',
        date: '2025-07-29',
        link: 'https://example.com/kaspa-news-1'
      },
      {
        text: "Mining community embraces Kaspa as the most profitable proof-of-work alternative.",
        source: 'Mining Report',
        date: '2025-07-23',
        link: 'https://example.com/kaspa-news-2'
      }
    ]
  },
  {
    id: 'render',
    name: 'Render Token',
    symbol: 'RNDR',
    currentPrice: 8.92,
    monthlyChange: 39.4,
    mentions: 567,
    sentiment: 1.8,
    quotes: [
      {
        text: "AI boom drives massive demand for Render's decentralized GPU computing network.",
        source: 'AI Computing',
        date: '2025-07-30',
        link: 'https://example.com/render-news-1'
      },
      {
        text: "Hollywood studios adopt Render for cost-effective 3D rendering and visual effects production.",
        source: 'Entertainment Tech',
        date: '2025-07-25',
        link: 'https://example.com/render-news-2'
      }
    ]
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    currentPrice: 1.23,
    monthlyChange: 36.4,
    mentions: 1089,
    sentiment: 1.7,
    quotes: [
      {
        text: "Polygon's zkEVM solution is gaining traction among enterprise clients looking for scalable blockchain solutions.",
        source: 'Enterprise Blockchain',
        date: '2025-07-26',
        link: 'https://example.com/polygon-news-1'
      },
      {
        text: "Gaming companies are increasingly choosing Polygon for NFT marketplaces due to low transaction costs.",
        source: 'Gaming Crypto',
        date: '2025-07-23',
        link: 'https://example.com/polygon-news-2'
      }
    ]
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    symbol: 'ARB',
    currentPrice: 1.45,
    monthlyChange: 34.1,
    mentions: 823,
    sentiment: 1.6,
    quotes: [
      {
        text: "Arbitrum leads Layer 2 adoption with highest TVL and most active developer ecosystem.",
        source: 'L2 Analytics',
        date: '2025-07-27',
        link: 'https://example.com/arbitrum-news-1'
      },
      {
        text: "Major DeFi protocols migrate to Arbitrum citing superior user experience and lower fees.",
        source: 'DeFi Migration',
        date: '2025-07-20',
        link: 'https://example.com/arbitrum-news-2'
      }
    ]
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    symbol: 'AVAX',
    currentPrice: 45.23,
    monthlyChange: 31.9,
    mentions: 756,
    sentiment: 1.5,
    quotes: [
      {
        text: "Avalanche's subnet architecture is attracting institutional adoption for private blockchain networks.",
        source: 'Institutional Crypto',
        date: '2025-07-25',
        link: 'https://example.com/avalanche-news-1'
      },
      {
        text: "New subnet launches on Avalanche target enterprise supply chain management solutions.",
        source: 'Supply Chain Tech',
        date: '2025-07-19',
        link: 'https://example.com/avalanche-news-2'
      }
    ]
  },
  {
    id: 'optimism',
    name: 'Optimism',
    symbol: 'OP',
    currentPrice: 2.67,
    monthlyChange: 29.3,
    mentions: 634,
    sentiment: 1.4,
    quotes: [
      {
        text: "Optimism's governance token gains utility as ecosystem projects integrate OP rewards.",
        source: 'Governance Weekly',
        date: '2025-07-28',
        link: 'https://example.com/optimism-news-1'
      },
      {
        text: "Superchain vision attracts major protocols to build on Optimism's infrastructure.",
        source: 'Infrastructure News',
        date: '2025-07-22',
        link: 'https://example.com/optimism-news-2'
      }
    ]
  },
  {
    id: 'fantom',
    name: 'Fantom',
    symbol: 'FTM',
    currentPrice: 0.78,
    monthlyChange: 27.8,
    mentions: 445,
    sentiment: 1.3,
    quotes: [
      {
        text: "Fantom's Sonic upgrade promises to revolutionize DeFi with sub-second finality.",
        source: 'DeFi Tech',
        date: '2025-07-29',
        link: 'https://example.com/fantom-news-1'
      },
      {
        text: "European enterprises choose Fantom for supply chain transparency initiatives.",
        source: 'Enterprise Europe',
        date: '2025-07-24',
        link: 'https://example.com/fantom-news-2'
      }
    ]
  },
  {
    id: 'near',
    name: 'NEAR Protocol',
    symbol: 'NEAR',
    currentPrice: 6.34,
    monthlyChange: 25.6,
    mentions: 567,
    sentiment: 1.2,
    quotes: [
      {
        text: "NEAR's JavaScript SDK makes blockchain development accessible to millions of web developers.",
        source: 'Developer Tools',
        date: '2025-07-26',
        link: 'https://example.com/near-news-1'
      },
      {
        text: "Nightshade sharding enables NEAR to process thousands of transactions per second.",
        source: 'Scalability Report',
        date: '2025-07-21',
        link: 'https://example.com/near-news-2'
      }
    ]
  },
  {
    id: 'cosmos',
    name: 'Cosmos',
    symbol: 'ATOM',
    currentPrice: 12.89,
    monthlyChange: 23.4,
    mentions: 689,
    sentiment: 1.1,
    quotes: [
      {
        text: "Inter-Blockchain Communication protocol sees record adoption as chains seek interoperability.",
        source: 'Interop Weekly',
        date: '2025-07-27',
        link: 'https://example.com/cosmos-news-1'
      },
      {
        text: "Cosmos Hub 2.0 upgrade introduces liquid staking and enhanced security features.",
        source: 'Staking News',
        date: '2025-07-23',
        link: 'https://example.com/cosmos-news-2'
      }
    ]
  },
  {
    id: 'algorand',
    name: 'Algorand',
    symbol: 'ALGO',
    currentPrice: 0.34,
    monthlyChange: 21.7,
    mentions: 423,
    sentiment: 1.0,
    quotes: [
      {
        text: "Central banks pilot Algorand for digital currency infrastructure due to carbon neutrality.",
        source: 'CBDC Report',
        date: '2025-07-28',
        link: 'https://example.com/algorand-news-1'
      },
      {
        text: "Algorand's pure proof-of-stake achieves true decentralization without energy waste.",
        source: 'Green Crypto',
        date: '2025-07-20',
        link: 'https://example.com/algorand-news-2'
      }
    ]
  },
  {
    id: 'hedera',
    name: 'Hedera',
    symbol: 'HBAR',
    currentPrice: 0.089,
    monthlyChange: 19.8,
    mentions: 356,
    sentiment: 0.9,
    quotes: [
      {
        text: "Enterprise adoption accelerates as Hedera's hashgraph technology proves enterprise-ready.",
        source: 'Enterprise Adoption',
        date: '2025-07-29',
        link: 'https://example.com/hedera-news-1'
      },
      {
        text: "Google Cloud partnership expands Hedera's reach in enterprise blockchain solutions.",
        source: 'Cloud Computing',
        date: '2025-07-25',
        link: 'https://example.com/hedera-news-2'
      }
    ]
  },
  {
    id: 'flow',
    name: 'Flow',
    symbol: 'FLOW',
    currentPrice: 1.23,
    monthlyChange: 18.2,
    mentions: 289,
    sentiment: 0.8,
    quotes: [
      {
        text: "NBA Top Shot success drives continued adoption of Flow for sports collectibles.",
        source: 'Sports NFT',
        date: '2025-07-26',
        link: 'https://example.com/flow-news-1'
      },
      {
        text: "Flow's developer-friendly architecture attracts mainstream brands to Web3.",
        source: 'Brand Adoption',
        date: '2025-07-22',
        link: 'https://example.com/flow-news-2'
      }
    ]
  },
  {
    id: 'tezos',
    name: 'Tezos',
    symbol: 'XTZ',
    currentPrice: 1.45,
    monthlyChange: 16.9,
    mentions: 334,
    sentiment: 0.7,
    quotes: [
      {
        text: "Tezos' self-amending blockchain eliminates hard forks, attracting institutional interest.",
        source: 'Institutional Focus',
        date: '2025-07-27',
        link: 'https://example.com/tezos-news-1'
      },
      {
        text: "Art galleries embrace Tezos for eco-friendly NFT platforms with minimal energy consumption.",
        source: 'Art & Culture',
        date: '2025-07-24',
        link: 'https://example.com/tezos-news-2'
      }
    ]
  },
  {
    id: 'elrond',
    name: 'MultiversX',
    symbol: 'EGLD',
    currentPrice: 67.89,
    monthlyChange: 15.3,
    mentions: 267,
    sentiment: 0.6,
    quotes: [
      {
        text: "MultiversX rebranding signals ambitious expansion into metaverse infrastructure.",
        source: 'Metaverse Today',
        date: '2025-07-28',
        link: 'https://example.com/multiversx-news-1'
      },
      {
        text: "Adaptive state sharding makes MultiversX one of the fastest blockchain networks.",
        source: 'Performance Analysis',
        date: '2025-07-21',
        link: 'https://example.com/multiversx-news-2'
      }
    ]
  },
  {
    id: 'icp',
    name: 'Internet Computer',
    symbol: 'ICP',
    currentPrice: 8.45,
    monthlyChange: 13.7,
    mentions: 445,
    sentiment: 0.5,
    quotes: [
      {
        text: "Internet Computer's canister smart contracts enable full-stack decentralized applications.",
        source: 'dApp Development',
        date: '2025-07-29',
        link: 'https://example.com/icp-news-1'
      },
      {
        text: "Web3 social media platforms choose Internet Computer for censorship-resistant hosting.",
        source: 'Social Web3',
        date: '2025-07-23',
        link: 'https://example.com/icp-news-2'
      }
    ]
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    currentPrice: 0.56,
    monthlyChange: 12.4,
    mentions: 892,
    sentiment: 0.4,
    quotes: [
      {
        text: "Cardano's Hydra scaling solution enters final testing phase before mainnet deployment.",
        source: 'Scaling Solutions',
        date: '2025-07-30',
        link: 'https://example.com/cardano-news-1'
      },
      {
        text: "Academic partnerships strengthen Cardano's research-driven approach to blockchain development.",
        source: 'Academic Blockchain',
        date: '2025-07-25',
        link: 'https://example.com/cardano-news-2'
      }
    ]
  },
  {
    id: 'polkadot',
    name: 'Polkadot',
    symbol: 'DOT',
    currentPrice: 7.23,
    monthlyChange: 10.8,
    mentions: 756,
    sentiment: 0.3,
    quotes: [
      {
        text: "Parachain auctions continue to drive innovation in Polkadot's multi-chain ecosystem.",
        source: 'Parachain News',
        date: '2025-07-26',
        link: 'https://example.com/polkadot-news-1'
      },
      {
        text: "Cross-chain messaging enables seamless asset transfers between Polkadot parachains.",
        source: 'Cross-Chain Tech',
        date: '2025-07-22',
        link: 'https://example.com/polkadot-news-2'
      }
    ]
  },
  {
    id: 'stellar',
    name: 'Stellar',
    symbol: 'XLM',
    currentPrice: 0.12,
    monthlyChange: 9.2,
    mentions: 423,
    sentiment: 0.2,
    quotes: [
      {
        text: "Stellar's partnership with MoneyGram expands cross-border payment capabilities globally.",
        source: 'Payments Weekly',
        date: '2025-07-27',
        link: 'https://example.com/stellar-news-1'
      },
      {
        text: "Central banks explore Stellar for efficient international settlement infrastructure.",
        source: 'Banking Innovation',
        date: '2025-07-24',
        link: 'https://example.com/stellar-news-2'
      }
    ]
  },
  {
    id: 'vechain',
    name: 'VeChain',
    symbol: 'VET',
    currentPrice: 0.034,
    monthlyChange: 7.6,
    mentions: 334,
    sentiment: 0.1,
    quotes: [
      {
        text: "Supply chain transparency solutions drive VeChain adoption among Fortune 500 companies.",
        source: 'Supply Chain Weekly',
        date: '2025-07-28',
        link: 'https://example.com/vechain-news-1'
      },
      {
        text: "Sustainability tracking becomes mandatory, positioning VeChain as essential infrastructure.",
        source: 'Sustainability Tech',
        date: '2025-07-20',
        link: 'https://example.com/vechain-news-2'
      }
    ]
  },
  {
    id: 'theta',
    name: 'Theta Network',
    symbol: 'THETA',
    currentPrice: 1.89,
    monthlyChange: 5.4,
    mentions: 267,
    sentiment: 0.0,
    quotes: [
      {
        text: "Decentralized video streaming gains momentum as content creators seek platform alternatives.",
        source: 'Streaming Tech',
        date: '2025-07-29',
        link: 'https://example.com/theta-news-1'
      },
      {
        text: "Edge computing rewards incentivize global participation in Theta's content delivery network.",
        source: 'Edge Computing',
        date: '2025-07-23',
        link: 'https://example.com/theta-news-2'
      }
    ]
  },

  // TOP LOSERS (25)
  {
    id: 'terra-luna',
    name: 'Terra Luna Classic',
    symbol: 'LUNC',
    currentPrice: 0.000134,
    monthlyChange: -45.8,
    mentions: 1234,
    sentiment: -2.8,
    quotes: [
      {
        text: "Community-led revival efforts face significant challenges as regulatory scrutiny continues.",
        source: 'Crypto Recovery',
        date: '2025-07-29',
        link: 'https://example.com/luna-news-1'
      },
      {
        text: "Despite community efforts, institutional confidence remains low following previous collapse.",
        source: 'Risk Analysis',
        date: '2025-07-21',
        link: 'https://example.com/luna-news-2'
      },
      {
        text: "Legal challenges mount as former executives face additional charges in ongoing investigations.",
        source: 'Legal Crypto News',
        date: '2025-07-15',
        link: 'https://example.com/luna-news-3'
      }
    ]
  },
  {
    id: 'celsius',
    name: 'Celsius Network',
    symbol: 'CEL',
    currentPrice: 0.12,
    monthlyChange: -42.5,
    mentions: 892,
    sentiment: -2.5,
    quotes: [
      {
        text: "Bankruptcy proceedings continue to weigh heavily on token value and investor sentiment.",
        source: 'Legal Crypto',
        date: '2025-07-30',
        link: 'https://example.com/celsius-news-1'
      },
      {
        text: "Creditors await resolution as liquidation process drags on through 2025.",
        source: 'Bankruptcy News',
        date: '2025-07-24',
        link: 'https://example.com/celsius-news-2'
      },
      {
        text: "Court approves partial asset recovery plan, but timeline remains uncertain for full resolution.",
        source: 'Court Reporter',
        date: '2025-07-16',
        link: 'https://example.com/celsius-news-3'
      }
    ]
  },
  {
    id: 'voyager',
    name: 'Voyager Token',
    symbol: 'VGX',
    currentPrice: 0.045,
    monthlyChange: -38.9,
    mentions: 567,
    sentiment: -2.2,
    quotes: [
      {
        text: "Voyager's bankruptcy resolution continues to impact token holders and market confidence.",
        source: 'Bankruptcy Watch',
        date: '2025-07-28',
        link: 'https://example.com/voyager-news-1'
      },
      {
        text: "Asset recovery efforts face delays as legal proceedings extend into late 2025.",
        source: 'Legal Updates',
        date: '2025-07-22',
        link: 'https://example.com/voyager-news-2'
      }
    ]
  },
  {
    id: 'ftx-token',
    name: 'FTX Token',
    symbol: 'FTT',
    currentPrice: 1.23,
    monthlyChange: -35.7,
    mentions: 1456,
    sentiment: -2.1,
    quotes: [
      {
        text: "FTX bankruptcy proceedings reveal additional creditor claims, extending recovery timeline.",
        source: 'Bankruptcy Analysis',
        date: '2025-07-29',
        link: 'https://example.com/ftt-news-1'
      },
      {
        text: "Former executives face additional criminal charges in ongoing federal investigation.",
        source: 'Criminal Justice',
        date: '2025-07-25',
        link: 'https://example.com/ftt-news-2'
      },
      {
        text: "Creditor committee disputes asset valuation methods in bankruptcy court filings.",
        source: 'Legal Proceedings',
        date: '2025-07-18',
        link: 'https://example.com/ftt-news-3'
      }
    ]
  },
  {
    id: 'swipe',
    name: 'Swipe',
    symbol: 'SXP',
    currentPrice: 0.67,
    monthlyChange: -32.4,
    mentions: 234,
    sentiment: -1.9,
    quotes: [
      {
        text: "Market uncertainty continues to impact tokens associated with troubled exchanges.",
        source: 'Market Watch',
        date: '2025-07-26',
        link: 'https://example.com/sxp-news-1'
      },
      {
        text: "Regulatory pressure increases on payment tokens with unclear compliance status.",
        source: 'Regulatory Update',
        date: '2025-07-17',
        link: 'https://example.com/sxp-news-2'
      }
    ]
  },
  {
    id: 'iron-finance',
    name: 'Iron Finance',
    symbol: 'ICE',
    currentPrice: 0.0023,
    monthlyChange: -29.8,
    mentions: 189,
    sentiment: -1.8,
    quotes: [
      {
        text: "Algorithmic stablecoin experiments continue to face skepticism from institutional investors.",
        source: 'Stablecoin Analysis',
        date: '2025-07-27',
        link: 'https://example.com/iron-news-1'
      },
      {
        text: "DeFi protocol risks remain elevated as market volatility tests algorithmic mechanisms.",
        source: 'DeFi Risk Report',
        date: '2025-07-20',
        link: 'https://example.com/iron-news-2'
      }
    ]
  },
  {
    id: 'safemoon',
    name: 'SafeMoon',
    symbol: 'SAFEMOON',
    currentPrice: 0.00034,
    monthlyChange: -27.6,
    mentions: 445,
    sentiment: -1.7,
    quotes: [
      {
        text: "Meme token enthusiasm wanes as investors focus on utility-driven cryptocurrency projects.",
        source: 'Meme Token Watch',
        date: '2025-07-28',
        link: 'https://example.com/safemoon-news-1'
      },
      {
        text: "Regulatory scrutiny increases on tokens with unclear utility and governance structures.",
        source: 'Regulatory Focus',
        date: '2025-07-23',
        link: 'https://example.com/safemoon-news-2'
      }
    ]
  },
  {
    id: 'bitcoin-cash',
    name: 'Bitcoin Cash',
    symbol: 'BCH',
    currentPrice: 234.56,
    monthlyChange: -25.7,
    mentions: 678,
    sentiment: -1.6,
    quotes: [
      {
        text: "Adoption challenges persist as Bitcoin Cash struggles to differentiate itself in the payments space.",
        source: 'Payment Analysis',
        date: '2025-07-22',
        link: 'https://example.com/bch-news-1'
      },
      {
        text: "Merchant adoption rates decline as businesses pivot to more established payment solutions.",
        source: 'Merchant Weekly',
        date: '2025-07-18',
        link: 'https://example.com/bch-news-2'
      }
    ]
  },
  {
    id: 'bitcoin-sv',
    name: 'Bitcoin SV',
    symbol: 'BSV',
    currentPrice: 45.67,
    monthlyChange: -23.9,
    mentions: 334,
    sentiment: -1.5,
    quotes: [
      {
        text: "Legal controversies continue to overshadow Bitcoin SV's technical development efforts.",
        source: 'Legal Crypto',
        date: '2025-07-29',
        link: 'https://example.com/bsv-news-1'
      },
      {
        text: "Exchange delistings reduce liquidity and accessibility for Bitcoin SV trading.",
        source: 'Exchange News',
        date: '2025-07-24',
        link: 'https://example.com/bsv-news-2'
      }
    ]
  },
  {
    id: 'eos',
    name: 'EOS',
    symbol: 'EOS',
    currentPrice: 1.23,
    monthlyChange: -22.1,
    mentions: 456,
    sentiment: -1.4,
    quotes: [
      {
        text: "Developer activity continues to decline as EOS faces competition from newer blockchain platforms.",
        source: 'Developer Metrics',
        date: '2025-07-26',
        link: 'https://example.com/eos-news-1'
      },
      {
        text: "Governance disputes and technical challenges hinder EOS ecosystem growth initiatives.",
        source: 'Governance Weekly',
        date: '2025-07-21',
        link: 'https://example.com/eos-news-2'
      }
    ]
  },
  {
    id: 'tron',
    name: 'TRON',
    symbol: 'TRX',
    currentPrice: 0.089,
    monthlyChange: -20.8,
    mentions: 567,
    sentiment: -1.3,
    quotes: [
      {
        text: "TRON faces increased regulatory scrutiny in multiple jurisdictions over compliance concerns.",
        source: 'Regulatory Watch',
        date: '2025-07-27',
        link: 'https://example.com/tron-news-1'
      },
      {
        text: "DApp migration to other platforms reduces TRON's total value locked and user activity.",
        source: 'DApp Analytics',
        date: '2025-07-19',
        link: 'https://example.com/tron-news-2'
      }
    ]
  },
  {
    id: 'neo',
    name: 'Neo',
    symbol: 'NEO',
    currentPrice: 12.45,
    monthlyChange: -19.3,
    mentions: 289,
    sentiment: -1.2,
    quotes: [
      {
        text: "Neo's smart economy vision struggles to gain traction amid fierce blockchain competition.",
        source: 'Smart Economy',
        date: '2025-07-28',
        link: 'https://example.com/neo-news-1'
      },
      {
        text: "Developer adoption remains limited as newer platforms offer superior development tools.",
        source: 'Developer Tools',
        date: '2025-07-23',
        link: 'https://example.com/neo-news-2'
      }
    ]
  },
  {
    id: 'waves',
    name: 'Waves',
    symbol: 'WAVES',
    currentPrice: 2.34,
    monthlyChange: -18.7,
    mentions: 223,
    sentiment: -1.1,
    quotes: [
      {
        text: "Waves ecosystem faces challenges as key projects migrate to alternative blockchain platforms.",
        source: 'Ecosystem Analysis',
        date: '2025-07-29',
        link: 'https://example.com/waves-news-1'
      },
      {
        text: "Stablecoin controversies continue to impact Waves platform credibility and adoption.",
        source: 'Stablecoin Issues',
        date: '2025-07-25',
        link: 'https://example.com/waves-news-2'
      }
    ]
  },
  {
    id: 'qtum',
    name: 'Qtum',
    symbol: 'QTUM',
    currentPrice: 3.45,
    monthlyChange: -17.2,
    mentions: 167,
    sentiment: -1.0,
    quotes: [
      {
        text: "Qtum's hybrid blockchain approach loses relevance as pure solutions gain market preference.",
        source: 'Blockchain Architecture',
        date: '2025-07-26',
        link: 'https://example.com/qtum-news-1'
      },
      {
        text: "Enterprise partnerships fail to materialize into significant platform adoption or usage.",
        source: 'Enterprise Adoption',
        date: '2025-07-22',
        link: 'https://example.com/qtum-news-2'
      }
    ]
  },
  {
    id: 'ontology',
    name: 'Ontology',
    symbol: 'ONT',
    currentPrice: 0.45,
    monthlyChange: -16.4,
    mentions: 145,
    sentiment: -0.9,
    quotes: [
      {
        text: "Identity management solutions face adoption challenges in competitive Web3 infrastructure market.",
        source: 'Identity Tech',
        date: '2025-07-27',
        link: 'https://example.com/ontology-news-1'
      },
      {
        text: "Partnership announcements fail to translate into measurable ecosystem growth or token utility.",
        source: 'Partnership Analysis',
        date: '2025-07-20',
        link: 'https://example.com/ontology-news-2'
      }
    ]
  },
  {
    id: 'zilliqa',
    name: 'Zilliqa',
    symbol: 'ZIL',
    currentPrice: 0.023,
    monthlyChange: -15.8,
    mentions: 198,
    sentiment: -0.8,
    quotes: [
      {
        text: "Sharding technology advantages diminish as Layer 2 solutions provide superior scalability.",
        source: 'Scalability Comparison',
        date: '2025-07-28',
        link: 'https://example.com/zilliqa-news-1'
      },
      {
        text: "Gaming initiatives struggle to compete with established blockchain gaming platforms.",
        source: 'Gaming Blockchain',
        date: '2025-07-24',
        link: 'https://example.com/zilliqa-news-2'
      }
    ]
  },
  {
    id: 'verge',
    name: 'Verge',
    symbol: 'XVG',
    currentPrice: 0.0067,
    monthlyChange: -14.9,
    mentions: 123,
    sentiment: -0.7,
    quotes: [
      {
        text: "Privacy coin regulations create uncertainty for Verge's future exchange listings and adoption.",
        source: 'Privacy Coins',
        date: '2025-07-29',
        link: 'https://example.com/verge-news-1'
      },
      {
        text: "Technical development slows as core team faces funding and resource constraints.",
        source: 'Development Update',
        date: '2025-07-21',
        link: 'https://example.com/verge-news-2'
      }
    ]
  },
  {
    id: 'digibyte',
    name: 'DigiByte',
    symbol: 'DGB',
    currentPrice: 0.012,
    monthlyChange: -13.6,
    mentions: 156,
    sentiment: -0.6,
    quotes: [
      {
        text: "DigiByte's security features fail to attract significant enterprise or institutional interest.",
        source: 'Security Analysis',
        date: '2025-07-26',
        link: 'https://example.com/digibyte-news-1'
      },
      {
        text: "Marketing efforts struggle to differentiate DigiByte in crowded cryptocurrency landscape.",
        source: 'Marketing Review',
        date: '2025-07-23',
        link: 'https://example.com/digibyte-news-2'
      }
    ]
  },
  {
    id: 'ravencoin',
    name: 'Ravencoin',
    symbol: 'RVN',
    currentPrice: 0.034,
    monthlyChange: -12.7,
    mentions: 189,
    sentiment: -0.5,
    quotes: [
      {
        text: "Asset tokenization use cases remain limited as institutional solutions gain market preference.",
        source: 'Tokenization Market',
        date: '2025-07-27',
        link: 'https://example.com/ravencoin-news-1'
      },
      {
        text: "Mining community support weakens as more profitable alternatives emerge in the market.",
        source: 'Mining Economics',
        date: '2025-07-19',
        link: 'https://example.com/ravencoin-news-2'
      }
    ]
  },
  {
    id: 'horizen',
    name: 'Horizen',
    symbol: 'ZEN',
    currentPrice: 8.90,
    monthlyChange: -11.8,
    mentions: 134,
    sentiment: -0.4,
    quotes: [
      {
        text: "Privacy-focused blockchain solutions face regulatory headwinds in major cryptocurrency markets.",
        source: 'Privacy Regulation',
        date: '2025-07-28',
        link: 'https://example.com/horizen-news-1'
      },
      {
        text: "Sidechain development progress slows as team focuses on compliance and regulatory issues.",
        source: 'Development Progress',
        date: '2025-07-25',
        link: 'https://example.com/horizen-news-2'
      }
    ]
  },
  {
    id: 'decred',
    name: 'Decred',
    symbol: 'DCR',
    currentPrice: 23.45,
    monthlyChange: -10.9,
    mentions: 167,
    sentiment: -0.3,
    quotes: [
      {
        text: "Hybrid consensus mechanism fails to gain widespread adoption despite technical advantages.",
        source: 'Consensus Mechanisms',
        date: '2025-07-29',
        link: 'https://example.com/decred-news-1'
      },
      {
        text: "Governance innovations struggle to attract developer interest in competitive blockchain space.",
        source: 'Governance Innovation',
        date: '2025-07-22',
        link: 'https://example.com/decred-news-2'
      }
    ]
  },
  {
    id: 'siacoin',
    name: 'Siacoin',
    symbol: 'SC',
    currentPrice: 0.0045,
    monthlyChange: -9.7,
    mentions: 145,
    sentiment: -0.2,
    quotes: [
      {
        text: "Decentralized storage market faces intense competition from established cloud providers.",
        source: 'Storage Market',
        date: '2025-07-26',
        link: 'https://example.com/siacoin-news-1'
      },
      {
        text: "User adoption remains limited as interface complexity hinders mainstream accessibility.",
        source: 'User Experience',
        date: '2025-07-24',
        link: 'https://example.com/siacoin-news-2'
      }
    ]
  },
  {
    id: 'bytecoin',
    name: 'Bytecoin',
    symbol: 'BCN',
    currentPrice: 0.00023,
    monthlyChange: -8.4,
    mentions: 89,
    sentiment: -0.1,
    quotes: [
      {
        text: "Privacy coin sector consolidation leaves smaller projects struggling for market relevance.",
        source: 'Privacy Sector',
        date: '2025-07-27',
        link: 'https://example.com/bytecoin-news-1'
      },
      {
        text: "Development activity remains minimal as community interest continues to decline steadily.",
        source: 'Community Analysis',
        date: '2025-07-21',
        link: 'https://example.com/bytecoin-news-2'
      }
    ]
  },
  {
    id: 'electroneum',
    name: 'Electroneum',
    symbol: 'ETN',
    currentPrice: 0.0034,
    monthlyChange: -7.2,
    mentions: 112,
    sentiment: 0.0,
    quotes: [
      {
        text: "Mobile mining concept loses appeal as smartphone cryptocurrency mining proves economically unviable.",
        source: 'Mobile Mining',
        date: '2025-07-28',
        link: 'https://example.com/electroneum-news-1'
      },
      {
        text: "Partnership initiatives in developing markets show limited traction and measurable impact.",
        source: 'Emerging Markets',
        date: '2025-07-23',
        link: 'https://example.com/electroneum-news-2'
      }
    ]
  }
];