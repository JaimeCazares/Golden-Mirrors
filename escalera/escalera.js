let estadoEscalera = {};

function initEscalera() {
    cargarDatosEscalera();
    
    // Listener para calcular objetivo al escribir
    const input = document.getElementById('input-monto');
    if(input) {
        input.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value) || 0;
            const obj = document.getElementById('txt-objetivo');
            if(obj) obj.innerText = `$${(val * 2).toFixed(2)}`;
        });
    }
}

function cargarDatosEscalera() {
    const formData = new FormData();
    formData.append('action', 'get');

    // IMPORTANTE: Asegurate de tener el archivo PHP o cambiar esto a localStorage si no usas BD aún
    fetch('escalera/escalera_api.php', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
            estadoEscalera = data;
            renderEscalera();
        })
        .catch(err => {
            console.log("Usando modo offline por error de conexión");
            // Fallback si no hay BD conectada aún
            estadoEscalera = { dia_actual: 1, monto_actual: 100, estado: 'activo' };
            renderEscalera();
        });
}

function renderEscalera() {
    const dia = parseInt(estadoEscalera.dia_actual);
    const monto = parseFloat(estadoEscalera.monto_actual);
    
    const displayDia = document.getElementById('dia-display');
    const inputMonto = document.getElementById('input-monto');
    const txtObjetivo = document.getElementById('txt-objetivo');
    const badge = document.getElementById('status-escalera');

    if(displayDia) displayDia.innerText = `DÍA ${dia}`;
    if(inputMonto) inputMonto.value = monto;
    if(txtObjetivo) txtObjetivo.innerText = `$${(monto * 2).toFixed(2)}`;
    if(badge) badge.innerText = estadoEscalera.estado ? estadoEscalera.estado.toUpperCase() : 'ACTIVO';

    // Pasos visuales
    for(let i=1; i<=5; i++) {
        const step = document.getElementById(`step-${i}`);
        if(step) {
            step.className = 'step'; // Reset
            if (i < dia) step.classList.add('completed');
            if (i === dia) step.classList.add('active');
        }
    }

    // Bloquear input si no es dia 1
    if(inputMonto) {
        if(dia > 1) {
            inputMonto.disabled = true; 
            inputMonto.style.opacity = 0.7;
        } else {
            inputMonto.disabled = false;
            inputMonto.style.opacity = 1;
        }
    }
}

function resultadoEscalera(gano) {
    let nuevoDia = parseInt(estadoEscalera.dia_actual);
    let nuevoMonto = parseFloat(document.getElementById('input-monto').value);
    let nuevoEstado = 'activo';

    if (gano) {
        if (nuevoDia >= 5) {
            alert("¡FELICIDADES! HAS COMPLETADO LA ESCALERA 🔥💰");
            nuevoEstado = 'completado';
            nuevoDia = 1; // Reinicio automático
            nuevoMonto = 100; 
        } else {
            nuevoDia++;
            nuevoMonto = nuevoMonto * 2; // Interés compuesto
        }
    } else {
        alert("Ánimo, a empezar de nuevo. 📉");
        nuevoEstado = 'perdido'; 
        nuevoDia = 1;
        nuevoMonto = 100; 
    }

    guardarEstado(nuevoDia, nuevoMonto, 'activo');
}

function resetEscalera() {
    if(confirm("¿Seguro que quieres borrar tu progreso y empezar del Día 1?")) {
        guardarEstado(1, 100, 'activo');
    }
}

function guardarEstado(dia, monto, estado) {
    const fd = new FormData();
    fd.append('action', 'update');
    fd.append('dia', dia);
    fd.append('monto', monto);
    fd.append('estado', estado);

    fetch('escalera/escalera_api.php', { method: 'POST', body: fd })
        .then(res => res.text())
        .then(res => {
            // Actualizar localmente para sentirlo instantáneo
            estadoEscalera.dia_actual = dia;
            estadoEscalera.monto_actual = monto;
            estadoEscalera.estado = estado;
            renderEscalera();
        });
}