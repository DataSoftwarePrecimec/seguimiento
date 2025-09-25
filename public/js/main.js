function initialize() {
  /*fetch("/get_rows")
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
    });*/
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

//VALIDAR CORREO Y DESBLOQUEAR BOTÓN:
document.getElementById("correoInput").addEventListener("input", function () {
  const email = this.value.trim();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  document.getElementById("sendEmailBtn").disabled = !isValid;
});

//VALIDAR CÓDIGO Y DESBLOQUEAR BOTÓN
document.getElementById("codigoInput").addEventListener("input", function () {
  const code = this.value.trim();
  const isValid = /^\d{6}$/.test(code);
  document.getElementById("validateCodeBtn").disabled = !isValid;
});

//FUNCIÓN AL INICIO
document.addEventListener("DOMContentLoaded", initialize);

//CAMBIAR BOTÓN A VERDE CUANDO SE SUBE UN ARCHIVO
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

//VALIDAR CORREO Y ENVIAR CÓDIGO
document.getElementById("sendEmailBtn").addEventListener("click", async (e) => {
  const btn = e.target;
  btn.disabled = true;
  const email = document.getElementById("correoInput").value.trim().toLowerCase();
  try {
    const res = await fetch("/send_code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cmd: "send_code", email })
    });
    const data = await res.json();
    if (data.status === "ok") {
      alert(
        "Código enviado a " +
          email +
          ". Por favor revise su correo e ingrese el código en el campo correspondiente."
      );
      document.getElementById("codigoInput").disabled = false;
    } else {
      alert("Error al enviar el código: " + (data.message || "desconocido"));
      btn.disabled = false;
    }
  } catch (err) {
    alert("Error de red: " + err.message);
    btn.disabled = false;
  }
});

//VALIDAR CÓDIGO
document.getElementById("validateCodeBtn").addEventListener("click", async () => {
  const email = document.getElementById("correoInput").value.trim().toLowerCase();
  const code = document.getElementById("codigoInput").value.trim();
  const btn = document.getElementById("validateCodeBtn");
  btn.disabled = true;
  try {
    const res = await fetch("/validate_code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code})
    });
    const data = await res.json();
    if (data.status === "ok") {
      alert("Código validado correctamente");
    } else {
      alert("Código incorrecto o expirado");
      btn.disabled = false;
    }
  } catch (err) {
    console.error("Error en /validate_code:", err);
    alert("Error de red al validar el código");
    btn.disabled = false; // re-enable on failure
  }
});
