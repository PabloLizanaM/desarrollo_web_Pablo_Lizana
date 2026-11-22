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

const validarVoluntario = (voluntario) => voluntario !== "";
const validarNombreAve = (nombre) => nombre !== "";
/*
const validarCantidad = (cantidad) => {
    const num = Number(cantidad);
    return cantidad && !isNaN(num) && num >= 1 && num <= 500;
};*/

const validarFecha = (fecha) => {
    if (!fecha) return false;
    const fechaSeleccionada = new Date(fecha + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(23, 59, 59, 999);
    return fechaSeleccionada <= hoy;
};

const validarHora = (hora) => {
    if (!hora) return false;
    const [horas, minutos] = hora.split(':').map(Number);
    return horas >= 0 && horas < 24 && minutos >= 0 && minutos < 60;
}

const validarRegion = (region) => region !== "";
const validarComuna = (comuna) => comuna !== "";

const validarArchivo = (archivoInput) => {
    if (!archivoInput || !archivoInput.files || archivoInput.files.length === 0) return false;

    const archivo = archivoInput.files[0];
    const esImagenOVideo = archivo.type.startsWith('image/') || archivo.type.startsWith('video/');

    const tamanoMaximoBytes = 50 * 1024 * 1024; // 50MB
    const esTamanoValido = archivo.size <= tamanoMaximoBytes;

    return esImagenOVideo && esTamanoValido;
};

let form = document.getElementById('form-avistamiento');
let voluntarioSelect = document.getElementById('voluntario-id');
let nombreAveInput = document.getElementById('nombre-ave');
//let cantidadInput = document.getElementById('cantidad-aves');
let fechaInput = document.getElementById('fecha-avistamiento');
let horaInput = document.getElementById('hora-avistamiento');
let regionSelect = document.getElementById('region-avistamiento');
let comunaSelect = document.getElementById('comuna-avistamiento');
let archivoInput = document.getElementById('archivo-avistamiento');

let errorVoluntario = document.getElementById('error-voluntario');
let errorNombreAve = document.getElementById('error-nombre-ave');
//let errorCantidad = document.getElementById('error-cantidad');
let errorFecha = document.getElementById('error-fecha');
let errorHora = document.getElementById('error-hora');
let errorRegion = document.getElementById('error-region-avistamiento');
let errorComuna = document.getElementById('error-comuna-avistamiento');
let errorArchivo = document.getElementById('error-archivo');

const toggleError = (input, errorEl, esValido) => {
    if (input) input.style.borderColor = esValido ? '' : 'red';
    if (errorEl) errorEl.classList.toggle('visible', !esValido);
};

if (regionSelect && comunaSelect) {
    regionSelect.addEventListener('change', async () => {
        const regionValor = regionSelect.value;
        comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';

        if (!regionValor) {
            comunaSelect.disabled = true;
            return;
        }

        if (!/^\d+$/.test(regionValor) && comunasPorRegion[regionValor]) {
            comunasPorRegion[regionValor].forEach(nombreComuna => {
                const option = document.createElement('option');
                option.value = nombreComuna;
                option.textContent = nombreComuna;
                comunaSelect.appendChild(option);
            });
            comunaSelect.disabled = false;
            return;
        }

        try {
            const response = await fetch(`/get_comunas/${encodeURIComponent(regionValor)}`);
            const data = await response.json();

            if (data.comunas && data.comunas.length > 0) {
                data.comunas.forEach(comuna => {
                    const option = document.createElement('option');
                    option.value = comuna.id ?? comuna[0];
                    option.textContent = comuna.nombre ?? comuna[1];
                    comunaSelect.appendChild(option);
                });
                comunaSelect.disabled = false;
            } else {
                comunaSelect.disabled = true;
            }
        } catch (error) {
            console.error('Error al obtener comunas:', error);
            comunaSelect.disabled = true;
        }
    });
}

if (form) {
    form.addEventListener('submit', (event) => {
        let esValido = true;

        const volOk = validarVoluntario(voluntarioSelect?.value ?? '');
        toggleError(voluntarioSelect, errorVoluntario, volOk);
        if (!volOk) esValido = false;

        const aveOk = validarNombreAve(nombreAveInput?.value ?? '');
        toggleError(nombreAveInput, errorNombreAve, aveOk);
        if (!aveOk) esValido = false;

        const fechaOk = validarFecha(fechaInput?.value ?? '');
        toggleError(fechaInput, errorFecha, fechaOk);
        if (!fechaOk) esValido = false;

        const horaOk = validarHora(horaInput?.value ?? '');
        toggleError(horaInput, errorHora, horaOk);
        if (!horaOk) esValido = false;

        const regionOk = validarRegion(regionSelect?.value ?? '');
        toggleError(regionSelect, errorRegion, regionOk);
        if (!regionOk) esValido = false;

        const comunaOk = validarComuna(comunaSelect?.value ?? '');
        toggleError(comunaSelect, errorComuna, comunaOk);
        if (!comunaOk) esValido = false;

        const archivoOk = validarArchivo(archivoInput);
        toggleError(archivoInput, errorArchivo, archivoOk);
        if (!archivoOk) esValido = false;

        if (!esValido) {
            event.preventDefault();
        }
    });
}