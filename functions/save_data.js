import { GAS_URL } from "./config.js";

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const response = await fetch(
     GAS_URL,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // fixes CORS
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Worker error", details: err.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
