interface ThreeCommasOptions {
  key: string
  secret: string
}

interface LunarCrushOptions {
  key: string
  useLunarCRUSHed: boolean
}

interface ApiOptions {
  threecommas: ThreeCommasOptions
  lunarcrush?: LunarCrushOptions
}

interface MaxMin {
  max?: number
  min?: number
}

interface LunarCrushFilter {
  altrank?: number,
  galaxyscore?: number,
  volatility?: number
}

interface PerformanceOptions {
  sort?: "min5" | "min15" | "hour" | "day" | "week" | "month" | "year"
  min5?: MaxMin
  min15?: MaxMin
  hour?: MaxMin
  day?: MaxMin
  week?: MaxMin
  month?: MaxMin
  year?: MaxMin
}

interface FilterOptions {
  lunarcrush?: LunarCrushFilter
  performance?: PerformanceOptions
  marketCap?: MaxMin
  volume?: MaxMin
}

interface PairsOptions {
  stopIfNotEnough?: boolean
  startIfEnough?: boolean
  quote: string
  exclude?: string[]
  include?: string[]
}

interface BotOptions {
  name: string
  pairs: MaxMin & PairsOptions
  filter?: FilterOptions
}

interface Options {
  api: ApiOptions
  readOnly?: boolean
  forcedMode?: "real" | "paper"
  updateTime?: string
  bots?: BotOptions[]
}
