import fetch from "node-fetch";

const CB_API = "https://cryptobubbles.net/backend/data/currentBubbles500.json";

export const fetchBubbles = async (): Promise<Bubble[]> => {
  const res = await fetch(CB_API);
  return <Bubble[]> await res.json();
};

export const fetchAltRank = async (key: string): Promise<[LunarCrush]> => {
  const res = await fetch(`https://api.lunarcrush.com/v2?data=market&type=fast&sort=acr&key=${key}`);
  return (<LunarCrushWrapper>await res.json()).data;
};

export const fetchVolatility = async (key: string): Promise<[LunarCrush]> => {
  const res = await fetch(`https://api.lunarcrush.com/v2?data=market&type=fast&sort=vt&key=${key}&desc=true`);
  return (<LunarCrushWrapper>await res.json()).data;
};

export const fetchGalaxyScore = async (key: string): Promise<[LunarCrush]> => {
  const res = await fetch(`https://api.lunarcrush.com/v2?data=market&type=fast&sort=gs&key=${key}`);
  return (<LunarCrushWrapper>await res.json()).data;
};
