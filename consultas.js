// Datos base simulados para la demostración
const datosAvistamientos = [
    { ave: "Chincol", cantidad: 3, fecha: "2026-09-01", lugar: "San Bernardo, Metropolitana de Santiago", archivo: "foto_chincol.jpg" },
    { ave: "Loica", cantidad: 1, fecha: "2026-08-28", lugar: "Valparaíso, Valparaíso", archivo: "loica_video.mp4" },
    { ave: "Cóndor Andino", cantidad: 2, fecha: "2026-08-15", lugar: "Machalí, Región del Libertador Bernardo O'Higgins", archivo: "condor_vuelo.jpg" },
    { ave: "Siete Colores", cantidad: 4, fecha: "2026-07-20", lugar: "Panguipulli, Los Ríos", archivo: "siete_colores.png" },
    { ave: "Picaflor Chico", cantidad: 2, fecha: "2026-06-12", lugar: "La Serena, Coquimbo", archivo: "picaflor.jpg" },
    { ave: "Tiuque", cantidad: 5, fecha: "2026-05-30", lugar: "Chillán, Ñuble", archivo: "tiuque.jpg" },
    { ave: "Bandurria", cantidad: 6, fecha: "2026-04-18", lugar: "Temuco, La Araucanía", archivo: "bandurria.mp4" },
    { ave: "Flamenco Chileno", cantidad: 12, fecha: "2026-03-05", lugar: "San Pedro de Atacama, Antofagasta", archivo: "flamencos.jpg" }
];

const ITEMS_POR_PAGINA = 4;
let paginaActual = 1;

const filtroAveInput = document.getElementById('filtro-ave');
const ordenarPorSelect = document.getElementById('ordenar-por');
const cuerpoTabla = document.getElementById('cuerpo-tabla-avistamientos');
const btnAnterior = document.getElementById('btn-anterior');
const btnSiguiente = document.getElementById('btn-siguiente');
const infoPagina = document.getElementById('info-pagina');

const renderizarTabla = () => {
    const textoFiltro = filtroAveInput.value.trim().toLowerCase();
    const criterioOrden = ordenarPorSelect.value;

    let resultado = datosAvistamientos.filter(item => 
        item.ave.toLowerCase().includes(textoFiltro)
    );

    resultado.sort((a, b) => {
        if (criterioOrden === 'fecha-desc') {
            return new Date(b.fecha) - new Date(a.fecha);
        } else if (criterioOrden === 'fecha-asc') {
            return new Date(a.fecha) - new Date(b.fecha);
        } else if (criterioOrden === 'lugar-asc') {
            return a.lugar.localeCompare(b.lugar);
        } else if (criterioOrden === 'lugar-desc') {
            return b.lugar.localeCompare(a.lugar);
        } else if (criterioOrden === 'ave-asc') {
            return a.ave.localeCompare(b.ave);
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
        celdaVacia.colSpan = 5;
        celdaVacia.style.textAlign = 'center';
        celdaVacia.textContent = 'No se encontraron avistamientos que coincidan con la búsqueda.';
        filaVacia.appendChild(celdaVacia);
        cuerpoTabla.appendChild(filaVacia);
    } else {
        datosPaginados.forEach(item => {
            let tr = document.createElement('tr');

            let tdAve = document.createElement('td');
            tdAve.textContent = item.ave;

            let tdCant = document.createElement('td');
            tdCant.textContent = item.cantidad;

            let tdFecha = document.createElement('td');
            tdFecha.textContent = item.fecha;

            let tdLugar = document.createElement('td');
            tdLugar.textContent = item.lugar;

            let tdArchivo = document.createElement('td');
            let enlace = document.createElement('a');
            enlace.href = '#';
            enlace.className = 'enlace-archivo';
            enlace.textContent = item.archivo;
            tdArchivo.appendChild(enlace);

            tr.appendChild(tdAve);
            tr.appendChild(tdCant);
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