function initKg() {

  // =========================
  // ELEMENTOS
  // =========================
  const listaPesos = document.querySelectorAll("#listaPesos li");
  const pesoSeleccionado = document.getElementById("pesoSeleccionado");

  const btnHistorial = document.getElementById("verHistorialKg");
  const modalKg = document.getElementById("modalKg");
  const cerrarKgModal = document.getElementById("cerrarKgModal");

  const historialKgLista = document.getElementById("historialKgLista");
  const nuevoPeso = document.getElementById("nuevoPeso");
  const fotoPeso = document.getElementById("fotoPeso");
  const guardarPesoHistorial = document.getElementById("guardarPesoHistorial");

  if (!pesoSeleccionado || !listaPesos.length) {
    console.error("❌ Elementos KG no encontrados");
    return;
  }

  let modoEdicion = false;
  let pesoActual = 0;

  // =========================
  // CARGAR PESO ACTUAL
  // =========================
  fetch("kg/obtenerKg.php", { cache: "no-store" })
    .then(res => res.json())
    .then(data => {
      pesoActual = parseFloat(data.peso) || 0;
      if (pesoActual > 0) {
        pesoSeleccionado.textContent = pesoActual.toFixed(2) + " kg";
      }
      actualizarIndicador();
    });

  // =========================
  // EDITAR PESO ACTUAL
  // =========================
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
      if (e.key === "Enter") guardarPesoActual(input.value);
    });

    input.addEventListener("blur", () => guardarPesoActual(input.value));
  });

  listaPesos.forEach(li => {
    li.addEventListener("mousedown", e => {
      if (!modoEdicion) return;
      e.preventDefault();
      guardarPesoActual(li.dataset.peso);
    });
  });

  function guardarPesoActual(valor) {
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

  // =========================
  // MODAL HISTORIAL
  // =========================
  btnHistorial.addEventListener("click", () => {
    modalKg.style.display = "flex";
    cargarHistorialKg();
  });

  cerrarKgModal.addEventListener("click", () => {
    modalKg.style.display = "none";
  });

  window.addEventListener("click", e => {
    if (e.target === modalKg) modalKg.style.display = "none";
  });

  // =========================
  // CARGAR HISTORIAL
  // =========================
  function cargarHistorialKg() {
    historialKgLista.innerHTML = "Cargando...";

    fetch("kg/obtenerHistorialKg.php", { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        if (!data.length) {
          historialKgLista.innerHTML = "<p>Sin registros</p>";
          return;
        }

        historialKgLista.innerHTML = data.map(item => `
          <div class="item-historial">
            <strong>Semana ${item.semana}</strong><br>
            📅 ${item.fecha}<br>
            ⚖️ ${item.peso} kg<br>
            ${item.foto ? `<img src="${item.foto}" class="foto-peso">` : ""}
          </div>
        `).join("");
      });
  }

  // =========================
  // GUARDAR NUEVO REGISTRO
  // =========================
  guardarPesoHistorial.addEventListener("click", () => {
    const peso = parseFloat(nuevoPeso.value);

    if (!peso || isNaN(peso)) {
      alert("Ingresa un peso válido");
      return;
    }

    const datos = new FormData();
    datos.append("peso", peso);
    if (fotoPeso.files[0]) {
      datos.append("foto", fotoPeso.files[0]);
    }

    fetch("kg/guardarHistorialKg.php", {
      method: "POST",
      body: datos
    })
      .then(res => res.json())
      .then(() => {
        nuevoPeso.value = "";
        fotoPeso.value = "";
        cargarHistorialKg();
      });
  });

}
