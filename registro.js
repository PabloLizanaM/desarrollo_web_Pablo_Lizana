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
const validarEmail = (email) => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
const validarTelefono = (telefono) => telefono && /^\+?56?9[0-9]{8}$/.test(telefono.trim());
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

let listaVoluntarios = document.getElementById('lista-voluntarios');
let totalVoluntarios = document.getElementById('total-voluntarios');

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

    if (!validarNombre(nombreInput.value)) {
        esValido = false;
        nombreInput.style.borderColor = 'red';
        errorNombre.classList.add('visible');
    } else {
        nombreInput.style.borderColor = '';
        errorNombre.classList.remove('visible');
    }

    if (!validarEmail(emailInput.value)) {
        esValido = false;
        emailInput.style.borderColor = 'red';
        errorEmail.classList.add('visible');
    } else {
        emailInput.style.borderColor = '';
        errorEmail.classList.remove('visible');
    }

    if (!validarTelefono(telefonoInput.value)) {
        esValido = false;
        telefonoInput.style.borderColor = 'red';
        errorTelefono.classList.add('visible');
    } else {
        telefonoInput.style.borderColor = '';
        errorTelefono.classList.remove('visible');
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

    if (esValido) {

        if (listaVoluntarios) {
            let item = document.createElement('div');
            item.className = 'voluntario-item';

            let spanNombre = document.createElement('span');
            spanNombre.className = 'nombre';
            spanNombre.textContent = nombreInput.value.trim();

            let spanContacto = document.createElement('span');
            spanContacto.className = 'contacto';
            spanContacto.textContent = `${emailInput.value.trim()} — ${telefonoInput.value.trim()}`;

            let spanUbicacion = document.createElement('span');
            spanUbicacion.className = 'ubicacion';
            spanUbicacion.textContent = `${comunaSelect.value}, ${regionSelect.value}`;

            item.appendChild(spanNombre);
            item.appendChild(spanContacto);
            item.appendChild(spanUbicacion);

            listaVoluntarios.appendChild(item);

            if (totalVoluntarios) {
                totalVoluntarios.textContent = listaVoluntarios.children.length;
            }
        }

        form.reset();
        comunaSelect.disabled = true;

        alert('Voluntario(a) registrado(a) correctamente.');
        window.location.href = 'index.html';
    }
});