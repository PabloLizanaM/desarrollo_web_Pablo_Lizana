const comunasPorRegion = {
    "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
    "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
    "Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
    "Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"],
    "Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paihuano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Concón", "Quintero", "Puchuncaví", "Casablanca", "Juan Fernández", "San Antonio", "Quillota", "San Felipe", "Los Andes"],
    "Metropolitana de Santiago": ["San Bernardo", "Santiago", "Providencia", "Las Condes", "Ñuñoa", "Maipú", "La Florida", "Puente Alto", "Quilicura", "Pudahuel", "Melipilla", "Talagante", "Buin", "Paine"],
    "Libertador General Bernardo O'Higgins": ["Rancagua", "Machalí", "Graneros", "Rengo", "San Fernando", "Santa Cruz", "Pichilemu"],
    "Maule": ["Talca", "Curicó", "Linares", "Constitución", "Cauquenes", "Molina", "San Javier"],
    "Ñuble": ["Chillán", "Chillán Viejo", "Bulnes", "San Carlos", "Coihueco", "Quirihue"],
    "Biobío": ["Concepción", "Talcahuano", "San Pedro de la Paz", "Chiguayante", "Coronel", "Los Ángeles", "Arauco", "Lota"],
    "La Araucanía": ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol", "Victoria"],
    "Los Ríos": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Mariquina", "Máfil", "Paillaco", "Panguipulli", "La Unión", "Río Bueno"],
    "Los Lagos": ["Puerto Montt", "Puerto Varas", "Castro", "Ancud", "Osorno", "Frutillar", "Quellón"],
    "Aysén del General Carlos Ibáñez del Campo": ["Coyhaique", "Puerto Aysén", "Chile Chico", "Cochrane"],
    "Magallanes y de la Antártica Chilena": ["Punta Arenas", "Puerto Natales", "Porvenir", "Cabo de Hornos"]
};

const validarNombreAve = (nombre) => {
    if (!nombre || nombre.trim().length < 3) return false;
    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
    return regexNombre.test(nombre.trim());
};

const validarCantidad = (cantidad) => {
    const num = Number(cantidad);
    return cantidad && !isNaN(num) && num >= 1 && num <= 500;
};

const validarFecha = (fecha) => {
    if (!fecha) return false;
    const fechaSeleccionada = new Date(fecha + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(23, 59, 59, 999);
    return fechaSeleccionada <= hoy;
};

const validarRegion = (region) => region !== "";
const validarComuna = (comuna) => comuna !== "";
const validarArchivo = (archivoInput) => {
    if (!archivoInput.files || archivoInput.files.length === 0) return false;

    const archivo = archivoInput.files[0];
    const esImagenOVideo = archivo.type.startsWith('image/') || archivo.type.startsWith('video/');

    const tamanoMaximoBytes = 50 * 1024 * 1024; // 50MB
    const esTamanoValido = archivo.size <= tamanoMaximoBytes;

    return esImagenOVideo && esTamanoValido;
};

let form = document.getElementById('form-avistamiento');
let nombreAveInput = document.getElementById('nombre-ave');
let cantidadInput = document.getElementById('cantidad-aves');
let fechaInput = document.getElementById('fecha-avistamiento');
let regionSelect = document.getElementById('region-avistamiento');
let comunaSelect = document.getElementById('comuna-avistamiento');
let archivoInput = document.getElementById('archivo-avistamiento');

let errorNombreAve = document.getElementById('error-nombre-ave');
let errorCantidad = document.getElementById('error-cantidad');
let errorFecha = document.getElementById('error-fecha');
let errorRegion = document.getElementById('error-region-avistamiento');
let errorComuna = document.getElementById('error-comuna-avistamiento');
let errorArchivo = document.getElementById('error-archivo');

let listaAvistamientos = document.getElementById('lista-avistamientos');
let totalAvistamientos = document.getElementById('total-avistamientos');

regionSelect.addEventListener('change', () => {
    let regionSeleccionada = regionSelect.value;
    comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';

    if (regionSeleccionada && comunasPorRegion[regionSeleccionada]) {
        comunaSelect.disabled = false;
        comunasPorRegion[regionSeleccionada].forEach(comuna => {
            let option = document.createElement('option');
            option.value = comuna;
            option.textContent = comuna;
            comunaSelect.appendChild(option);
        });
    } else {
        comunaSelect.disabled = true;
    }
});

form.addEventListener('submit', (event) => {
    event.preventDefault();

    let esValido = true;

    if (!validarNombreAve(nombreAveInput.value)) {
        esValido = false;
        nombreAveInput.style.borderColor = 'red';
        errorNombreAve.classList.add('visible');
    } else {
        nombreAveInput.style.borderColor = '';
        errorNombreAve.classList.remove('visible');
    }

    if (!validarCantidad(cantidadInput.value)) {
        esValido = false;
        cantidadInput.style.borderColor = 'red';
        errorCantidad.classList.add('visible');
    } else {
        cantidadInput.style.borderColor = '';
        errorCantidad.classList.remove('visible');
    }

    if (!validarFecha(fechaInput.value)) {
        esValido = false;
        fechaInput.style.borderColor = 'red';
        errorFecha.classList.add('visible');
    } else {
        fechaInput.style.borderColor = '';
        errorFecha.classList.remove('visible');
    }

    if (!validarRegion(regionSelect.value)) {
        esValido = false;
        regionSelect.style.borderColor = 'red';
        errorRegion.classList.add('visible');
    } else {
        regionSelect.style.borderColor = '';
        errorRegion.classList.remove('visible');
    }

    if (!validarComuna(comunaSelect.value)) {
        esValido = false;
        comunaSelect.style.borderColor = 'red';
        errorComuna.classList.add('visible');
    } else {
        comunaSelect.style.borderColor = '';
        errorComuna.classList.remove('visible');
    }

    if (!validarArchivo(archivoInput)) {
        esValido = false;
        archivoInput.style.borderColor = 'red';
        errorArchivo.classList.add('visible');
    } else {
        archivoInput.style.borderColor = '';
        errorArchivo.classList.remove('visible');
    }

    if (esValido) {
        if (listaAvistamientos) {
            let item = document.createElement('div');
            item.className = 'avistamiento-item';

            let spanAve = document.createElement('span');
            spanAve.className = 'nombre-ave';
            spanAve.textContent = `${nombreAveInput.value.trim()} (${cantidadInput.value} ej.)`;

            let spanDetalles = document.createElement('span');
            spanDetalles.className = 'detalles';
            spanDetalles.textContent = `${fechaInput.value} — ${comunaSelect.value}, ${regionSelect.value}`;

            let spanArchivo = document.createElement('span');
            spanArchivo.className = 'archivo';
            spanArchivo.textContent = `Archivo: ${archivoInput.files[0].name}`;

            item.appendChild(spanAve);
            item.appendChild(spanDetalles);
            item.appendChild(spanArchivo);

            listaAvistamientos.appendChild(item);

            if (totalAvistamientos) {
                totalAvistamientos.textContent = listaAvistamientos.children.length;
            }
        }

        form.reset();
        comunaSelect.disabled = true;

        alert('Reporte de avistamiento ingresado correctamente.');
        window.location.href = 'index.html';
    }
});