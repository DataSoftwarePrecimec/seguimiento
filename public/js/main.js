function initApp() {
  fetch("/get_rows")
    .then(res => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then(result => {
      const rows = result.rows;
      const incons = result.incons;

      rows.forEach(r => addRow(r, incons));

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

// -----------------------------
// Global event listeners
// -----------------------------
document.addEventListener("DOMContentLoaded", initApp);

// Change style of file-upload buttons when a file is selected
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
