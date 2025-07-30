export interface Quote {
  text: string;
  source: string;
  date: string;
  link: string;
}

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  monthlyChange: number;
  weeklyChange?: number;
  mentions: number;
  sentiment: number;
  quotes: Quote[];
  exchanges?: string[];
}