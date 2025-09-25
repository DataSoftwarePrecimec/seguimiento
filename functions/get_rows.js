export async function onRequest(context) {
  const url = "https://script.google.com/macros/s/AKfycbxbsgfFR49j44PFsXi-BlxiD-0snFJaZU40kUOe0GcAmYKn7d8KcH3qQWVuG8g6jl7N/exec";
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cmd: "get_rows",
      session_code: globalThis.session_code // keep it server side
    })
  });
  return new Response(await response.text(), {
    status: response.status,
    headers: { "Content-Type": "application/json" }
  });
}
