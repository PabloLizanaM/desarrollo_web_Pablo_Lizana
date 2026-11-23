# Buscador y Evaluación de Avistamientos de Aves - Tarea 4

**Autor:** Pablo Lizana  
**Curso:** Desarrollo Web 

## Descripción
Aplicación web desarrollada con **Java (17+)**, **Spring Boot**, **Spring Data JPA** y **MySQL** para la consulta en tiempo real, visualización detallada y evaluación mediante notas de avistamientos de aves para la Unión de Ornitólogos de Chile

---

### 1. Arquitectura y Persistencia (Spring Boot + Spring Data JPA)
* **Conexión e Integración:** Se utilizó **Spring Boot** junto con **Spring Data JPA (Hibernate)** y el conector de **MySQL** para gestionar el mapeo objeto-relacional y las transacciones con la base de datos.
* **Consultas JPQL y Carga Eficiente:** Las consultas hacia entidades relacionadas (`Avistamiento`, `Ave`, `Voluntario`, `Comuna`, `Region`, `Registro`, `Comentario` y `Nota`) se resuelven mediante repositorios JPA (`JOIN FETCH` y agregaciones `AVG`), evitando consultas innecesarias y previniendo inyección SQL.
* **Manejo de Fechas:** Las fechas de avistamientos y comentarios se gestionan mediante `java.time.LocalDateTime` y se formatean de manera uniforme (`yyyy-MM-dd HH:mm`) para su visualización en la interfaz.

### 2. Buscador en Tiempo Real y Resaltado de Coincidencias
* **Filtrado Instantáneo:** La vista `/consultas` presenta un formulario con un campo de texto (`#busqueda-avistamiento`) que filtra dinámicamente los avistamientos a medida que el usuario escribe, buscando coincidencias por **especie de ave**, **nombre del voluntario** o **comuna**.
* **Resaltado Dinámico (`<mark>`):** Los fragmentos de texto que calzan con el patrón buscado se destacan visualmente mediante etiquetas `<mark>` generadas de forma segura en el DOM, mostrando además un mensaje informativo cuando no existen coincidencias.
* **Ordenamiento y Paginación:** Permite ordenar los resultados por fecha, comuna o especie y navegar por páginas sin recargar la vista.

### 3. Sistema de Evaluación de Avistamientos (`Nota`)
* **Visualización de Nota Promedio:** Cada fila de resultados incluye la columna **Nota**, mostrando `"-"` cuando el avistamiento aún no registra evaluaciones o el promedio calculado redondeado a un decimal en caso contrario.
* **Modal de Evaluación y Validación (1 a 7):** Al hacer clic en el botón **Evaluar**, se despliega un modal interactivo (`#modal-evaluar`) que solicita ingresar una nota entera entre `1` y `7` (ambos inclusive), validando el rango y tipo numérico tanto en el cliente como en el servidor.
* **Persistencia y Actualización Asíncrona:** Al confirmar la evaluación, JavaScript envía una petición `POST` asíncrona (`fetch`) al endpoint `/consulta/{id}/nota`, guarda el registro en la tabla `nota` (`id`, `avistamiento_id`, `nota`), recalcula el promedio en la base de datos y actualiza inmediatamente la tabla en pantalla.

### 4. Modal de Detalle, Multimedia y Comentarios Asociados
* **Carga Dinámica en Modal:** Al hacer clic sobre una fila del listado, JavaScript realiza una petición asíncrona (`fetch`) al endpoint `GET /consulta/{id}`, desplegando la ficha completa del avistamiento, sus archivos adjuntos y comentarios asociados.
* **Servido Portable de Archivos (`/uploads/**`):** Mediante `WebConfig`, la aplicación resuelve dinámicamente el directorio de evidencias multimedia de forma independiente de rutas absolutas del sistema operativo.

### 5. Validaciones, Seguridad y Estándares Web
* **Doble Validación:** Tanto los comentarios como las notas cuentan con validación en el navegador (`consultas.js`) y en el backend (`ConsultaController`).
* **Prevención de XSS (Cross-Site Scripting):**
  - Las plantillas utilizan el escape nativo de **Thymeleaf** (`th:text`, `th:inline="javascript"`).
  - En la manipulación del DOM (`consultas.js`), los textos provenientes del servidor y las búsquedas del usuario se insertan estrictamente mediante `.textContent` y `document.createTextNode`, evitando la ejecución de código malicioso.

---

## Estructura del Repositorio

* `Flask(app web)/` - Aplicación web base desarrollada previamente en Flask.
* `Spring boot(busqueda)/buscador/` - Proyecto Spring Boot con JPA y `fetch`:
  * `src/main/java/proyecto/tarea4/buscador/`
    * `config/WebConfig.java` - Configuración portable para servir archivos multimedia desde `/uploads/**`.
    * `controller/ConsultaController.java` - Controlador MVC y endpoints REST (`GET /consultas`, `GET /consulta/{id}`, `POST /consulta/{id}/comentario`, `POST /consulta/{id}/nota`).
    * `model/` - Entidades JPA mapeadas a MySQL (`Avistamiento`, `Ave`, `Voluntario`, `Comuna`, `Region`, `Registro`, `Comentario`, `Nota`).
    * `repository/` - Interfaces `JpaRepository` con consultas personalizadas (`AvistamientoRepository`, `RegistroRepository`, `ComentarioRepository`, `NotaRepository`).
  * `src/main/resources/`
    * `application.properties` - Configuración de conexión a MySQL (`tarea2`) e Hibernate.
    * `templates/consultas.html` - Vista principal del buscador, tabla de resultados y modales de detalle y evaluación.
    * `static/style.css` - Estilos generales, diseño adaptable, resaltado `<mark>` y modales.
    * `static/consultas.js` - Lógica de filtrado en tiempo real, ordenamiento, paginación y llamadas asíncronas (`fetch`).
* `README.md` - Documentación de entrega para la Tarea 4.

---

### NO OLVIDAR CAMBIAR CONTRASEÑA

---

<p align="center">
  <sub>README desarrollado con Gemini</sub>
</p>