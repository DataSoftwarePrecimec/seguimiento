const GAS_URL = "https://script.google.com/macros/s/AKfycbw53IZjag5cbwGOq0qTwnnv_w3iD00hDD8gjHnQBUfa1e37scVUXW97JQpnjtM_WgLW/exec"

function initApp() {
  fetch("/get_rows")
    .then(res => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then(result => {
      const rows = result.rows;
      const incons = result.incons;

      rows.forEach(r => add_row(r, incons));

      document.getElementById("loading").style.display = "none";
      document.querySelector("table").style.display = "table";
      document.getElementById("submitBtn").disabled = false;
    })
    .catch(err => {
      console.error("Error loading data:", err);
      document.getElementById("loading").innerHTML =
        "<p style='color:red'>Error cargando datos</p>";
    });
}

function show_message(msg, color = "red") {
  const warning = document.getElementById("formWarning");
  warning.textContent = msg;
  warning.style.display = "block";
  warning.style.color = color;
}

function hide_message() {
  const warning = document.getElementById("formWarning");
  warning.textContent = "";
  warning.style.display = "none";
}
document.addEventListener("DOMContentLoaded", initApp);
document.addEventListener("change", function (e) {
  if (e.target.matches("input[type='file']")) {
    const label = e.target.closest("label.upload-btn");
    if (label) {
      if (e.target.files.length > 0) {
        label.style.backgroundColor = "#4caf50"; // green
        label.style.color = "white";
      } else {
        label.style.backgroundColor = "#ff9800"; // original orange
        label.style.color = "white";
      }
    }
  }
});

function request_code() {
  const email = document.getElementById("emailInput").value.trim();
  const statusEl = document.getElementById("emailStatus");

  statusEl.style.display = "none";
  fetch("/request_code", {   // <-- now hits our Cloudflare Function
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "ok") {
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

function toggle_validate_button() {
  const code = document.getElementById("codeInput").value.trim();
  const btn = document.getElementById("validateBtn");
  btn.disabled = code.length < 6; // enable only when 6 chars
}
function check_email() {
  const emailField = document.getElementById("emailInput");
  const verifyBtn = document.getElementById("verifyBtn");
  const email = emailField.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  verifyBtn.disabled = !valid;
}
