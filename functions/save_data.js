export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    // Forward request to your Google Apps Script
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbw53IZjag5cbwGOq0qTwnnv_w3iD00hDD8gjHnQBUfa1e37scVUXW97JQpnjtM_WgLW/exec",
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
