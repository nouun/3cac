# DISCLAIMER

### I am not responsible for any loss of financials, hair, or anything else that may happen while using this program. Like with anything related to trading cryptocurrencies, there is high risk and the chance to lose all your money.
## DO NOT TRADE WITH MONEY THAT YOU CAN'T AFFORD TO LOSE!

# 3Commas Auto-Change

3CAC is a little program which pulls data from [CryptoBubbles](https://cryptobubbles.net) and can update composite bots pairs based on certain filters.

## Prerequisites

- [Node.js v13 or later & NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

## Setup

1) Get an API key from [3Commas](https://3commas.io/api_access_tokens/new) with `Bots read`, `Bots write`, and `Accounts read`.
    - `Bots read`: Required to get a list of all bots
    - `Bots write`: Required to update bot pairs. (This can be disabled if using `readOnly`, see [config](#config) below.
    - `Accounts read`: Required to get connected exchanges to ensure that pairs are valid.
2) Clone the repository locally.
3) Copy the example config from `config.example.json` to `config.json`.
4) Edit the config to your liking, see [config](#config) below for value explanations.
5) Run the bot.
    - On Windows, double click the `run.bat` file.
    - On Linux or macOS, open a terminal and run `npm i` to install dependencies, then run `npm run start` to start

## Config

All comments with start with `//?` are optional and can be omitted.
Config is JSON5 so trailing commas, unquoted keys, and comments are all allowed.

```json5
{
  api: {
    threecommas: {
      key: "<key>",             //  3Commas API key
      secret: "<secret>",       //  3Commas API secret
    },
    lunarcrush: {               //? Either useLunarCRUSHed or key are required if using LunarCrush filters
      useLunarCRUSHed: true,    //? Use LunarCRUSHed to generate LunarCrush key
                                //    Remove these lines if using key as this
                                //    will override your key
      key: "<key>",             //? Your personal API LunarCrush key.
    },
  },
  updateTime: "1h 2m 3s",       //  Time between updates. E.g., "1h", "5m", "2m 30s", "1h 30m", etc.
  readOnly: false,              //? If true, pairs will only be printed and won't update bots
  bots: [                       //  List of bot rules
    {
      name: "Some Name",        //  The bot name, supports regex. For example, "\dAC$" will only
                                //                 match bots that end with a number then "AC"
      pairs: {
        min: 4,                 //? The minimum pairs (See stopBotIfNotEnough and startIfEnough)
        max: 10,                //? The maximum pairs, will cut off all others
        stopIfNotEnough: true,  //? Stop the bot if there are less than min pairs
        startIfEnough: true,    //? Start the bot if it's stopped and there are enough pairs now
        quote: "USDT",          //  The quote price. E.g., "BTC", "USDT", "BNB", etc.
        exclude: [              //? Base coins to always ignore
          "ELON",
          "SHIB",
          "SAFEMOON"
        ],
        include: [              //? Base coins to always add
          "MATIC",
          "MANA"
        ],
      },
      filter: {
        lunarcrush: {           //? To use any LunarCrush filters, you need
                                //    to setup either key or useLunarCRUSHed
                                //    under lunarcrush at the top
          altrank: 100,         //? Get the top X pairs based on AltRank:tm:
          galaxyscore: 100,     //? Get the top X pairs based on GalaxyScore:tm:
          volatility: 100,      //? Get the top X pairs based on volatility
        },
        performance: {
          sort: "day",          //  The performance option to sort results by
          min5: {               //? The min and max performance in the last 5 minutes
            min: 1,
            max: 2
          },
          min15: {              //? The min and max performance in the last 15 minutes
            min: 1,
            max: 2
          },
          hour: {               //? The min and max performance in the last hour
            min: 1,
            max: 2
          },
          day: {                //? The min and max performance in the last day
            min: 1,
            max: 2
          },
          week: {               //? The min and max performance in the last week
            min: 1,
            max: 2
          },
          month: {              //? The min and max performance in the last month
            min: 1,
            max: 2
          },
          year: {               //? The min and max performance in the last year
            min: 1,
            max: 2
          },
        },
        marketCap: {            //? The min and max market cap
          min: 1,
          max: 2
        },
        volume: {               //? The min and max volume
          min: 1,
          max: 2
        }
      }
    }
  ]
}
```

## Issues, Contributions, and Support

Contributions and feature requests are always welcomed.
If you need support with anything, feel free to message me on Discord under `Nouun#0246`.
If you have any issues you're welcome to message me on Discord but it would be preferred to use GitHub Issue.

### Donations

This is in no way at all required and I don't expect anything at all.
If you still want to, you can support my caffiene addiction with one of the addresses below.
Feel free to DM me on Discord if you would like a different wallet.

XLM: (Preferred)
  - Wallet: `GAJ4BSGJE6UQHZAZ5U5IUOABPDCYPKPS3RFS2NVNGFGFXGVQDLBQJW2P`
  - Memo: `1902282696`

BTC:
  - Wallet: `37NEtoQN7sYMcDaqvQ1qSfAEC4DLRatFMK`

ETH: (ERC20)
  - Wallet: `0x5ebc9894060d3a7e0ec4b82f7ddb038474097ae9`

