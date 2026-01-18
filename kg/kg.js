function initKg() {
    const listaPesos = document.querySelectorAll("#listaPesos li");
    const pesoSeleccionado = document.getElementById("pesoSeleccionado");
    const editarBtnKg = document.getElementById("editarBtnKg");
    const btnHistorial = document.getElementById("verHistorialKg");
    const modalKg = document.getElementById("modalKg");
    const cerrarKgModal = document.getElementById("cerrarKgModal");
    const historialKgLista = document.getElementById("historialKgLista");
    
    const modalVerFotos = document.getElementById("modalVerFotos");
    const cerrarVerFotos = document.getElementById("cerrarVerFotos");
    const formHistorial = document.getElementById("formHistorialKg");
    const btnGuardarRegistro = document.getElementById("guardarPesoHistorial");

    let pesoActual = 0;
    let modoEdicion = false;

    ['fotoFrente', 'fotoLado', 'fotoAtras'].forEach(id => {
        const input = document.getElementById(id);
        if(input) {
            input.onchange = function() {
                const label = document.getElementById('fileName' + id.replace('foto',''));
                if(label) label.textContent = this.files[0] ? this.files[0].name : "Sin archivo";
            };
        }
    });

    if(cerrarKgModal) cerrarKgModal.onclick = () => modalKg.style.display = "none";
    if(cerrarVerFotos) cerrarVerFotos.onclick = () => modalVerFotos.style.display = "none";

    window.onclick = (event) => {
        if (event.target == modalKg) modalKg.style.display = "none";
        if (event.target == modalVerFotos) modalVerFotos.style.display = "none";
    };

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
                    if (data) {
                        btn.onclick = (e) => {
                            e.stopPropagation();
                            document.getElementById("tituloVerFotos").innerText = "Semana " + data.semana;
                            document.getElementById("imgFrente").src = data.foto_frente || 'img/no-photo.png';
                            document.getElementById("imgLado").src = data.foto_lado || 'img/no-photo.png';
                            document.getElementById("imgAtras").src = data.foto_atras || 'img/no-photo.png';
                            document.getElementById("infoPesoModal").innerText = "Peso: " + data.peso + " kg";
                            modalVerFotos.style.display = "flex";
                        };
                    }
                    historialKgLista.appendChild(btn);
                }
            });
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
                if (input) {
                    pesoActual = parseFloat(input.value);
                    const d = new FormData();
                    d.append("peso", pesoActual);
                    fetch("kg/guardarKg.php", { method: "POST", body: d });
                    actualizarIMC(pesoActual);
                    actualizarIndicador();
                    pesoSeleccionado.textContent = pesoActual.toFixed(2) + " kg";
                    modoEdicion = false;
                    editarBtnKg.innerHTML = "Editar ✏️";
                }
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
            modalKg.style.display = "flex"; 
            cargarHistorialKg(); 
        };
    }

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
            .catch(err => alert("Error de conexión al servidor."))
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