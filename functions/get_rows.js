export async function onRequest(context) {
  try {
    const url =
      "https://script.google.com/macros/s/AKfycbw53IZjag5cbwGOq0qTwnnv_w3iD00hDD8gjHnQBUfa1e37scVUXW97JQpnjtM_WgLW/exec?cmd=get_rows";
    const response = await fetch(url);
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
