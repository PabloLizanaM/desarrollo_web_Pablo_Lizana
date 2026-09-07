# Sistema de Gestión de Avistamientos de Aves - Tarea 1

**Autor:** Pablo Lizana  
**Curso:** Desarrollo Web  

## Descripción
Prototipo web para la Unión de Ornitólogos de Chile desarrollado con HTML5, CSS3 y JavaScript para la gestión de voluntarios y el reporte de avistamientos de aves en el territorio nacional.

## Decisiones de Diseño e Implementación

* **Navegación y Estructura Modular:**
  - `index.html`: Panel de bienvenida y acceso rápido a los módulos del sistema.
  - `registro.html` / `registro2.html`: Formulario estándar e interfaz avanzada en dos columnas para la inscripción de voluntarios.
  - `avistamiento.html`: Formulario de reporte de avistamientos con soporte multimedia.
  - `consultas.html`: Tabla dinámica interactiva de avistamientos.
  - `metricas.html`: Dashboard con indicadores clave y gráficos estadísticos.

* **Validaciones Robustas en Cliente:**
  - **Expresiones Regulares (RegEx):** Validación estricta de nombres (mínimo 3 caracteres), correo electrónico y teléfono con formato chileno (`+569...`).
  - **Límite Temporal de Fechas:** La fecha de avistamiento previene la selección de días futuros ajustando la hora límite al final del día actual (`23:59:59.999`).
  - **Evidencia Multimedia:** Verificación obligatoria de archivos (imágenes/video) combinando el atributo HTML `accept` con comprobaciones programáticas en JS.
  - **Anidación Región/Comuna:** Filtro dinámico de comunas dependiente de la región seleccionada.

* **Móduo de Consultas (`consultas.js`):**
  - **Filtrado:** Búsqueda en tiempo real por tipo/especie de ave.
  - **Ordenamiento:** Selección de criterios cronológicos (fechas ascendente/descendente) y alfabéticos (ubicación o especie).
  - **Paginación:** División en memoria de resultados por páginas configurables con botones de navegación (`Anterior` / `Siguiente`).

* **Visualización de Métricas (`metricas.js`):**
  - **KPIs Resumen:** Disposición en cuadrícula `2x2` responsive para los indicadores principales del sistema.
  - **Gráficos Interactivos:** Integración de la librería Chart.js (vía CDN) para renderizar un gráfico de barras (avistamientos por región) y un gráfico de dona (distribución de voluntarios por zona).

* **Seguridad y Persistencia:**
  - Operación 100% del lado del cliente en cumplimiento con los requerimientos del prototipo (sin backend ni persistencia en `localStorage`).
  - Inyección segura de datos en el DOM mediante `textContent` para mitigar riesgos de inyección XSS.

## Estructura del Repositorio

* `index.html` - Panel principal y bienvenida.
* `registro.html` - Formulario estándar de registro de voluntarios.
* `registro2.html` - Panel de registro en dos columnas con tarjetas laterales.
* `avistamiento.html` - Formulario de ingreso de avistamientos con validación multimedia.
* `consultas.html` - Interfaz de tabla con filtros, ordenamiento y paginación.
* `metricas.html` - Dashboard estadístico con gráficos de Chart.js.
* `registro.js` - Lógica de eventos y validaciones para formularios de registro.
* `avistamiento.js` - Lógica de validación de fechas, evidencias y comunas.
* `consultas.js` - Lógica de filtrado, ordenamiento y paginación sobre arreglos en memoria.
* `metricas.js` - Configuración e inicialización de gráficos en canvas.
* `style.css` - Hoja de estilos global desarrollada en CSS3 (Flexbox, Grid, diseño adaptativo).
* `README.md` - Documentación de entrega.

---
<p align="center">
  <sub>README desarrollado con Gemini</sub>
</p>