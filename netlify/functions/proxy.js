// /.netlify/functions/proxy.js
const DEPLOY_URL =
  "https://script.google.com/macros/s/AKfycbypUy0Ba5wiVyhIi3fRSxXcXAoTp_pePNMtrahQzNlFaLX2twmb_97K9xNZALwN4hff/exec";

export async function handler(event, context) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const response = await fetch(DEPLOY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: false, message: err.message }),
    };
  }
}
