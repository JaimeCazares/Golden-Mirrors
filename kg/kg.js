function initKg() {

  const listaPesos = document.querySelectorAll("#listaPesos li");
  const pesoSeleccionado = document.getElementById("pesoSeleccionado");

  if (!listaPesos.length || !pesoSeleccionado) {
    console.error("❌ Elementos de kg no encontrados");
    return;
  }

  let modoEdicion = false;

  // ===== ENTRAR EN MODO EDICIÓN =====
  pesoSeleccionado.addEventListener("click", () => {
    if (modoEdicion) return;

    modoEdicion = true;
    const valorActual = parseInt(pesoSeleccionado.textContent) || "";

    pesoSeleccionado.innerHTML = `
      <input type="number" id="inputPeso" value="${valorActual}">
    `;

    const input = pesoSeleccionado.querySelector("#inputPeso");
    input.focus();
    input.select();

    input.addEventListener("keydown", e => {
      if (e.key === "Enter") guardarPeso(input.value);
    });

    input.addEventListener("blur", () => {
      guardarPeso(input.value);
    });
  });

  // ===== CLICK EN PESOS PREDEFINIDOS =====
  listaPesos.forEach(li => {
    li.addEventListener("mousedown", e => {
      if (!modoEdicion) return;
      e.preventDefault();
      guardarPeso(li.dataset.peso);
    });
  });

  function guardarPeso(valor) {
    if (!valor || isNaN(valor)) {
      pesoSeleccionado.textContent = "PESO";
    } else {
      pesoSeleccionado.textContent = valor + " kg";
    }

    modoEdicion = false;
    actualizarIndicador();
  }

  function actualizarIndicador() {
    const valorActual = parseInt(pesoSeleccionado.textContent);

    listaPesos.forEach(li => {
      li.classList.remove("superior", "actual");

      const pesoLi = parseInt(li.dataset.peso);

      if (isNaN(valorActual)) return;

      if (pesoLi === valorActual) {
        li.classList.add("actual");          // 👈 MISMO PESO
      } else if (pesoLi > valorActual) {
        li.classList.add("superior");        // 👈 MAYORES
      }
    });
  }

  actualizarIndicador();
}
