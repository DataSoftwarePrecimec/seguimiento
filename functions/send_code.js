export async function onRequest(context) {
  try {
    let body                = await context.request.json();
    globalThis.session_code = crypto.randomUUID();
    body.session_code       = globalThis.session_code;
    body.cmd                = "send_code";
    const url               = "https://script.google.com/macros/s/AKfycbxbsgfFR49j44PFsXi-BlxiD-0snFJaZU40kUOe0GcAmYKn7d8KcH3qQWVuG8g6jl7N/exec";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const text = await response.text();
    return new Response(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Fallo en el envio del código", detalles: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
