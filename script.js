const modulosCargados = {};
let seccionActual = 'inicio';

async function cambiarPestana(nombre) {
    // 1. Actualizar botones visualmente
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('activo'));
    // Busca el botón que tiene el onclick correspondiente y actívalo (truco simple)
    const botones = document.querySelectorAll('.nav-btn');
    if(nombre === 'inicio') botones[0].classList.add('activo');
    if(nombre === 'escalera') botones[1].classList.add('activo');
    if(nombre === 'espejo') botones[2].classList.add('activo');
    if(nombre === 'registro') botones[3].classList.add('activo');

    // 2. Manejo de Vistas
    const vistaInicio = document.getElementById('vista-inicio');
    const vistaDinamica = document.getElementById('vista-dinamica');
    const contenedor = document.getElementById('contenido-modulo');

    if (nombre === 'inicio') {
        vistaDinamica.classList.remove('activa');
        setTimeout(() => {
            vistaInicio.classList.add('activa');
        }, 100); // Pequeño delay para la transición
        seccionActual = 'inicio';
        return;
    } 
    
    // Si vamos a una sección dinámica (Escalera, Espejo, etc.)
    vistaInicio.classList.remove('activa');
    vistaDinamica.classList.add('activa');

    // Evitar recargar si ya estamos en esa sección y ya cargó
    if (seccionActual === nombre && contenedor.innerHTML.length > 50) return;

    // 3. Cargar contenido dinámico
    try {
        // Spinner de carga suave
        if(seccionActual !== nombre) {
            contenedor.innerHTML = '<div style="text-align:center; margin-top:50px; opacity:0.6">Cargando...</div>';
        }
        
        seccionActual = nombre;

        const response = await fetch(`${nombre}/${nombre}.html?v=${Date.now()}`);
        if (!response.ok) throw new Error("Archivo no encontrado");
        const html = await response.text();
        
        // Inyectar HTML
        contenedor.innerHTML = html;

        // 4. Cargar JS específico
        if (nombre === 'escalera') {
            if (!modulosCargados['escalera']) {
                const script = document.createElement('script');
                script.src = `escalera/escalera.js?v=${Date.now()}`;
                script.onload = () => { if(typeof initEscalera === 'function') initEscalera(); };
                document.body.appendChild(script);
                modulosCargados['escalera'] = true;
            } else {
                if(typeof initEscalera === 'function') initEscalera();
            }
        }
        // (Aquí agregarás los if para espejo y registro después)

    } catch (error) {
        contenedor.innerHTML = `<p style="text-align:center; color:red">Error: ${error.message}</p>`;
    }
}