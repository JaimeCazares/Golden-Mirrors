function initKg() {
    const el = {
        pesoSel: document.getElementById("pesoSeleccionado"),
        btnEd: document.getElementById("editarBtnKg"),
        btnHist: document.getElementById("verHistorialKg"),
        modKg: document.getElementById("modalKg"),
        listaHist: document.getElementById("historialKgLista"),
        modFotos: document.getElementById("modalVerFotos"),
        btnGuardar: document.getElementById("guardarPesoHistorial"),
        form: document.getElementById("formHistorialKg")
    };

    let pesoActual = 0, modoEdicion = false;

    // Archivos UI
    ['fotoFrente', 'fotoLado', 'fotoAtras'].forEach(id => {
        const input = document.getElementById(id);
        if(input) input.onchange = function() {
            const lbl = document.getElementById('fileName' + id.replace('foto',''));
            if(lbl) lbl.textContent = this.files[0]?.name || "Sin archivo";
        };
    });

    // Control Modales
    const toggle = (m, show) => m.style.display = show ? "flex" : "none";
    document.getElementById("cerrarKgModal").onclick = () => toggle(el.modKg, false);
    document.getElementById("cerrarVerFotos").onclick = () => toggle(el.modFotos, false);

    window.onclick = (e) => {
        if (e.target == el.modKg) toggle(el.modKg, false);
        if (e.target == el.modFotos) toggle(el.modFotos, false);
    };

    function cargarHistorialKg() {
        if(!el.listaHist) return;
        el.listaHist.innerHTML = "";
        fetch("kg/obtenerHistorialKg.php", { cache: "no-store" })
            .then(r => r.json()).then(data => {
                const regs = {}; data.forEach(r => regs[r.semana] = r);
                for (let i = 0; i <= 51; i++) {
                    const d = regs[i], btn = document.createElement("div");
                    btn.className = `semana-btn ${d ? 'completada' : 'pendiente'}`;
                    btn.innerHTML = `<b>${i}</b><span>${d ? Math.round(d.peso) : '-'}</span>`;
                    if(d) btn.onclick = (e) => {
                        e.stopPropagation();
                        document.getElementById("tituloVerFotos").innerText = "Semana " + d.semana;
                        document.getElementById("infoPesoModal").innerText = `Peso: ${d.peso} kg`;
                        const noPic = 'img/no-photo.png';
                        document.getElementById("imgFrente").src = d.foto_frente || noPic;
                        document.getElementById("imgLado").src = d.foto_lado || noPic;
                        document.getElementById("imgAtras").src = d.foto_atras || noPic;
                        toggle(el.modFotos, true);
                    };
                    el.listaHist.appendChild(btn);
                }
            });
    }

    function actualizarIMC(p) {
        const imc = (p / (1.80 * 1.80)).toFixed(1);
        document.getElementById('val-imc').innerText = imc;
        let pct = Math.max(0, Math.min(100, ((imc - 15) / 25) * 100));
        document.getElementById('imc-indicador').style.left = `calc(${pct}% - 8px)`;
    }

    function guardarPesoActual(val) {
        pesoActual = parseFloat(val) || 0;
        if(pesoActual > 0) {
            const fd = new FormData(); fd.append("peso", pesoActual);
            fetch("kg/guardarKg.php", { method: "POST", body: fd });
            actualizarIMC(pesoActual); actualizarIndicador();
        }
        el.pesoSel.textContent = pesoActual.toFixed(2) + " kg";
        modoEdicion = false; el.btnEd.innerHTML = "Editar ✏️";
    }

    function actualizarIndicador() {
        document.querySelectorAll("#listaPesos li").forEach(li => {
            const p = parseFloat(li.dataset.peso);
            li.classList.remove("superior", "actual");
            if (Math.abs(p - pesoActual) < 0.1) li.classList.add("actual");
            else if (p > pesoActual) li.classList.add("superior");
        });
    }

    el.btnEd.onclick = () => {
        if(modoEdicion) guardarPesoActual(document.getElementById("inputPeso").value);
        else {
            modoEdicion = true; el.btnEd.innerHTML = "Listo ✅";
            el.pesoSel.innerHTML = `<input type="number" id="inputPeso" value="${pesoActual}" style="width:70px; text-align:center; background:transparent; border:none; font-weight:bold;">`;
            document.getElementById("inputPeso").focus();
        }
    };

    el.btnHist.onclick = () => { toggle(el.modKg, true); cargarHistorialKg(); };

    el.btnGuardar.onclick = () => {
        const fd = new FormData(el.form);
        el.btnGuardar.disabled = true; el.btnGuardar.innerText = "GUARDANDO...";
        fetch("kg/guardarHistorialKg.php", { method: "POST", body: fd })
            .then(r => r.json()).then(res => {
                if(res.ok) { alert("¡Registro guardado!"); el.form.reset(); cargarHistorialKg(); }
                else alert("Error: " + res.error);
            }).finally(() => { el.btnGuardar.disabled = false; el.btnGuardar.innerText = "GUARDAR REGISTRO"; });
    };

    document.getElementById("btnVerTodo").onclick = () => window.open("kg/ver_progreso.php", "_blank");
    document.getElementById("btnAntesDespues").onclick = () => window.open("kg/ver_progreso.php?modo=comparar", "_blank");

    fetch("kg/obtenerKg.php").then(r => r.json()).then(data => {
        pesoActual = data.peso || 0;
        if(pesoActual > 0) { el.pesoSel.textContent = pesoActual.toFixed(2) + " kg"; actualizarIMC(pesoActual); }
        actualizarIndicador();
    });
}
document.addEventListener("DOMContentLoaded", initKg);