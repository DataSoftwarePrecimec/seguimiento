export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    body.session_code = globalThis.session_code; // attach session
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbxbsgfFR49j44PFsXi-BlxiD-0snFJaZU40kUOe0GcAmYKn7d8KcH3qQWVuG8g6jl7N/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cmd: "download_report",
          code: body.code,
          session_code: body.session_code,
        }),
      }
    );
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // avoid CORS issues
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
