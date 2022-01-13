import validate from "validate.js";

const constraints = {
  "api.threecommas.key": {
    presence: true,
    type: "string",
    length: { is: 64 },
  },
  "api.threecommas.secret": {
    presence: true,
    type: "string",
    length: { is: 200 },
  },
  "api.lunarcrush.useLunarCRUSHed": {
    presence: false,
    type: "boolean",
  },
  "api.lunarcrush.key": {
    presence: false,
    type: "string",
  },
  readOnly: {
    presence: false,
    type: "boolean",
  },
  forcedMode: {
    presence: false,
    type: "string",
    inclusion: [ "real", "paper" ],
  },
  updateTime: {
    presence: false,
    type: "string",
    format: {
      pattern: /(\d+ *d)? *(\d+ *h)? *(\d+ *m)? *(\d+ *s)?/,
      message: "should follow the format \"Xd Xh Xm Xs\"",
    },
  },
  bots: {
    presence: true,
    type: "array",
  },
};

validate.validators.regex = (value) => {
  try {
    new RegExp(value);
  } catch (e) {
    return `is not a valid RegExp (${e})`;
  }
};


const addMinMaxConstraints = (name: string, constraints: any) => {
  constraints[`${name}.min`] = {
    presence: false,
    type: "number",
  };
  constraints[`${name}.max`] = {
    presence: false,
    type: "number",
  };
};

const botConstraints = {
  name: {
    presence: true,
    type: "string",
    regex: true,
  },
  "pairs.stopIfNotEnough": {
    presence: false,
    type: "boolean",
  },
  "filter.performance.sort": {
    presence: false,
    type: "string",
    inclusion: [ "min5", "min15", "hour", "day", "week", "month", "year" ],
  },
  "pairs.quote": {
    presence: true,
    type: "string",
  },
  "pairs.exclude": {
    presence: false,
    type: "array",
  },
  "pairs.include": {
    presence: false,
    type: "array",
  },
  "filter.lunarcrush.altrank": {
    presence: false,
    type: "number",
  },
  "filter.lunarcrush.galaxyscore": {
    presence: false,
    type: "number",
  },
  "filter.lunarcrush.volatility": {
    presence: false,
    type: "number",
  },
};

addMinMaxConstraints("pairs", botConstraints);
addMinMaxConstraints("filter.performance.min5", botConstraints);
addMinMaxConstraints("filter.performance.min15", botConstraints);
addMinMaxConstraints("filter.performance.hour", botConstraints);
addMinMaxConstraints("filter.performance.day", botConstraints);
addMinMaxConstraints("filter.performance.week", botConstraints);
addMinMaxConstraints("filter.performance.month", botConstraints);
addMinMaxConstraints("filter.performance.year", botConstraints);
addMinMaxConstraints("filter.marketCap", botConstraints);
addMinMaxConstraints("filter.volume", botConstraints);

const validatorConfig = { format: "flat" };

const printErrors = (errors: string[]) => {
  console.error("!! Config error");
  errors.forEach((error) => console.error(`!!   ${error}`));
};

type Validation = string[] | undefined;

export const validateConfig = (config: Options): any => {
  let results: string[] =
    (<Validation>validate.validate(config, constraints, validatorConfig))
    ?? [];

  if (config.bots) {
    const botResults = config.bots
      .flatMap((bot) => {
        const botResults = <Validation>validate
          .validate(bot, botConstraints, validatorConfig);

        if (botResults && botResults.length > 0) {
          botResults.splice(0, 0, `Bot: ${bot.name ?? "name missing"}`);
        }

        return botResults;
      })
      .filter((result) => !!result);

    if (botResults.length > 0) {
      results = results.concat(botResults);
    }
  }

  if (results?.length > 0) {
    printErrors(results);
  }

  return results?.length == 0;
};
