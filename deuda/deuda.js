function initDeuda() {
  const lista = document.getElementById("listaDeudas");
  const totalEl = document.getElementById("totalDeuda");
  const editarBtn = document.getElementById("editarBtn");

  let modoEditar = false;

  editarBtn.onclick = () => {
    modoEditar = !modoEditar;
    editarBtn.textContent = modoEditar ? "✅" : "✏️";
  };

  lista.onclick = e => {
    if (!modoEditar || e.target.tagName !== "LI") return;

    e.target.classList.toggle("pagada");

    guardarEstado(
      e.target.dataset.nombre,
      e.target.classList.contains("pagada") ? 1 : 0
    );

    actualizarTotal();
  };

  cargarDeudas();

  function cargarDeudas() {
    fetch("deuda/obtenerDeudas.php", { cache: "no-store" })
      .then(r => r.json())
      .then(data => {
        lista.innerHTML = "";

        data.forEach(d => {
          const li = document.createElement("li");
          li.dataset.nombre = d.nombre;
          li.dataset.monto = d.monto;
          li.textContent = `${d.nombre} = $${d.monto.toLocaleString()}`;
          if (d.pagada == 1) li.classList.add("pagada");
          lista.appendChild(li);
        });

        actualizarTotal();
      });
  }

  function guardarEstado(nombre, pagada) {
    const fd = new FormData();
    fd.append("nombre", nombre);
    fd.append("pagada", pagada);

    fetch("deuda/guardarDeuda.php", {
      method: "POST",
      body: fd
    });
  }

  function actualizarTotal() {
    let total = 0;

    lista.querySelectorAll("li").forEach(li => {
      if (!li.classList.contains("pagada")) {
        total += parseInt(li.dataset.monto);
      }
    });

    totalEl.textContent = `TOTAL = $${total.toLocaleString()}`;
  }
}
