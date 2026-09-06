# Sistema de Gestión de Avistamientos de Aves - Tarea 1

**Autor:** Pablo Lizana  
**Curso:** Desarrollo Web  

## Descripción
Prototipo web para la Unión de Ornitólogos de Chile desarrollado con HTML5, CSS3 y JavaScript para la gestión de voluntarios y el reporte de avistamientos de aves en el territorio nacional.

## Decisiones de Diseño e Implementación

* **Navegación y Panel Principal (`index.html`):**
  Se estableció una pantalla de bienvenida que centraliza los accesos directos hacia los módulos de registro de voluntarios, reporte de avistamientos, consultas históricas y métricas globales.

* **Vista Avanzada de Registro (`registro2.html`):**
  Se incluyó una variante de registro estructurada en dos columnas mediante CSS Grid/Flexbox, permitiendo al usuario completar la inscripción de un voluntario mientras mantiene visibilidad directa hacia el acceso de métricas.

* **Validaciones Robustas en Cliente:**
  - **Expresiones Regulares (RegEx):** Implementadas en JavaScript para validar formato de nombres (mínimo 3 caracteres), correos electrónicos y teléfonos con formato chileno (`+569...`).
  - **Restricción de Fechas:** La fecha de avistamiento valida que no se seleccionen días futuros ajustando el límite al término de la jornada actual (`23:59:59`).
  - **Archivos Multimedia:** Verificación de carga obligatoria de evidencia (imágenes o videos) usando el atributo `accept="image/*,video/*"` en HTML y validación programática en JS.
  - **Dependencia Región/Comuna:** Mapeo dinámico de comunas filtradas según la región seleccionada por el usuario.

* **Manejo de Datos y Seguridad:**
  - El prototipo opera del lado del cliente mediante manipulación dinámica del DOM en memoria.
  - Se previenen ataques de inyección de código (XSS) asignando los valores ingresados a través de `textContent` en lugar de `innerHTML`.

## Estructura del Repositorio

* `index.html` - Panel principal y bienvenida con tarjetas de acceso rápido.
* `registro.html` - Formulario estándar de registro de voluntarios.
* `registro2.html` - Panel de registro en dos columnas con acceso directo a métricas.
* `avistamiento.html` - Formulario de ingreso de avistamientos con validación multimedia.
* `consultas.html` - Tabla con el historial de avistamientos reportados.
* `metricas.html` - Indicadores y estadísticas generales de la red.
* `registro.js` - Lógica de validación y eventos para el registro de voluntarios.
* `avistamiento.js` - Lógica de validación de fechas, archivos y región/comuna para avistamientos.
* `style.css` - Hoja de estilos global desarrollada en CSS3 (Flexbox, Grid, diseño adaptativo).
* `README.md` - Documentación de entrega.

---
<p align="center">
  <sub>README desarrollado con Gemini</sub>
</p>