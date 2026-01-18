function initKg() {
    const listaPesos = document.querySelectorAll("#listaPesos li");
    const pesoSeleccionado = document.getElementById("pesoSeleccionado");
    const editarBtnKg = document.getElementById("editarBtnKg");
    const btnHistorial = document.getElementById("verHistorialKg");
    const modalKg = document.getElementById("modalKg");
    const cerrarKgModal = document.getElementById("cerrarKgModal");
    const historialKgLista = document.getElementById("historialKgLista");
    
    // Elementos del Modal de Visualización
    const modalVerFotos = document.getElementById("modalVerFotos");
    const cerrarVerFotos = document.getElementById("cerrarVerFotos");

    const formHistorial = document.getElementById("formHistorialKg");
    const btnGuardarRegistro = document.getElementById("guardarPesoHistorial");

    let pesoActual = 0;
    let modoEdicion = false;

    // --- CONFIGURACIÓN DE INPUTS DE ARCHIVO ---
    ['fotoFrente', 'fotoLado', 'fotoAtras'].forEach(id => {
        const input = document.getElementById(id);
        if(input) {
            input.onchange = function() {
                const label = document.getElementById('fileName' + id.replace('foto',''));
                if(label) label.textContent = this.files[0] ? this.files[0].name : "Sin archivo";
            };
        }
    });

    // --- CERRAR MODALES ---
    if(cerrarKgModal) cerrarKgModal.onclick = () => modalKg.style.display = "none";
    if(cerrarVerFotos) cerrarVerFotos.onclick = () => modalVerFotos.style.display = "none";

    window.onclick = (event) => {
        if (event.target == modalKg) modalKg.style.display = "none";
        if (event.target == modalVerFotos) modalVerFotos.style.display = "none";
    };

    // --- FUNCIONES DE LÓGICA ---
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
                    
                    if (data) {
                        btn.onclick = () => {
                            // Llenar datos en el modal de visualización
                            document.getElementById("tituloVerFotos").innerText = "Semana " + data.semana;
                            document.getElementById("infoPesoModal").innerText = "Peso registrado: " + data.peso + " kg";
                            
                            // Asignar imágenes o placeholder si no existen
                            document.getElementById("imgFrente").src = data.foto_frente ? data.foto_frente : 'img/no-photo.png';
                            document.getElementById("imgLado").src = data.foto_lado ? data.foto_lado : 'img/no-photo.png';
                            document.getElementById("imgAtras").src = data.foto_atras ? data.foto_atras : 'img/no-photo.png';
                            
                            modalVerFotos.style.display = "flex";
                        };
                    }
                    historialKgLista.appendChild(btn);
                }
            });
    }

    // --- RESTO DE FUNCIONES (INDICADORES, IMC, GUARDAR) ---
    function actualizarIMC(pesoKg) {
        if (!pesoKg || pesoKg <= 0) return;
        const altura = 1.80; 
        const imc = (pesoKg / (altura * altura)).toFixed(1);
        const valDisplay = document.getElementById('val-imc');
        const indicador = document.getElementById('imc-indicador');
        if (valDisplay) valDisplay.innerText = imc;
        let porcentaje = ((imc - 15) / (40 - 15)) * 100;
        porcentaje = Math.max(0, Math.min(100, porcentaje));
        if (indicador) indicador.style.left = `calc(${porcentaje}% - 8px)`;
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
                pesoSeleccionado.innerHTML = `<input type="number" step="0.01" id="inputPeso" value="${pesoActual}" style="width:70px; text-align:center;">`;
                document.getElementById("inputPeso").focus();
            }
        };
    }

    if(btnHistorial) {
        btnHistorial.onclick = () => { 
            if(modalKg) modalKg.style.display = "flex"; 
            cargarHistorialKg(); 
        };
    }

    // BOTONES AUXILIARES
    document.getElementById("btnVerTodo").onclick = () => { window.open("kg/ver_progreso.php", "_blank"); };
    document.getElementById("btnAntesDespues").onclick = () => { window.open("kg/ver_progreso.php?modo=comparar", "_blank"); };

    if (btnGuardarRegistro) {
        btnGuardarRegistro.onclick = () => {
            const formData = new FormData(formHistorial);
            btnGuardarRegistro.disabled = true;
            btnGuardarRegistro.innerText = "GUARDANDO...";
            fetch("kg/guardarHistorialKg.php", { method: "POST", body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    alert("¡Guardado!");
                    formHistorial.reset();
                    cargarHistorialKg();
                } else { alert("Error: " + data.error); }
            })
            .finally(() => {
                btnGuardarRegistro.disabled = false;
                btnGuardarRegistro.innerText = "GUARDAR REGISTRO";
            });
        };
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