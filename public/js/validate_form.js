function validate_form() {
        const emailInput = document.querySelector("input[name='correo']");
        const rows = document.querySelectorAll("#dataTable tr.data-row");
        let valid = true;
        let message = "";
        const email = emailInput.value.trim();

        // Validate email
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
          showMessage("Debe ingresar un correo electrónico válido.");
          return false;
        } else {
          hideMessage();
        }

        let edited = false;

        rows.forEach(row => {
          const descCell      = row.cells[5];
          const notaCell      = row.cells[6];
          const espCell       = row.cells[7];
          const aprCell       = row.cells[8];
          const grupoSelect   = row.cells[9].querySelector("select");
          const etiquetaSelect = row.cells[10].querySelector("select");
          const descArea      = row.cells[11].querySelector("textarea");

          const fileDesc  = descCell.querySelector("input[type='file']");
          const fileNota  = notaCell.querySelector("input[type='file']");
          const espSelect = espCell.querySelector("select");
          const aprSelect = aprCell.querySelector("select");

          // 1) DESCRIPCIÓN QUIRÚRGICA + ESPECIALIDAD
          if (fileDesc) {
            if (fileDesc.files.length > 0 && (espSelect && espSelect.value)) {
              edited = true;
              row.dataset.edited = "true";
            } else if (fileDesc.files.length > 0) {
              valid = false;
              message = "Debe seleccionar una especialidad.";
            } else if (espSelect && espSelect.value) {
              valid = false;
              message = "Debe seleccionar un archivo de Descripción Quirúrgica.";
            }
          }

          // 2) NOTA ACLARATORIA sola
          if (fileNota && fileNota.files.length > 0) {
            edited = true;
            row.dataset.edited = "true";
            // No extra validation required
          }

          // 3) APROBACIÓN
          if (
            aprSelect &&
            aprSelect.value !== "" &&
            aprSelect.value !== "-- Bloqueado --" &&
            aprSelect.value !== "-- Seleccione --"
          ) {
            edited = true;
            row.dataset.edited = "true";
            if (aprSelect.value.startsWith("RECHAZAR")) {
              if (grupoSelect.value === "") {
                valid = false;
                message = "Debe seleccionar un grupo.";
              }
              if (etiquetaSelect.value === "") {
                valid = false;
                message = "Debe seleccionar una etiqueta.";
              }
              if (descArea.value.trim() === "") {
                valid = false;
                message = "Debe escribir una descripción.";
              }
            }
          }
        });

        if (!edited) {
          showMessage("Debe editar al menos una fila.");
          return false;
        }
        if (!valid) {
          showMessage(message);
          return false;
        }

        hideMessage();
        return true;
      }
