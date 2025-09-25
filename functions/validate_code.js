export async function onRequest(context) {
  try {
    const body = await context.request.json();
    if (!body.email || !body.code) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Falta el correo o el código"
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!globalThis.session_code) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Sin código de sesión. Llamaste primero a /send_code?"
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    body.session_code = globalThis.session_code;
    console.log(body.session_code)
    const url = "https://script.google.com/macros/s/AKfycbxbsgfFR49j44PFsXi-BlxiD-0snFJaZU40kUOe0GcAmYKn7d8KcH3qQWVuG8g6jl7N/exec";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cmd: "validate_code",
        email: body.email,
        code: body.code,
        session_code: body.session_code
      })
    });
    const data = await response.json();
    if (data.valid === true) {
      return new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Código incorrecto o expirado"
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
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
