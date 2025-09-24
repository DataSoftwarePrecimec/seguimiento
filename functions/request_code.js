function request_code() {
  const email = document.getElementById("emailInput").value.trim();
  const statusEl = document.getElementById("emailStatus");

  statusEl.style.display = "none";

  fetch(GAS_URL + "?cmd=request_code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "ok") {
        // Hide email step, show code step
        document.getElementById("emailStep").style.display = "none";
        document.getElementById("codeStep").style.display = "block";
      } else {
        statusEl.textContent = data.message || "El correo no está autorizado.";
        statusEl.style.display = "block";
      }
    })
    .catch(err => {
      console.error("Error requesting code:", err);
      statusEl.textContent = "Error de conexión.";
      statusEl.style.display = "block";
    });
}
