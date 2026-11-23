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

const listaAvistamientos = typeof datosAvistamientos !== 'undefined' && Array.isArray(datosAvistamientos) ? datosAvistamientos: [];

const busquedaInput = document.getElementById('busqueda-avistamiento');
const ordenarPorSelect = document.getElementById('ordenar-por');
const cuerpoTabla = document.getElementById('cuerpo-tabla-avistamientos');
const btnAnterior = document.getElementById('btn-anterior');
const btnSiguiente = document.getElementById('btn-siguiente');
const infoPagina = document.getElementById('info-pagina');

const modal = document.getElementById('modal-detalle');
const btnCerrarModal = document.getElementById('cerrar-modal');
const formComentario = document.getElementById('form-comentario');

const modalEvaluar = document.getElementById('modal-evaluar');
const btnCerrarModalEvaluar = document.getElementById('cerrar-modal-evaluar');
const btnCancelarEvaluar = document.getElementById('btn-cancelar-evaluar');
const formEvaluar = document.getElementById('form-evaluar');
const inputNota = document.getElementById('input-nota');
const errorNota = document.getElementById('error-nota');
const evaluarDescripcion = document.getElementById('evaluar-descripcion');

let itemEvaluando = null;

const escaparRegex = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const crearCeldaConResaltado = (textoOriginal, patron) => {
    const td = document.createElement('td');
    const texto = textoOriginal ? String(textoOriginal) : '';

    if (!patron) {
        td.textContent = texto;
        return td;
    }

    const regex = new RegExp(`(${escaparRegex(patron)})`, 'gi');
    const partes = texto.split(regex);

    partes.forEach(parte => {
        if (!parte) return;
        if (parte.toLowerCase() === patron.toLowerCase()) {
            const mark = document.createElement('mark');
            mark.textContent = parte;
            td.appendChild(mark);
        } else {
            td.appendChild(document.createTextNode(parte));
        }
    });

    return td;
};

const obtenerDia = (fechaHora) => {
    if (!fechaHora) return '';
    return String(fechaHora).split('T')[0].split(' ')[0];
};

const renderizarTabla = () => {
    if (!cuerpoTabla) return;

    const patronOriginal = busquedaInput ? busquedaInput.value.trim() : '';
    const textoFiltro = patronOriginal.toLowerCase();
    const criterioOrden = ordenarPorSelect ? ordenarPorSelect.value : 'fecha-desc';

    let resultado = listaAvistamientos.filter(item =>{ 
        if (!textoFiltro) return true;
        const ave = (item.ave_nombre || '').toLowerCase();
        const voluntario = (item.voluntario_nombre || '').toLowerCase();
        const comuna = (item.comuna_nombre || '').toLowerCase();
        return ave.includes(textoFiltro) || voluntario.includes(textoFiltro) || comuna.includes(textoFiltro);
    });

    resultado.sort((a, b) => {
        if (criterioOrden === 'fecha-desc') {
            return new Date(b.fecha_hora) - new Date(a.fecha_hora);
        } else if (criterioOrden === 'fecha-asc') {
            return new Date(a.fecha_hora) - new Date(b.fecha_hora);
        } else if (criterioOrden === 'lugar-asc') {
            return (a.comuna_nombre || '').localeCompare(b.comuna_nombre || '');
        } else if (criterioOrden === 'lugar-desc') {
            return (b.comuna_nombre || '').localeCompare(a.comuna_nombre || '');
        } else if (criterioOrden === 'ave-asc') {
            return (a.ave_nombre || '').localeCompare(b.ave_nombre || '');
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
        celdaVacia.colSpan = 7;
        celdaVacia.style.textAlign = 'center';
        celdaVacia.textContent = patronOriginal ? `No se encontraron avistamientos que coincidan con "${patronOriginal}".` : 'No hay avistamientos registrados.';
        filaVacia.appendChild(celdaVacia);
        cuerpoTabla.appendChild(filaVacia);
    } else {
        datosPaginados.forEach(item => {
            let tr = document.createElement('tr');
            tr.className = 'fila-avistamiento';
            tr.onclick = () => abrirDetalleAvistamiento(item.id);

            let tdAve = crearCeldaConResaltado(item.ave_nombre, patronOriginal);
            let tdVoluntario = crearCeldaConResaltado(item.voluntario_nombre, patronOriginal);

            let tdFecha = document.createElement('td');
            tdFecha.textContent = item.fecha_hora || obtenerDia(item.fecha_hora);

            let tdComuna = crearCeldaConResaltado(item.comuna_nombre, patronOriginal);

            let tdArchivo = document.createElement('td');
            tdArchivo.textContent = `${item.cantidad_archivos ?? 0} archivo(s)`;

            let tdNota = document.createElement('td');
            tdNota.textContent = (item.nota_promedio !== null && item.nota_promedio !== undefined) ? Number(item.nota_promedio).toFixed(1): '-';

            let tdEvaluar = document.createElement('td');
            let btnEvaluar = document.createElement('button');
            btnEvaluar.type = 'button';
            btnEvaluar.className = 'btn-evaluar';
            btnEvaluar.textContent = 'Evaluar';
            btnEvaluar.onclick = (e) => evaluarAvistamiento(item, e);
            tdEvaluar.appendChild(btnEvaluar);

            tr.appendChild(tdAve);
            tr.appendChild(tdVoluntario);
            tr.appendChild(tdFecha);
            tr.appendChild(tdComuna);
            tr.appendChild(tdArchivo);
            tr.appendChild(tdNota);
            tr.appendChild(tdEvaluar);

            cuerpoTabla.appendChild(tr);
        });
    }

    if (infoPagina) infoPagina.textContent = `Página ${paginaActual} de ${totalPaginas}`;
    if (btnAnterior) btnAnterior.disabled = paginaActual === 1;
    if (btnSiguiente) btnSiguiente.disabled = paginaActual === totalPaginas || totalPaginas === 0;
};

const abrirDetalleAvistamiento = async (id) => {
    avistamientoActual = id;
    try {
        const response = await fetch(`/consulta/${id}`);
        const data = await response.json();

        if (data && data.id && modal) {
            document.getElementById('modal-ave-nombre').textContent = data.ave_nombre;
            document.getElementById('modal-voluntario').textContent = data.voluntario_nombre;
            document.getElementById('modal-fecha').textContent = data.fecha_hora;
            document.getElementById('modal-ubicacion').textContent = ` ${data.comuna_nombre}, ${data.region_nombre}`;
            document.getElementById('modal-descripcion').textContent = data.descripcion || '';

            const modalArchivos = document.getElementById('modal-galeria');
            modalArchivos.innerHTML = '';

            if (data.archivos && data.archivos.length > 0) {
                data.archivos.forEach(archivo => {
                    const nombreArchivo = (archivo.nombre_archivo || '').replace(/^\/+/, '');
                    const carpetaLimpia = (archivo.ruta_archivo || '').replace(/^\/+|\/+$/g, '').replace(/^static\/?/i, '').replace(/^uploads\/?/i, '');
                    const rutaArchivo = carpetaLimpia? `/uploads/${carpetaLimpia}/${nombreArchivo}`: `/uploads/${nombreArchivo}`;
                    const ext = (archivo.nombre_archivo || '').split('.').pop().toLowerCase();

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
            if (formComentario) formComentario.reset();
            const resultadoMsg = document.getElementById('mensaje-comentario-resultado');
            if (resultadoMsg) resultadoMsg.textContent = '';

            modal.style.display = 'flex';
        }
    } catch (error) {
        console.error('Error al abrir el detalle del avistamiento:', error);
    }
};

const renderizarComentarios = (comentarios) => {
    const contenedorComentarios = document.getElementById('modal-lista-comentarios');
    if (!contenedorComentarios) return;
    contenedorComentarios.innerHTML = '';

    if (comentarios && comentarios.length > 0) {
        comentarios.forEach(comentario => {
            let divComentario = document.createElement('div');
            divComentario.className = 'comentario-item';
            
            let pComentario = document.createElement('p');
            pComentario.className = 'comentario-meta';

            let strong = document.createElement('strong');
            strong.textContent = comentario.nombre;
            pComentario.appendChild(strong);
            pComentario.appendChild(document.createTextNode(` - ${comentario.fecha}`));

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

const cerrarModalEvaluar = () => {
    if (modalEvaluar) modalEvaluar.style.display = 'none';
    if (formEvaluar) formEvaluar.reset();
    if (errorNota) errorNota.classList.remove('visible');
    itemEvaluando = null;
};

const evaluarAvistamiento = (item, event) => {
    if (event) event.stopPropagation();
    itemEvaluando = item;
    if (evaluarDescripcion) {
        evaluarDescripcion.textContent = `Ingrese una nota entera entre 1 y 7 para "${item.ave_nombre}":`;
    }
    if (errorNota) errorNota.classList.remove('visible');
    if (inputNota) {
        inputNota.value = '';
        modalEvaluar.style.display = 'flex';
        inputNota.focus();
    }
};

if (formEvaluar) {
    formEvaluar.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!itemEvaluando || !inputNota) return;

        const raw = inputNota.value.trim();
        const notaNum = Number(raw);

        if (!raw || !Number.isInteger(notaNum) || notaNum < 1 || notaNum > 7) {
            if (errorNota) errorNota.classList.add('visible');
            return;
        }

        if (errorNota) errorNota.classList.remove('visible');

        try {
            const response = await fetch(`/consulta/${itemEvaluando.id}/nota`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nota: notaNum })
            });
            const data = await response.json();

            if (response.ok && data.success) {
                itemEvaluando.nota_promedio = data.nota_promedio;
                renderizarTabla();
                cerrarModalEvaluar();
            } else {
                if (errorNota) {
                    errorNota.textContent = data.message || 'No se pudo registrar la nota.';
                    errorNota.classList.add('visible');
                }
            }
        } catch (error) {
            console.error('Error al evaluar avistamiento:', error);
            if (errorNota) {
                errorNota.textContent = 'Error de conexión al guardar la nota.';
                errorNota.classList.add('visible');
            }
        }
    });
}

if (formComentario) {
    formComentario.addEventListener('submit', async (e) => {
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
                formComentario.reset();
                abrirDetalleAvistamiento(avistamientoActual);
            } else {
                resultadoMensaje.textContent = `Error: ${data.message}`;
            }
        } catch (error) {
            console.error('Error al enviar el comentario:', error);
            resultadoMensaje.textContent = 'Ocurrió un error al enviar el comentario.';
        }
    });
}

if (busquedaInput) {
    busquedaInput.addEventListener('input', () => {
        paginaActual = 1;
        renderizarTabla();
    });
}

if (btnCerrarModal && modal) {
    btnCerrarModal.onclick = () => {
        modal.style.display = 'none';
    };
}

if (btnCerrarModalEvaluar) btnCerrarModalEvaluar.onclick = cerrarModalEvaluar;
if (btnCancelarEvaluar) btnCancelarEvaluar.onclick = cerrarModalEvaluar;

window.addEventListener('click', (event) => {
    if (modalEvaluar && event.target === modalEvaluar) {
        cerrarModalEvaluar();
    }
});

window.addEventListener('click', (event) => {
    if (modal && event.target === modal) {
        modal.style.display = 'none';
    }
});

if (ordenarPorSelect) {
    ordenarPorSelect.addEventListener('change', () => {
        renderizarTabla();
    });
}

if (btnAnterior) {
    btnAnterior.addEventListener('click', () => {
        if (paginaActual > 1) {
            paginaActual--;
            renderizarTabla();
        }
    });
}

if (btnSiguiente) {
    btnSiguiente.addEventListener('click', () => {
        paginaActual++;
        renderizarTabla();
    });
}

// Carga inicial
renderizarTabla();