function initKg() {
    const listaPesos = document.querySelectorAll("#listaPesos li");
    const pesoSeleccionado = document.getElementById("pesoSeleccionado");
    const editarBtnKg = document.getElementById("editarBtnKg");
    const btnHistorial = document.getElementById("verHistorialKg");
    const modalKg = document.getElementById("modalKg");
    const cerrarKgModal = document.getElementById("cerrarKgModal");
    const historialKgLista = document.getElementById("historialKgLista");
    
    // Configurar inputs de archivo para mostrar nombre
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

    // --- CERRAR MODAL CON TECLA ESC ---
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            // Si el modal está visible, ciérralo
            if (modalKg && modalKg.style.display === "flex") {
                modalKg.style.display = "none";
                if (btnHistorial) btnHistorial.style.display = "block";
                fixBtnPos();
            }
        }
    });

    function actualizarIMC(pesoKg) {
        if (!pesoKg || pesoKg <= 0) return;
        const altura = 1.80; 
        const imc = (pesoKg / (altura * altura)).toFixed(1);
        
        const valDisplay = document.getElementById('val-imc');
        const infoCont = document.getElementById('imc-info');
        const indicador = document.getElementById('imc-indicador');
        
        if (valDisplay) valDisplay.innerText = imc;

        let porcentaje = ((imc - 15) / (40 - 15)) * 100;
        if (porcentaje < 0) porcentaje = 0;
        if (porcentaje > 100) porcentaje = 100;
        if (indicador) indicador.style.left = porcentaje + "%";

        if (infoCont && valDisplay) {
            if (imc < 18.5) { valDisplay.style.color = "#00e0ff"; infoCont.style.borderColor = "rgba(0, 224, 255, 0.5)"; }
            else if (imc >= 18.5 && imc < 25) { valDisplay.style.color = "#00ff66"; infoCont.style.borderColor = "rgba(0, 255, 102, 0.5)"; }
            else if (imc >= 25 && imc < 30) { valDisplay.style.color = "#ffcc00"; infoCont.style.borderColor = "rgba(255, 204, 0, 0.5)"; }
            else if (imc >= 30 && imc < 35) { valDisplay.style.color = "#ff8c00"; infoCont.style.borderColor = "rgba(255, 140, 0, 0.5)"; }
            else { valDisplay.style.color = "#ff3c3c"; infoCont.style.borderColor = "rgba(255, 60, 60, 0.5)"; }
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
            if (Math.abs(p - pesoActual) < 0.1) {
                li.classList.add("actual"); 
            } else if (p > pesoActual) {
                li.classList.add("superior"); 
            }
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
                pesoSeleccionado.innerHTML = `Introducir peso actual: <input type="number" step="0.01" id="inputPeso" value="${pesoActual}">`;
                const input = document.getElementById("inputPeso");
                
                input.focus();
                input.select(); 

                input.onkeydown = (e) => { 
                    if (e.key === "Enter") {
                        guardarPesoActual(input.value); 
                    } else if (e.key === "Escape") { 
                        // Cancelar edición con Escape
                        modoEdicion = false;
                        editarBtnKg.innerHTML = "Editar ✏️";
                        pesoSeleccionado.textContent = pesoActual.toFixed(2) + " kg";
                    }
                };
            }
        };
    }

    function fixBtnPos() {
        if (!pesoSeleccionado || !btnHistorial) return;
        const ref = pesoSeleccionado.getBoundingClientRect();
        btnHistorial.style.left = ref.left + window.scrollX + "px";
        btnHistorial.style.top = ref.bottom + window.scrollY + 35 + "px";
    }

    window.addEventListener("resize", fixBtnPos);
    
    if(btnHistorial) {
        btnHistorial.onclick = () => { 
            if(modalKg) modalKg.style.display = "flex"; 
            if(btnHistorial) btnHistorial.style.display = "none"; 
            cargarHistorialKg(); 
        };
    }
    
    if(cerrarKgModal) {
        cerrarKgModal.onclick = () => { 
            if(modalKg) modalKg.style.display = "none"; 
            if(btnHistorial) btnHistorial.style.display = "block"; 
            fixBtnPos(); 
        };
    }

    fetch("kg/obtenerKg.php", { cache: "no-store" }).then(res => res.json()).then(data => {
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