from flask import Flask
from flask import request, render_template, redirect, url_for, jsonify
import pymysql
from datetime import datetime
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

fecha_minima = "1980-01-01"

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def getConnection():
    conn = pymysql.connect(
        db= 'tarea2',
        user= 'cc5002',
        password= '', #cambiar por la contraseña de base de datos
        host= 'localhost',
        charset= 'utf8',
    )
    return conn

@app.route('/', methods=['GET'])
def index():
    c =getConnection()
    ultimos_avistamientos = get_ultimos_avistamientos(c)
    c.close()
    return render_template('index.html', ultimos_avistamientos=ultimos_avistamientos)

@app.route('/registro', methods=['GET', 'POST'])
def registro():
    errors = [] 
    message = None
    voluntario_id = None
    
    if request.method == 'POST':
        nombre = request.form.get('nombre', '').strip()
        email = request.form.get('email', '').strip()
        telefono = request.form.get('telefono', '').strip()
        comuna_id = request.form.get('comuna', '').strip()
        
        if not nombre or len(nombre) < 3:
            errors.append("El nombre debe tener al menos 3 caracteres.")
        
        if not email or '@' not in email or '.' not in email:
            errors.append("El correo electrónico no es válido.")
        
        if not telefono:
            errors.append("El teléfono es obligatorio.")
        
        if not comuna_id:
            errors.append("La comuna es obligatoria.")
        
        if not errors:
            c = getConnection()
            
            fecha_registro = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            voluntario_id = agregar_usuario_db(c, nombre, email, telefono, fecha_registro, comuna_id)
            
            if voluntario_id:
                message = "Usuario agregado exitosamente"
            else:
                errors.append("Error al agregar el usuario. Verifica los datos ingresados.")
            c.close()
        
    c = getConnection()
    regiones = get_regiones(c)
    c.close()

    return render_template(
        'registro.html', 
        errors=errors, 
        message=message, 
        regiones=regiones,
        voluntario_id=voluntario_id
    )

@app.route('/avistamiento', methods=['POST', 'GET'])
def avistamiento():
    errors = []
    message = None
    c = getConnection()
    fecha_hoy = datetime.now().strftime('%Y-%m-%d')
    voluntario_seleccionado = request.args.get('voluntario_id') or request.form.get('voluntario_id', '').strip()
    
    if request.method == 'POST':
        voluntario_id = request.form.get('voluntario_id', '').strip()
        ave_id = request.form.get('nombreAve', '').strip()
        comuna_id = request.form.get('comunaAvistamiento', '').strip()
        fecha = request.form.get('fechaAvistamiento', '').strip()
        hora = request.form.get('horaAvistamiento', '').strip()
        comentario = request.form.get('descripcionAvistamiento', '').strip()
        archivos = request.files.getlist('archivoAvistamiento')
        
        if not voluntario_id or not voluntario_id.isdigit():
            errors.append("Debe seleccionar un voluntario.")
        
        if not ave_id or not ave_id.isdigit():
            errors.append("Debe seleccionar un ave.")
        
        if not comuna_id or not comuna_id.isdigit():
            errors.append("Debe seleccionar una comuna/lugar.")
        
        if not fecha:
            errors.append("Debe ingresar una fecha.")
        elif fecha < fecha_minima:
            errors.append(f"La fecha no puede ser anterior a {fecha_minima}.")
        elif fecha > fecha_hoy:
            errors.append("La fecha no puede ser futura.")
        
        if not hora:
            errors.append("Debe ingresar una hora.")
            
        archivos_validos = [f for f in archivos if f and f.filename != '']
        if not archivos_validos:
            errors.append("Debe subir al menos un archivo (imagen o video).")
            
        if not errors:
            archivos_guardados = []
            for archivo in archivos_validos:
                if allowed_file(archivo.filename):
                    filename = secure_filename(archivo.filename)
                    nombre_archivo = f"{datetime.now().timestamp()}_{filename}"
                    
                    file_path = os.path.join(app.config['UPLOAD_FOLDER'], nombre_archivo)
                    archivo.save(file_path)
                    
                    archivos_guardados.append({'ruta': 'uploads/','nombre': nombre_archivo})
            
            if len(archivos_guardados) > 0:
                dia_hora = f"{fecha} {hora}:00"
                
                if agregar_avistamiento_db(c, voluntario_id, ave_id, comuna_id, dia_hora, comentario, archivos_guardados):
                    message = "Avistamiento agregado exitosamente"
                    c.close()
                    return redirect(url_for('index'))
                else:
                    errors.append("Error al agregar el avistamiento. Verifica los datos ingresados.")
            else:
                errors.append("Debe subir al menos un archivo válido (imagen o video).")
                    
    aves = get_aves(c)
    comunas = get_comunas(c)
    voluntarios = get_voluntarios(c)
    regiones = get_regiones(c)
    c.close()
        
    return render_template(
        'avistamiento.html',
        aves=aves,
        comunas=comunas,
        voluntarios=voluntarios,
        regiones=regiones,
        errors=errors,
        message=message,
        fecha_minima=fecha_minima,
        fecha_hoy=fecha_hoy,
        voluntario_seleccionado=voluntario_seleccionado
    )

@app.route('/consulta', methods=['GET'])
def consulta():
    c = getConnection()
    avistamientos = get_avistamientos(c)
    c.close()
    return render_template('consultas.html', avistamientos=avistamientos)

@app.route('/consulta/<int:avistamiento_id>', methods=['GET'])
def detalle_avistamiento(avistamiento_id):
    c = getConnection()
    cursor = c.cursor(pymysql.cursors.DictCursor)
    
    sql = """
        SELECT a.id, a.fecha_hora, a.descripcion,
            ave.nombre AS ave_nombre,
            com.nombre AS comuna_nombre,
            reg.nombre AS region_nombre,
            vol.nombre AS voluntario_nombre
        FROM avistamiento a
        JOIN ave ON a.ave_id = ave.id
        JOIN comuna com ON a.lugar = com.id
        JOIN region reg ON com.region_id = reg.id
        JOIN voluntario vol ON a.voluntario_id = vol.id
        WHERE a.id = %s
    """
    cursor.execute(sql, (avistamiento_id,))
    avistamiento = cursor.fetchone()
    
    if avistamiento:
        if isinstance(avistamiento['fecha_hora'], datetime):
            avistamiento['fecha_hora'] = avistamiento['fecha_hora'].strftime('%Y-%m-%d %H:%M:%S')
        
        sql_archivos = "SELECT ruta_archivo, nombre_archivo FROM registro WHERE avistamiento_id = %s"
        cursor.execute(sql_archivos, (avistamiento_id,))
        avistamiento['archivos'] = cursor.fetchall()
        
    c.close()
    return jsonify(avistamiento or {})

@app.route('/metricas', methods=['POST'])
def metricas():
    c = getConnection()
    stats = get_metrics(c)
    c.close()
    return render_template('metricas.html', stats=stats)

@app.route('/get_comunas/<int:region_id>', methods=['GET'])
def get_comunas_por_region(region_id):
    c = getConnection()
    cursor = c.cursor()

    cursor.execute("SELECT id, nombre FROM comuna WHERE region_id = %s ORDER BY nombre ASC", (region_id,))
    comunas = cursor.fetchall()
    c.close()
    return {"comunas": comunas}

def get_ultimos_avistamientos(c):
    sql = """
        SELECT a.id, a.fecha_hora, ave.nombre AS ave_nombre, com.nombre AS comuna_nombre,
                (SELECT CONCAT(r.ruta_archivo, r.nombre_archivo) 
                FROM registro r 
                WHERE r.avistamiento_id = a.id 
                LIMIT 1) AS foto
        FROM avistamiento a
        JOIN ave ON a.ave_id = ave.id
        JOIN voluntario v ON a.voluntario_id = v.id
        JOIN comuna com ON a.lugar = com.id
        ORDER BY a.id DESC
        LIMIT 2
    """
    cursor = c.cursor()
    cursor.execute(sql)
    return cursor.fetchall()

def agregar_usuario_db(c, nombre, email, telefono, fecha_registro, comuna_id):
    try:
        sql = """INSERT INTO voluntario (nombre, email, telefono, fecha_registro, comuna_id) 
        VALUES (%s, %s, %s, %s, %s)"""
        cursor = c.cursor()
        cursor.execute(sql, (nombre, email, telefono, fecha_registro, comuna_id))
        c.commit()
        return cursor.lastrowid
    
    except pymysql.Error as e:
        c.rollback()
        app.logger.error("Error con base de datos: {0} {1} ".format(e.args[0], e.args[1]))
        return None

def agregar_avistamiento_db(c, voluntario_id, ave_id, comuna_id, dia_hora, comentario, archivos):
    try:
        sql = """INSERT INTO avistamiento (voluntario_id, ave_id, fecha_hora, lugar, descripcion) 
        VALUES (%s, %s, %s, %s, %s)"""
        cursor = c.cursor()
        cursor.execute(sql, (voluntario_id, ave_id, dia_hora, comuna_id, comentario))
        avistamiento_id = cursor.lastrowid
        
        sql_archivo = "INSERT INTO registro (ruta_archivo, nombre_archivo, avistamiento_id) VALUES (%s, %s, %s)"
        
        for archivo in archivos:
            cursor.execute(sql_archivo, (archivo['ruta'], archivo['nombre'], avistamiento_id))
        
        c.commit()
        return True
    
    except pymysql.Error as e:
        c.rollback()
        app.logger.error("Error con base de datos: {0} {1} ".format(e.args[0], e.args[1]))
        return False

def get_aves(c):
    sql = "SELECT id, nombre FROM ave ORDER BY nombre ASC"
    cursor = c.cursor()
    cursor.execute(sql)
    aves = cursor.fetchall()
    return aves

def get_comunas(c):
    sql = "SELECT id, nombre FROM comuna ORDER BY nombre ASC"
    cursor = c.cursor()
    cursor.execute(sql)
    comunas = cursor.fetchall()
    return comunas

def get_voluntarios(c):
    sql = "SELECT id, nombre FROM voluntario ORDER BY nombre ASC"
    cursor = c.cursor()
    cursor.execute(sql)
    voluntarios = cursor.fetchall()
    return voluntarios

def get_regiones(c):
    sql = "SELECT id, nombre FROM region ORDER BY nombre ASC"
    cursor = c.cursor()
    cursor.execute(sql)
    regiones = cursor.fetchall()
    return regiones

def get_avistamientos(c):
    sql = """
        SELECT a.id, a.fecha_hora,
                ave.nombre AS ave_nombre, 
                com.nombre AS comuna_nombre,
                (SELECT COUNT(*) FROM registro r WHERE r.avistamiento_id = a.id) AS cantidad_archivos
        FROM avistamiento a
        JOIN ave ON a.ave_id = ave.id
        JOIN comuna com ON a.lugar = com.id
        ORDER BY a.id DESC
    """
    cursor = c.cursor(pymysql.cursors.DictCursor)
    cursor.execute(sql)
    
    resultados = cursor.fetchall()
    for resultado in resultados:
        if isinstance(resultado['fecha_hora'], datetime):
            resultado['fecha_hora'] = resultado['fecha_hora'].strftime('%Y-%m-%d %H:%M:%S')
            
    return resultados


if __name__ == "__main__":
    app.run(debug=True)