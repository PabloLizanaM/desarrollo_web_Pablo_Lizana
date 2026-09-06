# Sistema de Gestión de Avistamientos de Aves - Tarea 1

**Autor:** Pablo Lizana  
**Curso:** Desarrollo Web  

## Descripción
Prototipo web para la Unión de Ornitólogos de Chile desarrollado con HTML, CSS y JavaScript para la gestión de voluntarios y el reporte de avistamientos de aves.

## Decisiones de Diseño e Implementación para la Corrección
* **Flujo de Entrada y Registro:**
  Se diseñó la interfaz de registro de voluntarios (`registro.html`) como punto inicial del sistema para garantizar la asociación correcta entre el voluntario y los reportes de avistamientos generados. Al completarse, el sistema redirige al panel principal (`index.html`).
* **Persistencia Local:**
  Se utiliza `localStorage` para guardar y recuperar los voluntarios y los avistamientos ingresados sin requerir servidor backend.
* **Navegación Global:**
  Se implementó una barra de navegación superior (`nav`) accesible desde todas las páginas para facilitar la evaluación y revisión directa de cada módulo.
* **Validación y Estructura:**
  Se incluyeron reglas de validación en HTML5 y JS para los campos obligatorios, selección de Regiones/Comunas de Chile y la exigencia de un archivo fotográfico o de video al registrar avistamientos.

## Estructura del Repositorio
* `registro.html` - Formulario de registro de voluntarios.
* `index.html` - Panel principal y bienvenida al voluntario.
* `avistamiento.html` - Formulario de ingreso de avistamientos con archivo multimedia.
* `consultas.html` - Vista de avistamientos con ordenamiento, filtrado y paginación.
* `metricas.html` - Gráficos e indicadores de métricas del sistema.
* `README.md` - Documentación de entrega.


### README desarrollado con gemini