import { GAS_URL } from "../config.js";

export async function onRequestPost(context) {
  try {
    const { email } = await context.request.json();

    // Proxy request to Google Apps Script
    const res = await fetch(GAS_URL + "?cmd=request_code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    return new Response(await res.text(), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ status: "error", message: err.message }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
}
