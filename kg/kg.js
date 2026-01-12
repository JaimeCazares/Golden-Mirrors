function initKg() {
    const listaPesos = document.querySelectorAll("#listaPesos li");
    const pesoSeleccionado = document.getElementById("pesoSeleccionado");
    const editarBtnKg = document.getElementById("editarBtnKg");
    const btnHistorial = document.getElementById("verHistorialKg");
    const modalKg = document.getElementById("modalKg");
    const cerrarKgModal = document.getElementById("cerrarKgModal");
    const historialKgLista = document.getElementById("historialKgLista");
    
    // Configurar inputs de archivo
    ['fotoFrente', 'fotoLado', 'fotoAtras'].forEach(id => {
        const input = document.getElementById(id);
        if(input) {
            input.onchange = function() {
                const label = document.getElementById('fileName' + id.replace('foto',''));
                if(label) label.textContent = this.files[0] ? this.files[0].name : "Sin archivo";
            };
        }
    });

    let pesoActual = 0;
    let modoEdicion = false;

    // --- CERRAR MODAL ---
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalKg?.style.display === "flex") {
            modalKg.style.display = "none";
        }
    });

    function actualizarIMC(pesoKg) {
        if (!pesoKg || pesoKg <= 0) return;
        const altura = 1.80; // Altura fija ejemplo
        const imc = (pesoKg / (altura * altura)).toFixed(1);
        const valDisplay = document.getElementById('val-imc');
        const indicador = document.getElementById('imc-indicador');
        
        if (valDisplay) valDisplay.innerText = imc;

        // Escala de IMC: de 15 a 40
        let porcentaje = ((imc - 15) / (40 - 15)) * 100;
        porcentaje = Math.max(0, Math.min(100, porcentaje));
        if (indicador) indicador.style.left = `calc(${porcentaje}% - 8px)`;

        // Colores según rango
        if (valDisplay) {
            if (imc < 18.5) valDisplay.style.color = "#00e0ff";
            else if (imc < 25) valDisplay.style.color = "#00ff66";
            else if (imc < 30) valDisplay.style.color = "#ffcc00";
            else if (imc < 35) valDisplay.style.color = "#ff8c00";
            else valDisplay.style.color = "#ff3c3c";
        }
    }

    function cargarHistorialKg() {
        if(!historialKgLista) return;
        historialKgLista.innerHTML = "";
        fetch("kg/obtenerHistorialKg.php", { cache: "no-store" })
            .then(res => res.json())
            .then(registros => {
                const datosSemana = {};
                registros.forEach(r => { datosSemana[r.semana] = r; });
                for (let i = 0; i <= 51; i++) {
                    const btn = document.createElement("div");
                    const data = datosSemana[i];
                    btn.className = data ? "semana-btn completada" : "semana-btn pendiente";
                    btn.innerHTML = `<b>${i}</b><span>${data ? Math.round(data.peso) : '-'}</span>`;
                    historialKgLista.appendChild(btn);
                }
            });
    }

    function guardarPesoActual(valor) {
        const p = parseFloat(valor);
        if (!isNaN(p) && p > 0) {
            pesoActual = p;
            const d = new FormData();
            d.append("peso", pesoActual);
            fetch("kg/guardarKg.php", { method: "POST", body: d });
            actualizarIndicador();
            actualizarIMC(pesoActual);
        }
        pesoSeleccionado.textContent = pesoActual.toFixed(2) + " kg";
        modoEdicion = false;
        if(editarBtnKg) editarBtnKg.innerHTML = "Editar ✏️";
    }

    function actualizarIndicador() {
        listaPesos.forEach(li => {
            li.classList.remove("superior", "actual");
            const p = parseFloat(li.dataset.peso);
            if (Math.abs(p - pesoActual) < 0.1) li.classList.add("actual"); 
            else if (p > pesoActual) li.classList.add("superior"); 
        });
    }

    if(editarBtnKg) {
        editarBtnKg.onclick = () => {
            if (modoEdicion) {
                const input = document.getElementById("inputPeso");
                if (input) guardarPesoActual(input.value);
            } else {
                modoEdicion = true;
                editarBtnKg.innerHTML = "Listo ✅";
                pesoSeleccionado.innerHTML = `<input type="number" step="0.01" id="inputPeso" value="${pesoActual}" style="width:70px; font-size:14px; text-align:center;">`;
                const input = document.getElementById("inputPeso");
                input.focus();
                setTimeout(() => {
        input.select();
    }, 10);
                input.onkeydown = (e) => { if (e.key === "Enter") guardarPesoActual(input.value); };
            }
        };
    }

    if(btnHistorial) {
        btnHistorial.onclick = () => { 
            if(modalKg) modalKg.style.display = "flex"; 
            cargarHistorialKg(); 
        };
    }
    
    if(cerrarKgModal) {
        cerrarKgModal.onclick = () => { if(modalKg) modalKg.style.display = "none"; };
    }

    fetch("kg/obtenerKg.php", { cache: "no-store" }).then(res => res.json()).then(data => {
        pesoActual = parseFloat(data.peso) || 0;
        if (pesoActual > 0) {
            pesoSeleccionado.textContent = pesoActual.toFixed(2) + " kg";
            actualizarIMC(pesoActual);
        }
        actualizarIndicador();
    });
}
document.addEventListener("DOMContentLoaded", initKg);