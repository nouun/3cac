import { API } from "3commas-typescript";
import { fetchBubbles } from "./lib.js";
import { readFileSync, readdirSync } from "fs";
import { validateConfig } from "./validator.js";
import JSON5 from "json5";
const files = readdirSync("./");
if (!(files.includes("config.json") || files.includes("config.json5"))) {
    throw "Please copy example config from \"config.example.json5\" to \"config.json5\" and configure your settings.";
}
if (files.includes("config.json") && !files.includes("config.json5")) {
    console.log("WARNING: \"config.json\" will soon be deprecated, please rename to \"config.json5\" to ensure nothing breaks in the future.");
}
const fileName = files.includes("config.json5") ? "./config.json5" : "./config.json";
const rawdata = readFileSync(fileName).toString();
const config = JSON5.parse(rawdata);
const api = new API({
    key: config.api.key,
    secrets: config.api.secret,
    forcedMode: config.forcedMode,
    errorHandler: (response, reject) => {
        const { error, error_description } = response;
        reject(new Error(error_description ?? error));
    },
});
const getValidBots = async () => {
    const bots = await api.getBots();
    const promises = bots
        .map(async (bot) => {
        const botConfig = config.bots
            ?.filter((botConfig) => new RegExp(botConfig.name).test(bot.name))[0] ?? null;
        if (!bot.is_enabled) {
            disabledBots.push(bot.id);
        }
        const account = await api.getAccountInfo(bot.account_id);
        return {
            bot: bot,
            config: botConfig,
            marketCode: account.market_code,
        };
    });
    return (await Promise.all(promises))
        .filter((bot) => !!bot.config && bot.bot.type == "Bot::MultiBot");
};
const checkMaxMin = (value, maxMin) => value < (maxMin?.max ?? Number.MAX_SAFE_INTEGER) &&
    value > (maxMin?.min ?? Number.MIN_SAFE_INTEGER);
let lastPairs = {};
const validPairs = {};
let bots = [];
let disabledBots = [];
const setupGlobals = async () => {
    console.log("-- Fetching bots");
    bots = await getValidBots();
};
const run = async () => {
    console.log("-- Fetching bubbles");
    const bubbles = await fetchBubbles();
    const progConfig = config;
    for (const { bot, config, marketCode } of bots) {
        const botConfig = config;
        if (progConfig.readOnly)
            console.log(`++ Getting pairs for ${bot.name}`);
        else
            console.log(`++ Updating ${bot.name}`);
        if (!validPairs[marketCode]) {
            console.log(`-- Fetching valid pairs for ${marketCode}`);
            validPairs[marketCode] = await api.getMarketPairs({ market_code: marketCode });
        }
        const bubblePairs = bubbles
            .filter((bubble) => {
            const data = bubble.data.usd;
            const filter = botConfig.filter;
            const perf = filter?.performance;
            const dataPerf = data.performance;
            const checks = [
                checkMaxMin(data.marketcap, filter?.marketCap),
                checkMaxMin(data.volume, filter?.volume),
                checkMaxMin(dataPerf.hour, perf?.hour),
                checkMaxMin(dataPerf.day, perf?.day),
                checkMaxMin(dataPerf.week, perf?.week),
                checkMaxMin(dataPerf.month, perf?.month),
                checkMaxMin(dataPerf.year, perf?.year),
            ];
            return checks.reduce((check1, check2) => check1 && check2);
        })
            .sort((bubble1, bubble2) => bubble2.data.usd.performance[botConfig.filter?.performance?.sort ?? "hour"] -
            bubble1.data.usd.performance[botConfig.filter?.performance?.sort ?? "hour"])
            .map((bubble) => bubble.symbol)
            .filter((base) => !botConfig.pairs.exclude?.includes(base));
        const pairs = (botConfig.pairs.include ?? []).concat(bubblePairs)
            .map((base) => `${botConfig.pairs.quote}_${base}`)
            .filter((pair) => validPairs[marketCode].includes(pair))
            .filter((pair, index, pairs) => pairs.indexOf(pair) == index)
            .slice(0, botConfig.pairs.max);
        if (pairs.length < botConfig.pairs.min ?? 0) {
            console.error("!! Could not get enough pairs with current filter");
            if (botConfig.pairs.stopIfNotEnough && !disabledBots.includes(bot.id)) {
                console.error("!! Stopping bot");
                try {
                    await api.customRequest("POST", 1, `/bots/${bot.id}/disable`, { bot_id: bot.id });
                    console.log("++ Stopped " + bot.name);
                    disabledBots.push(bot.id);
                }
                catch (e) {
                    console.error("!! Error stopping " + bot.name);
                    console.error("!! " + e);
                }
            }
            return;
        }
        
        let botLastPairs = lastPairs[bot.id]
        if (!!botLastPairs &&
            botLastPairs.length === pairs.length &&
            botLastPairs.every((value) => pairs.includes(value))) {
            console.log("!! Pairs are the same as last iteration");
            if (!progConfig.readOnly)
                console.log("!! Skipping update");
            return;
        }
        lastPairs[bot.id] = [...pairs];
        console.log("++ Found new pairs:");
        const backupPairs = [...pairs];
        const end = pairs.pop();
        const extraPairs = pairs.join(", ");
        const oxfordComma = pairs.length > 1 ? "," : "";
        const conjunction = pairs.length > 0 ? " and " : "";
        console.log("++   " + extraPairs + oxfordComma + conjunction + end);
        if (config.readOnly)
            return;
        const newBot = bot;
        newBot.pairs = backupPairs;
        try {
            await api.customRequest("PATCH", 1, `/bots/${bot.id}/update`, newBot);
            console.log("++ Updated " + bot.name);
        }
        catch (e) {
            console.error("!! Error updating " + bot.name);
            console.error("!! " + e);
        }
        if (botConfig.pairs.startIfEnough && disabledBots.includes(bot.id)) {
            console.error("!! Starting bot " + bot.name);
            try {
                await api.customRequest("POST", 1, `/bots/${bot.id}/enable`, { bot_id: bot.id });
                console.log("++ Starting " + bot.name);
                disabledBots = disabledBots.filter((id) => id != bot.id);
            }
            catch (e) {
                console.error("!! Error starting " + bot.name);
                console.error("!! " + e);
            }
        }
    }
};
const loopWithDelay = async (delay) => {
    while (true) {
        await run();
        console.log(`-- Sleeping ${delay / 1000} seconds`);
        await new Promise((resolve) => setTimeout(resolve, delay));
    }
};
if (validateConfig(config)) {
    await setupGlobals();
    const updateTime = config.updateTime;
    if (updateTime) {
        const regex = /(?:(\d+) *d)? *(?:(\d+) *h)? *(?:(\d+) *m)? *(?:(\d+) *s)?/;
        const [_all, day, hour, min, sec] = config.updateTime.match(regex);
        const secs = (parseInt(day) || 0) * 86400 +
            (parseInt(hour) || 0) * 3600 +
            (parseInt(min) || 0) * 60 +
            (parseInt(sec) || 0);
        loopWithDelay(secs * 1000);
    }
    else {
        run();
    }
}
