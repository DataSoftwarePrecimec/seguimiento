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
document.getElementById("correoInput").addEventListener("input", function () {
  const email = this.value.trim();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  document.getElementById("sendEmailBtn").disabled = !isValid;
});
document.getElementById("codigoInput").addEventListener("input", function () {
  const code = this.value.trim();
  const isValid = /^\d{6}$/.test(code);
  document.getElementById("validateCodeBtn").disabled = !isValid;
});
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

document.getElementById("sendEmailBtn").addEventListener("click", async () => {
  const email = document.getElementById("correoInput").value.trim().toLowerCase();
  const res = await fetch("/send_code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  const data = await res.json();
  if (data.status === "ok") {
    alert("Código enviado a " + email + " por favor revise su correo e ingrese el Código en el campo correspondiente");
    document.getElementById("codeInput").disabled = false;
  } else {
    alert("Error al enviar el código: " + (data.message || "desconocido"));
  }
});
