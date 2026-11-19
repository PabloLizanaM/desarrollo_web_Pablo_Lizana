/*// Datos base simulados para la demostración
const datosAvistamientos = [
    { ave: "Chincol", cantidad: 3, fecha: "2026-09-01", lugar: "San Bernardo, Metropolitana de Santiago", archivo: "foto_chincol.jpg" },
    { ave: "Loica", cantidad: 1, fecha: "2026-08-28", lugar: "Valparaíso, Valparaíso", archivo: "loica_video.mp4" },
    { ave: "Cóndor Andino", cantidad: 2, fecha: "2026-08-15", lugar: "Machalí, Región del Libertador Bernardo O'Higgins", archivo: "condor_vuelo.jpg" },
    { ave: "Siete Colores", cantidad: 4, fecha: "2026-07-20", lugar: "Panguipulli, Los Ríos", archivo: "siete_colores.png" },
    { ave: "Picaflor Chico", cantidad: 2, fecha: "2026-06-12", lugar: "La Serena, Coquimbo", archivo: "picaflor.jpg" },
    { ave: "Tiuque", cantidad: 5, fecha: "2026-05-30", lugar: "Chillán, Ñuble", archivo: "tiuque.jpg" },
    { ave: "Bandurria", cantidad: 6, fecha: "2026-04-18", lugar: "Temuco, La Araucanía", archivo: "bandurria.mp4" },
    { ave: "Flamenco Chileno", cantidad: 12, fecha: "2026-03-05", lugar: "San Pedro de Atacama, Antofagasta", archivo: "flamencos.jpg" }
];*/

const ITEMS_POR_PAGINA = 5;
let paginaActual = 1;
let avistamientoActual = null;

const filtroAveInput = document.getElementById('filtro-ave');
const ordenarPorSelect = document.getElementById('ordenar-por');
const cuerpoTabla = document.getElementById('cuerpo-tabla-avistamientos');
const btnAnterior = document.getElementById('btn-anterior');
const btnSiguiente = document.getElementById('btn-siguiente');
const infoPagina = document.getElementById('info-pagina');

const modal = document.getElementById('modal-detalle');
const btnCerrarModal = document.getElementById('cerrar-modal');

const renderizarTabla = () => {
    const textoFiltro = filtroAveInput.value.trim().toLowerCase();
    const criterioOrden = ordenarPorSelect.value;

    let resultado = datosAvistamientos.filter(item => 
        item.ave_nombre.toLowerCase().includes(textoFiltro)
    );

    resultado.sort((a, b) => {
        if (criterioOrden === 'fecha-desc') {
            return new Date(b.fecha_hora) - new Date(a.fecha_hora);
        } else if (criterioOrden === 'fecha-asc') {
            return new Date(a.fecha_hora) - new Date(b.fecha_hora);
        } else if (criterioOrden === 'lugar-asc') {
            return a.comuna_nombre.localeCompare(b.comuna_nombre);
        } else if (criterioOrden === 'lugar-desc') {
            return b.comuna_nombre.localeCompare(a.comuna_nombre);
        } else if (criterioOrden === 'ave-asc') {
            return a.ave_nombre.localeCompare(b.ave_nombre);
        }
        return 0;
    });

    const totalPaginas = Math.ceil(resultado.length / ITEMS_POR_PAGINA) || 1;
    if (paginaActual > totalPaginas) paginaActual = totalPaginas;

    const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
    const fin = inicio + ITEMS_POR_PAGINA;
    const datosPaginados = resultado.slice(inicio, fin);

    cuerpoTabla.innerHTML = '';

    if (datosPaginados.length === 0) {
        let filaVacia = document.createElement('tr');
        let celdaVacia = document.createElement('td');
        celdaVacia.colSpan = 4;
        celdaVacia.style.textAlign = 'center';
        celdaVacia.textContent = 'No se encontraron avistamientos que coincidan con la búsqueda.';
        filaVacia.appendChild(celdaVacia);
        cuerpoTabla.appendChild(filaVacia);
    } else {
        datosPaginados.forEach(item => {
            let tr = document.createElement('tr');
            tr.className = 'fila-avistamiento';
            tr.onclick = () => {abrirDetalleAvistamiento(item.id)};

            let tdAve = document.createElement('td');
            tdAve.textContent = item.ave_nombre;

            let tdFecha = document.createElement('td');
            tdFecha.textContent = item.fecha_hora;

            let tdLugar = document.createElement('td');
            tdLugar.textContent = item.comuna_nombre;

            let tdArchivo = document.createElement('td');
            tdArchivo.textContent = `${item.cantidad_archivos} archivo(s)`;

            tr.appendChild(tdAve);
            tr.appendChild(tdFecha);
            tr.appendChild(tdLugar);
            tr.appendChild(tdArchivo);

            cuerpoTabla.appendChild(tr);
        });
    }

    infoPagina.textContent = `Página ${paginaActual} de ${totalPaginas}`;
    btnAnterior.disabled = paginaActual === 1;
    btnSiguiente.disabled = paginaActual === totalPaginas || totalPaginas === 0;
};

const abrirDetalleAvistamiento = async (id) => {
    avistamientoActual = id;
    try {
        const response = await fetch(`/consulta/${id}`);
        const data = await response.json();

        if (data.id) {
            document.getElementById('modal-ave-nombre').textContent = data.ave_nombre;
            document.getElementById('modal-voluntario').textContent = data.voluntario_nombre;
            document.getElementById('modal-fecha').textContent = data.fecha_hora;
            document.getElementById('modal-ubicacion').textContent = ` ${data.comuna_nombre}, ${data.region_nombre}`;
            document.getElementById('modal-descripcion').textContent = data.descripcion;

            const modalArchivos = document.getElementById('modal-galeria');
            modalArchivos.innerHTML = '';

            if (data.archivos && data.archivos.length > 0) {
                data.archivos.forEach(archivo => {
                    const rutaLimpia = archivo.ruta_archivo.replace(/^\/+|\/+$/g, '');
                    const rutaArchivo = `/static/${rutaLimpia}/${archivo.nombre_archivo}`;
                    const ext = archivo.nombre_archivo.split('.').pop().toLowerCase();

                    if(['mp4', 'mov'].includes(ext)) {
                        let video = document.createElement('video');
                        video.src = rutaArchivo;
                        video.controls = true;
                        video.style.maxWidth = '100%';
                        modalArchivos.appendChild(video);
                    } else {
                        let img = document.createElement('img');
                        img.src = rutaArchivo;
                        img.alt = data.ave_nombre;
                        img.style.maxWidth = '100%';
                        modalArchivos.appendChild(img);
                    }
                });
            } else {
                modalArchivos.textContent = 'No hay evidencia disponible para este avistamiento.';
            }

            renderizarComentarios(data.comentarios);
            document.getElementById('form-comentario').reset();
            document.getElementById('mensaje-comentario-resultado').textContent = '';

            modal.style.display = 'flex';
        }
    } catch (error) {
        console.error('Error al abrir el detalle del avistamiento:', error);
    }
};

const renderizarComentarios = (comentarios) => {
    const contenedorComentarios = document.getElementById('modal-lista-comentarios');
    contenedorComentarios.innerHTML = '';

    if (comentarios && comentarios.length > 0) {
        comentarios.forEach(comentario => {
            let divComentario = document.createElement('div');
            divComentario.className = 'comentario-item';
            
            let pComentario = document.createElement('p');
            pComentario.className = 'comentario-meta';
            pComentario.innerHTML = `<strong>${comentario.nombre}</strong> - ${comentario.fecha}`;

            let pTexto = document.createElement('p');
            pTexto.className = 'comentario-texto';
            pTexto.textContent = comentario.texto;

            divComentario.appendChild(pComentario);
            divComentario.appendChild(pTexto);
            contenedorComentarios.appendChild(divComentario);
        });
    } else {
        contenedorComentarios.innerHTML = '<p style="color: #64748b; font-style: italic;">No hay comentarios para este avistamiento.</p>';
    }
};

document.getElementById('form-comentario').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('comentarista-nombre').value.trim();
    const texto = document.getElementById('comentario-texto').value.trim();
    const resultadoMensaje = document.getElementById('mensaje-comentario-resultado');

    if (nombre.length < 3 || nombre.length > 50) {
        resultadoMensaje.textContent = 'El nombre debe tener entre 3 y 50 caracteres.';
        return;
    }

    if (texto.length < 5) {
        resultadoMensaje.textContent = 'El comentario debe tener al menos 5 caracteres.';
        return;
    }

    try {
        const response = await fetch(`/consulta/${avistamientoActual}/comentario`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, texto })
        });

        const data = await response.json();

        if (data.success) {
            resultadoMensaje.textContent = data.message;
            document.getElementById('form-comentario').reset();

            abrirDetalleAvistamiento(avistamientoActual);
        } else {
            resultadoMensaje.textContent = `Error: ${data.message}`;
        }
    } catch (error) {
        console.error('Error al enviar el comentario:', error);
        resultadoMensaje.textContent = 'Ocurrió un error al enviar el comentario.';
    }
});

btnCerrarModal.onclick = () => {
    modal.style.display = 'none';
};

window.onclick = (event) => { 
    if (event.target === modal) { 
        modal.style.display = 'none'; 
    } 
};

filtroAveInput.addEventListener('input', () => {
    paginaActual = 1;
    renderizarTabla();
});

ordenarPorSelect.addEventListener('change', () => {
    renderizarTabla();
});

btnAnterior.addEventListener('click', () => {
    if (paginaActual > 1) {
        paginaActual--;
        renderizarTabla();
    }
});

btnSiguiente.addEventListener('click', () => {
    paginaActual++;
    renderizarTabla();
});

// Carga inicial
renderizarTabla();