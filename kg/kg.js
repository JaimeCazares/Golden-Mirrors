function initKg() {
    const listaPesos = document.querySelectorAll("#listaPesos li");
    const pesoSeleccionado = document.getElementById("pesoSeleccionado");
    const btnHistorial = document.getElementById("verHistorialKg");
    const modalKg = document.getElementById("modalKg");
    const cerrarKgModal = document.getElementById("cerrarKgModal");
    const historialKgLista = document.getElementById("historialKgLista");
    const nuevoPeso = document.getElementById("nuevoPeso");
    const guardarPesoHistorial = document.getElementById("guardarPesoHistorial");
    const formHistorial = document.getElementById("formHistorialKg");

    let pesoActual = 0;
    let cacheRegistros = [];
    let bloquearGuardado = false;
    let modoEdicion = false;

    // --- INDICADOR IMC (SEMÁFORO) ---
    function actualizarIMC(pesoKg) {
        if (!pesoKg || pesoKg <= 0) return;
        const altura = 1.80; // <--- AJUSTA TU ALTURA AQUÍ
        const imc = (pesoKg / (altura * altura)).toFixed(1);
        const valDisplay = document.getElementById('val-imc');
        const infoCont = document.getElementById('imc-info');
        
        valDisplay.innerText = imc;

        // Semáforo de colores
        if (imc < 18.5) {
            valDisplay.style.color = "#00e0ff"; // Bajo peso (Cyan)
            infoCont.style.borderColor = "rgba(0, 224, 255, 0.5)";
        } else if (imc >= 18.5 && imc < 25) {
            valDisplay.style.color = "#00ff66"; // Normal (Verde)
            infoCont.style.borderColor = "rgba(0, 255, 102, 0.5)";
        } else if (imc >= 25 && imc < 30) {
            valDisplay.style.color = "#ffcc00"; // Sobrepeso (Amarillo)
            infoCont.style.borderColor = "rgba(255, 204, 0, 0.5)";
        } else {
            valDisplay.style.color = "#ff3c3c"; // Obesidad (Rojo)
            infoCont.style.borderColor = "rgba(255, 60, 60, 0.5)";
        }
    }

    function mostrarIndicador(mensaje, tipo) {
        const c = document.getElementById("mensajeRegistro");
        if (!c) return;
        c.textContent = mensaje;
        c.className = tipo === "success" ? "msg-exito" : "msg-error";
        c.style.display = "block";
        setTimeout(() => { c.style.display = "none"; }, 4000);
    }

    function cargarHistorialKg() {
        historialKgLista.innerHTML = "";
        fetch("kg/obtenerHistorialKg.php", { cache: "no-store" })
            .then(res => res.json())
            .then(registros => {
                cacheRegistros = registros.sort((a, b) => parseInt(a.semana) - parseInt(b.semana));
                const datosSemana = {};
                registros.forEach(r => { datosSemana[r.semana] = r; });

                for (let i = 0; i <= 51; i++) {
                    const btn = document.createElement("div");
                    const data = datosSemana[i];
                    btn.className = data ? "semana-btn completada" : "semana-btn pendiente";
                    btn.innerHTML = `<b>${i}</b><span>${data ? data.peso : '-'}</span>`;
                    if (data) btn.onclick = () => mostrarDetalleSemana(data);
                    historialKgLista.appendChild(btn);
                }
            });
    }

    function guardarPesoActual(valor) {
        const p = parseFloat(valor);
        if (isNaN(p) || p <= 0) {
            pesoSeleccionado.textContent = pesoActual.toFixed(2) + " kg";
            return;
        }
        pesoActual = p;
        pesoSeleccionado.textContent = pesoActual.toFixed(2) + " kg";
        const d = new FormData();
        d.append("peso", pesoActual);
        fetch("kg/guardarKg.php", { method: "POST", body: d });
        actualizarIndicador();
        actualizarIMC(pesoActual);
    }

    function actualizarIndicador() {
        listaPesos.forEach(li => {
            li.classList.remove("superior", "actual");
            const p = parseFloat(li.dataset.peso);
            if (Math.round(p) === Math.round(pesoActual)) li.classList.add("actual");
            else if (p > pesoActual) li.classList.add("superior");
        });
    }

    // Eventos de la lista de pesos superior
    listaPesos.forEach(li => {
        li.onclick = () => {
            pesoActual = parseFloat(li.dataset.peso);
            pesoSeleccionado.textContent = pesoActual.toFixed(2) + " kg";
            const d = new FormData();
            d.append("peso", pesoActual);
            fetch("kg/guardarKg.php", { method: "POST", body: d });
            actualizarIndicador();
            actualizarIMC(pesoActual);
        };
    });

    pesoSeleccionado.onclick = () => {
        if (modoEdicion) return;
        modoEdicion = true;
        pesoSeleccionado.innerHTML = `<input type="number" step="0.01" id="inputPeso" value="${pesoActual}">`;
        const input = document.getElementById("inputPeso");
        input.focus();
        input.onkeydown = (e) => { if (e.key === "Enter") { guardarPesoActual(input.value); modoEdicion = false; } };
        input.onblur = () => { guardarPesoActual(input.value); modoEdicion = false; };
    };

    function fixBtnPos() {
        const ref = pesoSeleccionado.getBoundingClientRect();
        btnHistorial.style.left = ref.left + window.scrollX + "px";
        btnHistorial.style.top = ref.bottom + window.scrollY + 6 + "px";
    }

    window.addEventListener("resize", fixBtnPos);
    btnHistorial.onclick = () => { modalKg.style.display = "flex"; btnHistorial.style.display = "none"; cargarHistorialKg(); };
    cerrarKgModal.onclick = () => { modalKg.style.display = "none"; btnHistorial.style.display = "block"; fixBtnPos(); };

    // Carga inicial
    fetch("kg/obtenerKg.php", { cache: "no-store" })
        .then(res => res.json())
        .then(data => {
            pesoActual = parseFloat(data.peso) || 0;
            if (pesoActual > 0) {
                pesoSeleccionado.textContent = pesoActual.toFixed(2) + " kg";
                actualizarIMC(pesoActual);
            }
            actualizarIndicador();
            fixBtnPos();
        });
}

document.addEventListener("DOMContentLoaded", initKg);