export async function onRequest(context) {
  try {
    const url = "https://script.google.com/macros/s/.../exec";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cmd: "get_rows" })
    });
    console.log('RESPONSE: ' + Object.keys(response))
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch from GAS", status: response.status }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Server error", details: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
