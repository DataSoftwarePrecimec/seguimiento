function submit_form() {
  if (!validate_form()) return;
  const submitBtn   = document.getElementById("submitBtn");
  const downloadBtn = document.getElementById("downloadReportBtn");
  submitBtn.disabled   = true;
  downloadBtn.disabled = true;
  const email      = document.querySelector("input[name='correo']").value;
  const editedRows = Array.from(document.querySelectorAll("#dataTable tr")).filter(r => r.dataset.edited === "true");
  const rowPromises = editedRows.map(r => {
    return new Promise(resolve => {
      const descCell    = r.cells[6];
      const notaCell    = r.cells[7];
      const espSelect   = r.cells[8].querySelector("select");
      const aprSelect   = r.cells[9].querySelector("select");
      const grupoSel    = r.cells[10].querySelector("select");
      const etiquetaSel = r.cells[11].querySelector("select");
      const descArea    = r.cells[12].querySelector("textarea");
      const fileDesc = descCell.querySelector("input[type='file']")?.files[0] || null;
      const fileNota = notaCell.querySelector("input[type='file']")?.files[0] || null;
      const readFileAsBase64 = (file) => {
        return new Promise(res => {
          if (!file) return res(null);
          const reader = new FileReader();
          reader.onload = e => res(e.target.result);
          reader.readAsDataURL(file);
        });
      };
      Promise.all([readFileAsBase64(fileDesc), readFileAsBase64(fileNota)])
        .then(([descBase64, notaBase64]) => {
          resolve({
            order: r.cells[0].textContent,
            names: r.cells[1].textContent,
            hc: descBase64,
            nota: notaBase64,
            especialidad: espSelect ? espSelect.value : "",
            aprobacion: (aprSelect && aprSelect.value && !aprSelect.value.includes("Bloqueado")) ? aprSelect.value : "",
            grupo: (aprSelect && aprSelect.value.startsWith("RECHAZAR") && grupoSel.value !== "") ? grupoSel.value : "",
            etiqueta: (aprSelect && aprSelect.value.startsWith("RECHAZAR") && etiquetaSel.value !== "") ? etiquetaSel.value : "",
            responsable: (aprSelect && aprSelect.value.startsWith("RECHAZAR") && etiquetaSel.value !== "")
                          ? etiquetaSel.options[etiquetaSel.selectedIndex].dataset.responsable
                          : "",
            descripcion: (aprSelect && aprSelect.value.startsWith("RECHAZAR")) ? descArea.value.trim() : ""
          });
        });
    });
  });
  show_message("Convirtiendo archivos a Base64...", "green");
  Promise.all(rowPromises).then(payload => {
    show_message("Enviando datos...", "green");
    const code = document.getElementById("codigoInput").value.trim();
    fetch("/save_data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cmd: "save_data", code, email, payload })
    })
      .then(async res => {
        const text = await res.text();
        console.log("RAW response from /save_data:", text);
        try {
          const result = JSON.parse(text);
          if (result.data_saved) {
            show_message("Datos enviados correctamente.", "green");
            if (result.payload && result.payload.rows) {
              populate_table(result.payload.rows, result.payload.incons);
            }
          } else {
            show_message(result.message || "Error en el servidor.", "red");
          }
        } catch (err) {
          console.error("JSON parse error:", err);
          show_message("Respuesta inválida del servidor", "red");

        }
        submitBtn.disabled   = false;
        downloadBtn.disabled = false;
      })
      .catch(err => {
        console.error("Fetch failed:", err);
        show_message("Error al enviar los datos.", "red");
        submitBtn.disabled   = false;
        downloadBtn.disabled = false;
      });
  });
}
