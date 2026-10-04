# Sistema de Gestión de Avistamientos de Aves - Tarea 2

**Autor:** Pablo Lizana  
**Curso:** Desarrollo Web  

## Descripción
Aplicación web desarrollada con Python (Flask) y MySQL para la gestión de voluntarios, reporte de avistamientos de aves y despliegue de estadísticas para la Unión de Ornitólogos de Chile.

---

## Decisiones de Diseño e Implementación

### 1. Arquitectura y Persistencia (Backend)
* **Conexión a Base de Datos:** Se utilizó `pymysql` para la interacción con la base de datos `tarea2`. La gestión de conexiones se centralizó en la función `getConnection()` para asegurar la correcta liberación de recursos (`c.close()`) en cada endpoint.
* **Manejo de Transacciones:** En las inserciones complejas (como `agregar_avistamiento_db`), se emplean consultas parametrizadas (`%s`) para **prevenir inyecciones SQL**. En caso de fallo durante el guardado de archivos o registros asociados, se ejecuta `c.rollback()` asegurando integridad referencial.

### 2. Carga y Servido de Archivos Multimedia (Uploads)
* **Subida de Archivos:** Los archivos multimedia subidos en el reporte de avistamiento se sanitizan mediante `secure_filename` de Werkzeug y se renombran agregando un *timestamp* para evitar colisiones de nombres.
* **Estructura de Rutas Estáticas:** Los archivos se guardan en el directorio `static/uploads/`. En la tabla `registro` de la base de datos se almacena la ruta relativa `uploads/` y el nombre asignado al archivo.
* **Visualización Dinámica:** En las vistas dinámicas (como el modal de detalle en `consultas.html`), JavaScript consulta el endpoint de Flask (`/consulta/<id>`) e inyecta la URL `/static/uploads/...` asegurando la correcta carga de imágenes y videos.

### 3. Validaciones y Seguridad (XSS)
* **Validación en Cliente y Servidor:** Todos los campos del formulario de avistamientos y registros cuentan con doble validación (JavaScript en el cliente y validaciones estrictas en las rutas POST de Flask).
* **Manejo de Comentarios y Entradas de Texto:** Para prevenir vulnerabilidades XSS (Cross-Site Scripting) derivadas de scripts ingresados en el campo de observaciones/comentarios:
  - En las plantillas HTML se aprovecha el renderizado predeterminado con auto-escape de Jinja2 (`{{ ... }}`).
  - En las peticiones dinámicas de JavaScript (`consultas.js`), se utiliza la propiedad `.textContent` para la inserción de texto en el DOM, garantizando que cualquier etiqueta o script sea tratado como texto plano sin ejecutarse.

### 4. Consultas y Endpoints Dinámicos
* **Carga Asíncrona de Comunas:** El selector de comunas depende de la región mediante una petición `fetch` al endpoint `/get_comunas/<region_id>`, optimizando la carga inicial de la página.
* **Detalle de Avistamiento:** El endpoint `/consulta/<int:avistamiento_id>` entrega un objeto JSON estructurado con los datos del avistamiento y la lista de archivos asociados recuperados de la tabla `registro`.

---

## Estructura del Repositorio

* `app.py` - Servidor principal de Flask, rutas de navegación, endpoints API y lógica de base de datos.
* `templates/` - Plantillas HTML con motor Jinja2 (`index.html`, `registro.html`, `avistamiento.html`, `consultas.html`, `metricas.html`).
* `static/`
* `css/style.css` - Hojas de estilo generales del sitio.
* `js/` - Scripts para interacciones en cliente (`registro.js`, `avistamiento.js`, `consultas.js`, `metricas.js`).
* `uploads/` - Directorio donde se almacenan las imágenes y videos subidos por los usuarios.
* `README.md` - Documentación de entrega para la Tarea 2.

---


<p align="center">
  <sub>README desarrollado con Gemini</sub>
</p>