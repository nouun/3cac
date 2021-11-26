import fetch from "node-fetch";

const CB_API = "https://cryptobubbles.net/backend/data/currentBubbles500.json";

export const fetchBubbles = async (): Promise<Bubble[]> => {
  const res = await fetch(CB_API);
  return await res.json();
};

