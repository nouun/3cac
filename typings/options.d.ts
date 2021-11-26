interface ApiOptions {
  key: string
  secret: string
}

interface MaxMin {
  max?: number
  min?: number
}

interface PerformanceOptions {
  sort?: "hour" | "day" | "week" | "month" | "year"
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
