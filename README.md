# Sistema de Gestión de Avistamientos de Aves - Tarea 2

**Autor:** Pablo Lizana  
**Curso:** Desarrollo Web 

## Descripción
Aplicación web desarrollada con Python (Flask) y MySQL para la gestión de voluntarios, reporte de avistamientos de aves y visualización de consultas y estadísticas para la Unión de Ornitólogos de Chile.

---

### 1. Arquitectura y Persistencia (Flask-SQLAlchemy + PyMySQL)
* **Conexión e Integración:** Se utilizó **Flask-SQLAlchemy** junto con la extensión `pymysql` para administrar las sesiones y transacciones con la base de datos MySQL.
* **Consultas Parametrizadas:** Las consultas SQL se ejecutan mediante objetos `text()` de SQLAlchemy parametrizados (`:id`, `:nombre`, etc.), garantizando una separación clara de la lógica y previniendo vulnerabilidades de inyección SQL (SQLi).
* **Manejo de Fechas:** Las fechas de registro de usuarios y de creación de avistamientos son procesadas dinámicamente mediante `datetime.now()` e insertadas con el formato estándar `YYYY-MM-DD HH:MM:SS`.

### 2. Carga y Servido de Archivos Multimedia (Uploads)
* **Procesamiento de Archivos:** Los archivos multimedia subidos en el reporte de avistamiento se sanitizan mediante `secure_filename` de Werkzeug y se renombran agregando un *timestamp* para garantizar nombres únicos y evitar colisiones en el servidor.
* **Almacenamiento Físico y BD:** Los archivos se guardan físicamente en el directorio `static/uploads/`. En la tabla `registro` de la base de datos se almacena la ruta relativa `uploads/` y el nombre asignado al archivo.
* **Carga Dinámica en Modal:** En el historial de consultas, al hacer clic en una fila, JavaScript realiza una petición asíncrona (`fetch`) al endpoint `/consulta/<id>`, el cual retorna la lista de evidencias asociadas. El cliente construye la ruta `/static/uploads/...` para renderizar imágenes (`<img>`) o videos (`<video>`) según su extensión.

### 3. Validaciones y Seguridad
* **Doble Validación:** Todos los datos recibidos en formularios (`/registro` y `/avistamiento`) cuentan con validaciones tanto en el cliente como en el servidor (longitud de campos, formato de correo, IDs válidos y restricciones de fechas para evitar registros futuros o anteriores a 1980).
* **Prevención de XSS (Cross-Site Scripting):** 
  - Las plantillas HTML hacen uso del renderizado con auto-escape nativo de Jinja2 (`{{ ... }}`).
  - En la interacción dinámica con el DOM (`consultas.js`), los datos recibidos por el servidor se asignan mediante la propiedad `.textContent`, impidiendo la ejecución de scripts maliciosos ingresados en los comentarios u observaciones.

### 4. Consultas y Endpoints REST / API
* **Carga Dinámica de Comunas:** El selector de comunas en los formularios responde dinámicamente al cambio de región seleccionada mediante peticiones `GET` al endpoint `/get_comunas/<region_id>`.
* **Detalle del Avistamiento (JSON):** El endpoint `/consulta/<int:avistamiento_id>` realiza las uniones (JOINs) entre las tablas `avistamiento`, `ave`, `comuna`, `region`, `voluntario` y `registro`, retornando la información completa formateada en un objeto JSON.

---

## Estructura del Repositorio

* `app.py` - Servidor principal de Flask, configuración de BD, definición de rutas y funciones auxiliaras SQL.
* `templates/` - Plantillas HTML dinámicas con motor Jinja2 (`index.html`, `registro.html`, `avistamiento.html`, `consultas.html`, `metricas.html`).
* `static/`
* `css/style.css` - Estilos generales y diseño adaptable del sitio web.
* `js/` - Scripts para validaciones y comportamiento interactivo (`registro.js`, `avistamiento.js`, `consultas.js`, `metricas.js`).
* `uploads/` - Directorio donde se almacenan las imágenes y videos subidos por los usuarios.
* `README.md` - Documentación de entrega para la Tarea 2.
---

### NO OLVIDAR CAMBIAR CONTRASEÑA

---

<p align="center">
  <sub>README desarrollado con Gemini</sub>
</p>