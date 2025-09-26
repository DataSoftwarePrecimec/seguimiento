function add_row(data, incons) {
        const table = document.getElementById("dataTable");
        const row = document.createElement("tr");
        row.dataset.edited = "false";
        row.classList.add("data-row");
        const notaCode        = data.links["NOTA ACLARATORIA"] ? Object.keys(data.links["NOTA ACLARATORIA"])[0] : "";
        const notaLink        = data.links["NOTA ACLARATORIA"] ? Object.values(data.links["NOTA ACLARATORIA"])[0] : "";
        const gastoCode       = data.links["GASTO QUIRÚRGICO"] ? Object.keys(data.links["GASTO QUIRÚRGICO"])[0] : "";
        const gastoLink       = data.links["GASTO QUIRÚRGICO"] ? Object.values(data.links["GASTO QUIRÚRGICO"])[0] : "";
        const facturaCode     = data.links["FACTURA"] ? Object.keys(data.links["FACTURA"])[0] : "";
        const facturaLink     = data.links["FACTURA"] ? Object.values(data.links["FACTURA"])[0] : "";
        const proformaCode    = data.links["PROFORMA"] ? Object.keys(data.links["PROFORMA"])[0] : "";
        const proformaLink    = data.links["PROFORMA"] ? Object.values(data.links["PROFORMA"])[0] : "";
        const descripcionCode = data.links["DESCRIPCION QUIRÚRGICA"] ? Object.keys(data.links["DESCRIPCION QUIRÚRGICA"])[0] : "";
        const descripcionLink = data.links["DESCRIPCION QUIRÚRGICA"] ? Object.values(data.links["DESCRIPCION QUIRÚRGICA"])[0] : "";
        const especialidadValue = data.especiality || "";
        row.innerHTML = `
          <td>${data.order}</td>
          <td>${data.name}</td>
          <td>${proformaLink ? `<a href="${proformaLink}" target="_blank">${proformaCode}</a>` : ""}</td>
          <td>${gastoLink ? `<a href="${gastoLink}" target="_blank">${gastoCode}</a>` : ""}</td>
          <td>${facturaLink ? `<a href="${facturaLink}" target="_blank">${facturaCode}</a>` : ""}</td>
          <td>
            <div style="text-align:center;">
              ${descripcionLink 
                ? `<a href="${descripcionLink}" target="_blank">${descripcionCode}</a>` 
                : ""}
            </div>
          </td>
          <td>
            <div style="text-align:center;">
              ${notaLink 
                ? `<a href="${notaLink}" target="_blank">${notaCode}</a>` 
                : `<label class="upload-btn">Subir PDF
                    <input type="file" accept="application/pdf" />
                  </label>`}
            </div>
          </td>
          <td></td> <!-- ESPECIALIDAD -->
          <td></td> <!-- APROBACIÓN -->
          <td>
            <select disabled>
              <option value="">-- Seleccione grupo --</option>
              ${Object.keys(incons).map(g=>`<option value="${g}">${g}</option>`).join("")}
            </select>
          </td>
          <td>
            <select disabled>
              <option value="">-- Seleccione etiqueta --</option>
            </select>
          </td>
          <td><textarea disabled rows="3" style="width:100%; box-sizing:border-box;"></textarea></td>
        `;
        table.appendChild(row);
        const inputs = row.querySelectorAll("input, select, textarea");
        inputs.forEach(el => {
          el.addEventListener("change", () => {
            row.dataset.edited = "true";
          });
        });
        
        const descCell        = row.cells[5];
        const especialidadCell= row.cells[7];
        const aprobacionCell  = row.cells[8];
        const grupoSelect     = row.cells[9].querySelector("select");
        const etiquetaSelect  = row.cells[10].querySelector("select");
        const descripcionArea = row.cells[11].querySelector("textarea");
        if (data.approval.length === 0) {
          descCell.innerHTML = `
            <div style="text-align:center;">
              <label class="upload-btn">
                Subir PDF
                <input type="file" accept="application/pdf" />
              </label>
            </div>
          `;
          especialidadCell.innerHTML = `
            <select>
              <option value="">-- Seleccione especialidad --</option>
              <option value="ORTOPEDIA" ${especialidadValue==="ORTOPEDIA"?"selected":""}>ORTOPEDIA</option>
              <option value="NEURO" ${especialidadValue==="NEURO"?"selected":""}>NEURO</option>
              <option value="PLÁSTICA" ${especialidadValue==="PLÁSTICA"?"selected":""}>PLÁSTICA</option>
              <option value="CABEZA Y CUELLO" ${especialidadValue==="CABEZA Y CUELLO"?"selected":""}>CABEZA Y CUELLO</option>
            </select>
          `;
          aprobacionCell.innerHTML = `<select disabled><option>-- Bloqueado --</option></select>`;
        } else {
          aprobacionCell.innerHTML = `
            <select>
              <option value="">-- Seleccione --</option>
              ${data.approval.map(opt => `<option value="${opt}">${opt}</option>`).join("")}
            </select>
          `;
          const aprobacionSelect = aprobacionCell.querySelector("select");
          aprobacionSelect.addEventListener("change", function() {
            if (this.value.startsWith("RECHAZAR")) {
              grupoSelect.disabled = false;
            } else {
              grupoSelect.disabled = true;
              etiquetaSelect.disabled = true;
              descripcionArea.disabled = true;
            }
          });
          grupoSelect.addEventListener("change", function() {
            const group = this.value;
            etiquetaSelect.innerHTML = `<option value="">-- Seleccione etiqueta --</option>`;
            if (group && incons[group]) {
              incons[group].forEach(pair => {
                const etiqueta = pair[0];
                const responsable = pair[1];
        
                const opt = document.createElement("option");
                opt.value = etiqueta;                 // show etiqueta only
                opt.textContent = etiqueta;
                opt.dataset.responsable = responsable; // keep responsable hidden
        
                etiquetaSelect.appendChild(opt);
              });
              etiquetaSelect.disabled = false;
            } else {
              etiquetaSelect.disabled = true;
            }
          });
          etiquetaSelect.addEventListener("change", function() {
            descripcionArea.disabled = this.value === "";
          });
        }
}
