function initKg() {

  const listaPesos = document.querySelectorAll("#listaPesos li");
  const pesoSeleccionado = document.getElementById("pesoSeleccionado");

  if (!listaPesos.length || !pesoSeleccionado) {
    console.error("❌ Elementos de kg no encontrados");
    return;
  }

  let modoEdicion = false;
  let pesoActual = 0;

  // ===== CARGAR DESDE BD =====
  fetch("kg/obtenerKg.php", { cache: "no-store" })
    .then(res => res.json())
    .then(data => {
      pesoActual = parseFloat(data.peso) || 0;
      if (pesoActual > 0) {
        pesoSeleccionado.textContent = pesoActual.toFixed(2) + " kg";
      }
      actualizarIndicador();
    });

  // ===== EDITAR =====
  pesoSeleccionado.addEventListener("click", () => {
    if (modoEdicion) return;
    modoEdicion = true;

    pesoSeleccionado.innerHTML = `
      <input type="number" step="0.01" id="inputPeso" value="${pesoActual || ""}">
    `;

    const input = document.getElementById("inputPeso");
    input.focus();
    input.select();

    input.addEventListener("keydown", e => {
      if (e.key === "Enter") guardarPeso(input.value);
    });

    input.addEventListener("blur", () => guardarPeso(input.value));
  });

  // ===== CLICK EN PESOS =====
  listaPesos.forEach(li => {
    li.addEventListener("mousedown", e => {
      if (!modoEdicion) return;
      e.preventDefault();
      guardarPeso(li.dataset.peso);
    });
  });

  function guardarPeso(valor) {
    valor = parseFloat(valor);

    if (!valor || isNaN(valor)) {
      pesoSeleccionado.textContent = "PESO";
      pesoActual = 0;
    } else {
      pesoActual = valor;
      pesoSeleccionado.textContent = pesoActual.toFixed(2) + " kg";

      const datos = new FormData();
      datos.append("peso", pesoActual);

      fetch("kg/guardarKg.php", {
        method: "POST",
        body: datos
      });
    }

    modoEdicion = false;
    actualizarIndicador();
  }

  function actualizarIndicador() {
    listaPesos.forEach(li => {
      li.classList.remove("superior", "actual");

      const pesoLi = parseFloat(li.dataset.peso);
      if (!pesoActual) return;

      if (Math.round(pesoLi) === Math.round(pesoActual)) {
        li.classList.add("actual");
      } else if (pesoLi > pesoActual) {
        li.classList.add("superior");
      }
    });
  }
}
