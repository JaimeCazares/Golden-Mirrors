const retos = [
  { veces: 6,  monto: 500 },
  { veces: 12, monto: 200 },
  { veces: 22, monto: 100 },
  { veces: 26, monto: 50 },
  { veces: 28, monto: 20 },
  { veces: 26, monto: 10 },
  { veces: 36, monto: 5 },
  { veces: 42, monto: 2 },
  { veces: 50, monto: 1 }
];

const lista = document.getElementById("listaAhorro");
const totalSpan = document.getElementById("total");

let total = 0;

retos.forEach(reto => {
  let restantes = reto.veces;

  const grupo = document.createElement("div");
  grupo.className = "grupo";

  const header = document.createElement("div");
  header.className = "grupo-header";
  header.innerHTML = `
    <span>$${reto.monto}</span>
    <span id="rest-${reto.monto}">Restantes: ${restantes} ▼</span>
  `;

  const checks = document.createElement("div");
  checks.className = "checks";

  header.addEventListener("click", () => {
    checks.style.display = checks.style.display === "flex" ? "none" : "flex";
  });

  for (let i = 0; i < reto.veces; i++) {
    const check = document.createElement("input");
    check.type = "checkbox";

    check.addEventListener("change", () => {
      if (check.checked) {
        total += reto.monto;
        restantes--;
      } else {
        total -= reto.monto;
        restantes++;
      }

      totalSpan.textContent = `$${total.toLocaleString()}`;
      document.getElementById(`rest-${reto.monto}`).textContent =
        `Restantes: ${restantes} ▼`;
    });

    checks.appendChild(check);
  }

  grupo.appendChild(header);
  grupo.appendChild(checks);
  lista.appendChild(grupo);
});
