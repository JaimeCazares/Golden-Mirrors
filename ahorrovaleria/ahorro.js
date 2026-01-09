const lista = document.getElementById("listaAhorro");
const totalSpan = document.getElementById("total");
const cuponOverlay = document.getElementById("cuponOverlay");
const cerrarCupon = document.getElementById("cerrarCupon");

let total = 0;

/* =========================
   CERRAR CUPÓN
   ========================= */
if (cerrarCupon) {
  cerrarCupon.onclick = () => {
    cuponOverlay.style.display = "none";
  };
}

/* =========================
   CARGAR AHORROS
   ========================= */
fetch("obtener_ahorro.php")
  .then(res => res.json())
  .then(retos => {

    retos.forEach(reto => {
      let restantes = reto.total_veces - reto.marcadas;
      total += reto.marcadas * reto.monto;

      const grupo = document.createElement("div");
      grupo.className = "grupo";

      if (restantes === 0) {
        grupo.classList.add("completado");
      }

      const header = document.createElement("div");
      header.className = "grupo-header";
      header.innerHTML = `
        <span>$${reto.monto}</span>
        <span id="rest-${reto.monto}">
          ${restantes === 0
            ? "COMPLETADO 💚"
            : `Restantes: ${restantes} de ${reto.total_veces} ▼`}
        </span>
      `;

      const checks = document.createElement("div");
      checks.className = "checks";
      checks.dataset.monto = reto.monto;

      header.onclick = () => {
        checks.style.display =
          checks.style.display === "flex" ? "none" : "flex";
      };

      for (let i = 0; i < reto.total_veces; i++) {
        const check = document.createElement("input");
        check.type = "checkbox";

        if (i < reto.marcadas) check.checked = true;

        check.onchange = () => {
          const marcadas = [...checks.children].filter(c => c.checked).length;
          restantes = reto.total_veces - marcadas;

          /* ===== recalcular total ===== */
          total = 0;
          document.querySelectorAll(".checks").forEach(grp => {
            const monto = grp.dataset.monto;
            const count = [...grp.children].filter(c => c.checked).length;
            total += monto * count;
          });

          totalSpan.textContent = `$${total.toLocaleString()}`;

          const restSpan = document.getElementById(`rest-${reto.monto}`);

          /* ===== COMPLETADO ===== */
          if (restantes === 0) {
            grupo.classList.add("completado");

            // refuerzo visual (móvil)
            grupo.style.backgroundColor = "#e6f8ec";
            grupo.style.border = "2px solid #6fcf97";
            grupo.style.boxShadow =
              "0 6px 14px rgba(47, 143, 91, 0.25)";

            restSpan.textContent = "COMPLETADO 💚";

            /* ===== CUPÓN (solo una vez por monto) ===== */
            const key = `cupon-${reto.monto}`;
            if (!localStorage.getItem(key)) {
              if (cuponOverlay) {
                cuponOverlay.style.display = "flex";
              }
              localStorage.setItem(key, "mostrado");
            }

          } else {
            grupo.classList.remove("completado");

            grupo.style.backgroundColor = "";
            grupo.style.border = "";
            grupo.style.boxShadow = "";

            restSpan.textContent =
              `Restantes: ${restantes} de ${reto.total_veces} ▼`;
          }

          guardar(reto.monto, marcadas);
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
   GUARDAR EN BD
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
