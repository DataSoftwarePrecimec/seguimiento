export async function onRequest(context) {
  try {
    const body = await context.request.json();
    if (!body.email || !body.code || !body.session_code) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Missing email, code or session_code"
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const url = "https://script.google.com/macros/s/AKfycbxbsgfFR49j44PFsXi-BlxiD-0snFJaZU40kUOe0GcAmYKn7d8KcH3qQWVuG8g6jl7N/exec";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cmd: "validate_code",
        email: body.email,
        code: body.code,
        session_code: body.session_code   // ✅ snake_case
      })
    });
    const text = await response.text();
    return new Response(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Failed to validate code",
        details: err.message
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
