const lista = document.getElementById("listaAhorro");
const totalSpan = document.getElementById("total");
const cuponOverlay = document.getElementById("cuponOverlay");
const cerrarCupon = document.getElementById("cerrarCupon");
const folioSpan = document.getElementById("folioCupon");

let total = 0;

/* =========================
   CUPÓN
   ========================= */
cuponOverlay.style.display = "none";

cerrarCupon.onclick = () => {
  cuponOverlay.style.display = "none";
};

/* =========================
   CARGA INICIAL
   ========================= */
fetch("obtener_ahorro.php")
  .then(res => res.json())
  .then(retos => {

    retos.forEach(reto => {

      const monto = Number(reto.monto);
      const marcadasIniciales = Number(reto.marcadas);
      const totalVeces = Number(reto.total_veces);
      let marcadasActuales = marcadasIniciales;

      const restantesIniciales = totalVeces - marcadasIniciales;

      total += marcadasIniciales * monto;

      /* =========================
         GRUPO
         ========================= */
      const grupo = document.createElement("div");
      grupo.className = "grupo";

      const estaCompletado = marcadasIniciales >= totalVeces && totalVeces > 0;

      if (estaCompletado) {
        grupo.classList.add("completado");
      }

      /* =========================
         HEADER
         ========================= */
      const header = document.createElement("div");
      header.className = "grupo-header";

      const textoEstado = document.createElement("span");
      textoEstado.textContent = estaCompletado
        ? "COMPLETADO 💚"
        : `Restantes: ${restantesIniciales} de ${totalVeces} ▼`;

      header.innerHTML = `<span>$${monto}</span>`;
      header.appendChild(textoEstado);

      /* =========================
         CHECKS
         ========================= */
      const checks = document.createElement("div");
      checks.className = "checks";
      checks.dataset.monto = monto;

      header.onclick = () => {
        checks.style.display =
          checks.style.display === "flex" ? "none" : "flex";
      };

      for (let i = 0; i < totalVeces; i++) {
        const check = document.createElement("input");
        check.type = "checkbox";
        check.checked = i < marcadasIniciales;

        check.onchange = () => {

          marcadasActuales =
            [...checks.children].filter(c => c.checked).length;

          const restantes = totalVeces - marcadasActuales;

          /* =========================
             TOTAL GLOBAL
             ========================= */
          total = 0;
          document.querySelectorAll(".checks").forEach(grp => {
            const montoGrp = Number(grp.dataset.monto);
            const count = [...grp.children].filter(c => c.checked).length;
            total += montoGrp * count;
          });

          totalSpan.textContent = `$${total.toLocaleString()}`;

          /* =========================
             COMPLETADO / NO
             ========================= */
          if (marcadasActuales >= totalVeces && totalVeces > 0) {
            grupo.classList.add("completado");
            textoEstado.textContent = "COMPLETADO 💚";

            cuponOverlay.style.display = "flex";
            folioSpan.textContent = "";

            fetch("guardar_cupon.php", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: `monto=${monto}`
            })
              .then(r => r.json())
              .then(d => {
                if (d?.folio) {
                  folioSpan.textContent = `– Folio: ${d.folio}`;
                }
              });

          } else {
            grupo.classList.remove("completado");
            textoEstado.textContent =
              `Restantes: ${restantes} de ${totalVeces} ▼`;
          }

          guardar(monto, marcadasActuales);
        };

        checks.appendChild(check);
      }

      grupo.appendChild(header);
      grupo.appendChild(checks);
      lista.appendChild(grupo);
    });

    totalSpan.textContent = `$${total.toLocaleString()}`;
  });

/* =========================
   GUARDAR BD
   ========================= */
function guardar(monto, marcadas) {
  const datos = new FormData();
  datos.append("monto", monto);
  datos.append("marcadas", marcadas);

  fetch("guardar_ahorro.php", {
    method: "POST",
    body: datos
  });
}
