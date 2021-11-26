import fetch from "node-fetch";
const CB_API = "https://cryptobubbles.net/backend/data/currentBubbles500.json";
export const fetchBubbles = async () => {
    const res = await fetch(CB_API);
    const bubbles = await res.json();
    const out = bubbles
        .filter((bubble) => !!bubble.kucoinSymbol);
    return out;
};
