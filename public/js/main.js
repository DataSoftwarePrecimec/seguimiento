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
      onCodeValidated();
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

//OBTENER FILAS BACKEND
async function fetch_rows() {
  const code = document.getElementById("codigoInput").value.trim();
  const res = await fetch("/get_rows", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code })
  });
  if (!res.ok) throw new Error("No se pudieron obtener los datos");
  return res.json(); // { rows: [...], inconsistencies: {...} }
}

//LLENAR TABLAS
function populate_table(rows, inconsistencies) {
  const tbody = document.getElementById("dataTable");
  tbody.innerHTML = ""; // clear existing
  rows.forEach(r => add_row(r, inconsistencies));
}

//OBTENER Y LLENAR TABLAS. SE LLAMA CUANDO SE HA VALIDADO POR PRIMERA VEZ EL CÓDIGO
async function get_rows_and_populate() {
  try {
    document.getElementById("loading").style.display = "block";
    document.querySelector("table").style.display = "none";
    const data = await fetch_rows();
    document.querySelector("table").style.display = "table";
    document.getElementById("submitBtn").disabled = false;
    document.getElementById("downloadReportBtn").disabled = false;
    populate_table(data.rows, data.incons || {});
    document.getElementById("loading").style.display = "none";
  } catch (err) {
    console.error("Error en get_rows_and_populate:", err);
    alert("Error cargando los datos");
    document.getElementById("loading").style.display = "none";
  }
}

//LLENADO DE FILAS POR PRIMERA VEZ
function onCodeValidated() {
  document.getElementById("correoInput").disabled       = true;
  document.getElementById("sendEmailBtn").disabled      = true;
  document.getElementById("codigoInput").disabled       = true;
  document.getElementById("validateCodeBtn").disabled   = true;
  document.getElementById("submitBtn").disabled         = true;
  document.getElementById("downloadReportBtn").disabled = true;
  const section = document.getElementById("postValidationSection");
  section.style.display = "block";
  const loading = document.getElementById("loading");
  loading.style.display = "block";
  document.querySelector("table").style.display = "none";
  get_rows_and_populate();
}

//DESCARGAR INFORME
async function download_report() {
  if (!confirm("¿Está seguro que desea descargar el informe?\n\nNOTA: El informe se actualiza cada 10 minutos. Si desea ver los cambios aquí realizado, se recomienda esperar.")) {
    return; // user canceled
  }
  const submitBtn   = document.getElementById("submitBtn");
  const downloadBtn = document.getElementById("downloadReportBtn");
  submitBtn.disabled   = true;
  downloadBtn.disabled = true;
  try {
    const code = document.getElementById("codigoInput").value.trim();
    const res  = await fetch("/download_report", {method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code })});
    const data = await res.json();
    if (data && data.filedata) {
      const byteChars = atob(data.filedata);
      const byteNumbers = Array.from(byteChars, c => c.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = data.filename;
      link.click();
      URL.revokeObjectURL(link.href);
    } else {
      alert("El servidor no devolvió un PDF válido.");
    }
  } catch (err) {
    console.error("Download error:", err);
    alert("Error descargando el informe.");
  } finally {
    submitBtn.disabled   = false;
    downloadBtn.disabled = false;
  }
}
