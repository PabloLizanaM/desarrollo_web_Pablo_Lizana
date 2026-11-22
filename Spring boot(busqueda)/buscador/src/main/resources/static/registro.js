// Diccionario que mapea cada región a sus respectivas comunas hecho con Gemini (son muchas comunas)
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

const validarNombre = (nombre) => {
    if (!nombre || nombre.trim().length < 3) return false;
    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
    return regexNombre.test(nombre.trim());
};
const validarEmail = (email) => Boolean(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()));
const validarTelefono = (telefono) => Boolean(telefono && /^\+?56?9[0-9]{8}$/.test(telefono.trim()));
const validarRegion = (region) => region !== "";
const validarComuna = (comuna) => comuna !== "";

let form = document.getElementById('form-registro');
let nombreInput = document.getElementById('nombre-voluntario');
let emailInput = document.getElementById('email-voluntario');
let telefonoInput = document.getElementById('telefono-voluntario');
let regionSelect = document.getElementById('region-voluntario');
let comunaSelect = document.getElementById('comuna-voluntario');

let errorNombre = document.getElementById('error-nombre');
let errorEmail = document.getElementById('error-email');
let errorTelefono = document.getElementById('error-telefono');
let errorRegion = document.getElementById('error-region');
let errorComuna = document.getElementById('error-comuna');

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

        const nombreOk = validarNombre(nombreInput?.value);
        toggleError(nombreInput, errorNombre, nombreOk);
        if (!nombreOk) esValido = false;

        const emailOk = validarEmail(emailInput?.value);
        toggleError(emailInput, errorEmail, emailOk);
        if (!emailOk) esValido = false;

        const telOk = validarTelefono(telefonoInput?.value);
        toggleError(telefonoInput, errorTelefono, telOk);
        if (!telOk) esValido = false;

        const regionOk = validarRegion(regionSelect?.value ?? '');
        toggleError(regionSelect, errorRegion, regionOk);
        if (!regionOk) esValido = false;

        const comunaOk = validarComuna(comunaSelect?.value ?? '');
        toggleError(comunaSelect, errorComuna, comunaOk);
        if (!comunaOk) esValido = false;

        if (!esValido) {
            event.preventDefault();
        }
    });
}