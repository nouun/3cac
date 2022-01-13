interface PerformanceData {
  min5: number
  min15: number
  hour: number
  day: number
  week: number
  month: number
  year: number
}

interface Data {
  price: number
  marketcap: number
  volume: number
  performance: PerformanceData
}

interface CurrencyData {
  usd: Data
  aud: Data
  cad: Data
  eur: Data
  gbp: Data
  pln: Data
  rub: Data
  inr: Data
  try: Data
  btc: Data
  eth: Data
}

interface Bubble {
  id: string
  name: string
  slug: string
  rank: number
  symbol: string
  idCoinGecko: string
  binanceSymbol?: string
  kucoinSymbol?: string
  image: string
  dominance: number
  data: CurrencyData
}

