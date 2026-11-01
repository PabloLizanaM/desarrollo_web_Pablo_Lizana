# Sistema de Gestión de Avistamientos de Aves - Tarea 3

**Autor:** Pablo Lizana  
**Curso:** Desarrollo Web 

## Descripción
Aplicación web desarrollada con Python (Flask) y MySQL para la gestión de voluntarios, reporte de avistamientos de aves, visualización de estadísticas gráficas y sistema dinámico de comentarios para la Unión de Ornitólogos de Chile.

---

### 1. Arquitectura y Persistencia (Flask-SQLAlchemy + PyMySQL)
* **Conexión e Integración:** Se utilizó **Flask-SQLAlchemy** junto con la extensión `pymysql` para administrar las sesiones y transacciones con la base de datos MySQL.
* **Consultas Parametrizadas:** Las consultas SQL se ejecutan mediante objetos `text()` de SQLAlchemy parametrizados (`:id`, `:nombre`, etc.), garantizando una separación clara de la lógica y previniendo vulnerabilidades de inyección SQL (SQLi).
* **Manejo de Fechas:** Las fechas de registro de usuarios, avistamientos y comentarios son procesadas dinámicamente mediante `datetime.now()` e insertadas con el formato estándar `YYYY-MM-DD HH:MM:SS`.

### 2. Carga y Servido de Archivos Multimedia (Uploads)
* **Procesamiento de Archivos:** Los archivos multimedia subidos en el reporte de avistamiento se sanitizan mediante `secure_filename` de Werkzeug y se renombran agregando un *timestamp* para garantizar nombres únicos y evitar colisiones en el servidor.
* **Almacenamiento Físico y BD:** Los archivos se guardan físicamente en el directorio `static/uploads/`. En la tabla `registro` de la base de datos se almacena la ruta relativa `uploads/` y el nombre asignado al archivo.
* **Carga Dinámica en Modal:** En el historial de consultas, al hacer clic en una fila, JavaScript realiza una petición asíncrona (`fetch`) al endpoint `/consulta/<id>`, el cual retorna la lista completa de evidencias y comentarios asociados.

### 3. Módulo de Estadísticas y Gráficos (Chart.js)
* **Gráficos Dinámicos:** La pantalla de métricas implementa tres gráficos utilizando la librería Chart.js con llamadas asíncronas (`fetch`) hacia endpoints del servidor:
  1. **Gráfico de Líneas:** Muestra la cantidad de avistamientos registrados por día.
  2. **Gráfico de Torta:** Muestra el total de avistamientos agrupados por tipo de ave.
  3. **Gráfico de Barras:** Despliega el total de voluntarios registrados por comuna en el eje X y las cantidades en el eje Y.
* **Navegación:** Cuenta con un enlace al pie de la página para retornar de forma sencilla a la portada del sistema.

### 4. Sistema de Comentarios Asociados
* **Formulario Interactivo:** Al visualizar el detalle de cualquier avistamiento mediante el modal, se despliega un formulario interactivo con validaciones de longitud (nombre entre 3 y 50 caracteres, y texto del comentario de mínimo 5 caracteres en un área de texto de 3x40).
* **Listado y Envío Asíncrono:** Los comentarios se listan mostrando la fecha, el nombre del comentarista y el texto. Al enviar el formulario, se realiza una petición `POST` asíncrona (`fetch`) validando los datos tanto en el cliente como en el servidor antes de insertarlos en la tabla `comentario`.

### 5. Validaciones y Seguridad
* **Doble Validación:** Todos los datos recibidos en formularios cuentan con validaciones exhaustivas tanto en el cliente como en el servidor.
* **Prevención de XSS (Cross-Site Scripting):** 
  - Las plantillas HTML hacen uso del renderizado con auto-escape nativo de Jinja2 (`{{ ... }}`).
  - En la interacción dinámica con el DOM (`consultas.js`), los datos de comentarios y descripciones recibidos del servidor se asignan estrictamente mediante la propiedad `.textContent`, impidiendo la ejecución de scripts maliciosos.

---

## Estructura del Repositorio

* `app.py` - Servidor principal de Flask, configuración de BD, definición de rutas y endpoints de API.
* `templates/` - Plantillas HTML dinámicas con motor Jinja2 (`index.html`, `registro.html`, `avistamiento.html`, `consultas.html`, `metricas.html`).
* `static/`
  * `css/style.css` - Estilos generales, diseño adaptable y estructuración de componentes.
  * `js/` - Scripts para validaciones y comportamiento interactivo (`registro.js`, `avistamiento.js`, `consultas.js`, `metricas.js`).
  * `uploads/` - Directorio reservado para los archivos multimedia subidos por los usuarios.
* `README.md` - Documentación de entrega para la Tarea 3.

---

### NO OLVIDAR CAMBIAR CONTRASEÑA

---

<p align="center">
  <sub>README desarrollado con Gemini</sub>
</p>