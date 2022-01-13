import fetch from "node-fetch";
const CB_API = "https://cryptobubbles.net/backend/data/currentBubbles500.json";
export const fetchBubbles = async () => {
    const res = await fetch(CB_API);
    return await res.json();
};
export const fetchAltRank = async (key) => {
    const res = await fetch(`https://api.lunarcrush.com/v2?data=market&type=fast&sort=acr&key=${key}`);
    return (await res.json()).data;
};
export const fetchVolatility = async (key) => {
    const res = await fetch(`https://api.lunarcrush.com/v2?data=market&type=fast&sort=vt&key=${key}&desc=true`);
    return (await res.json()).data;
};
export const fetchGalaxyScore = async (key) => {
    const res = await fetch(`https://api.lunarcrush.com/v2?data=market&type=fast&sort=gs&key=${key}`);
    return (await res.json()).data;
};
