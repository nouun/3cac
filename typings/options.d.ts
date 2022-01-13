interface ApiOptions {
  key: string
  secret: string
}

interface MaxMin {
  max?: number
  min?: number
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
