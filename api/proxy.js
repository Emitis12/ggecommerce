// /api/proxy.js (Vercel)
const DEPLOY_URL =
  "https://script.google.com/macros/s/AKfycbypUy0Ba5wiVyhIi3fRSxXcXAoTp_pePNMtrahQzNlFaLX2twmb_97K9xNZALwN4hff/exec";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const response = await fetch(DEPLOY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
