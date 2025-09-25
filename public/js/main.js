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
      body: JSON.stringify({ email, code })
    });
    const data = await res.json();
    if (data.status === "ok") {
      await get_rows_and_populate();
    } else {
      alert("Código incorrecto o expirado");
      btn.disabled = false;
    }
  } catch (err) {
    console.error("Error en /validate_code:", err);
    alert("Error de red al validar el código");
    btn.disabled = false;
  }
});

//OBTENER FILAS
async function get_rows_and_populate() {
  try {
    const res = await fetch("/get_rows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}) // can be empty or later include params
    });
    if (!res.ok) throw new Error("No se pudieron obtener los datos");
    const data = await res.json();
    document.querySelector("table").style.display = "table";
    document.getElementById("submitBtn").disabled = false;
    if (!document.getElementById("downloadBtn")) {
      const btn = document.createElement("button");
      btn.id = "downloadBtn";
      btn.textContent = "DESCARGAR INFORME";
      btn.type = "button";
      btn.style.marginLeft = "10px";
      btn.addEventListener("click", () => {
        alert("Descargar informe todavía no implementado");
      });
      document.getElementById("submitBtn").insertAdjacentElement("afterend", btn);
    }
    const incons = data.inconsistencies || {}; // adjust to your GAS payload
    data.rows.forEach(r => add_row(r, incons));
    document.getElementById("loading").style.display = "none";
  } catch (err) {
    console.error("Error en get_rows_and_populate:", err);
    alert("Error cargando los datos");
  }
}
