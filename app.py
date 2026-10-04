from flask import Flask, request, render_template, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from datetime import datetime
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

fecha_minima = "1980-01-01"

USER = 'cc5002'
PASSWORD = '' # Cambiar si utilizas contraseña local en tu entorno
HOST = 'localhost'
PORT = '3306'
DB_NAME = 'tarea2'

app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DB_NAME}?charset=utf8"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET'])
def index():
    ultimos_avistamientos = get_ultimos_avistamientos()
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
            fecha_registro = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            voluntario_id = agregar_usuario_db(nombre, email, telefono, fecha_registro, comuna_id)
            
            if voluntario_id:
                message = "Usuario agregado exitosamente"
            else:
                errors.append("Error al agregar el usuario. Verifica los datos ingresados.")
        
    regiones = get_regiones()

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
                
                if agregar_avistamiento_db(voluntario_id, ave_id, comuna_id, dia_hora, comentario, archivos_guardados):
                    message = "Avistamiento agregado exitosamente"
                    return redirect(url_for('index'))
                else:
                    errors.append("Error al agregar el avistamiento. Verifica los datos ingresados.")
            else:
                errors.append("Debe subir al menos un archivo válido (imagen o video).")
                    
    aves = get_aves()
    comunas = get_comunas()
    voluntarios = get_voluntarios()
    regiones = get_regiones()
        
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
    avistamientos = get_avistamientos()
    return render_template('consultas.html', avistamientos=avistamientos)

@app.route('/consulta/<int:avistamiento_id>', methods=['GET'])
def detalle_avistamiento(avistamiento_id):    
    sql = text("""
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
        WHERE a.id = :id
    """)
    try:
        result = db.session.execute(sql, {'id': avistamiento_id}).mappings().fetchone()
    
        if result:
            avistamiento = dict(result)
            if isinstance(avistamiento['fecha_hora'], datetime):
                avistamiento['fecha_hora'] = avistamiento['fecha_hora'].strftime('%Y-%m-%d %H:%M:%S')
        
        sql_archivos = "SELECT ruta_archivo, nombre_archivo FROM registro WHERE avistamiento_id = :id"
        archivos = db.session.execute(text(sql_archivos), {'id': avistamiento_id}).mappings().fetchall()
        avistamiento['archivos'] = [dict(archivo) for archivo in archivos]
        
        return jsonify(avistamiento)
    
    except Exception as e:
        app.logger.error(f"Error al obtener detalle del avistamiento: {e}")
        return jsonify({'error': str(e)}), 500
    
    return jsonify({}),404

@app.route('/metricas', methods=['POST'])
def metricas():
    stats = get_metrics()
    return render_template('metricas.html', stats=stats)

@app.route('/get_comunas/<int:region_id>', methods=['GET'])
def get_comunas_por_region(region_id):
    sql = text("SELECT id, nombre FROM comuna WHERE region_id = :region_id ORDER BY nombre ASC")
    resultados = db.session.execute(sql, {'region_id': region_id}).mappings().fetchall()
    comunas = [{'id': resultado['id'], 'nombre': resultado['nombre']} for resultado in resultados]
    return jsonify({'comunas': comunas})

def get_ultimos_avistamientos():
    sql = text("""
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
    """)
    return db.session.execute(sql).fetchall()

def agregar_usuario_db(nombre, email, telefono, fecha_registro, comuna_id):
    try:
        sql = text("INSERT INTO voluntario (nombre, email, telefono, fecha_registro, comuna_id) VALUES (:nombre, :email, :telefono, :fecha_registro, :comuna_id)")
        result = db.session.execute(sql, {
            'nombre': nombre,
            'email': email,
            'telefono': telefono,
            'fecha_registro': fecha_registro,
            'comuna_id': comuna_id
        })
        db.session.commit()
        return result.lastrowid
    
    except Exception as e:
        db.session.rollback()
        app.logger.error("Error con base de datos: {e} ")
        return None

def agregar_avistamiento_db(voluntario_id, ave_id, comuna_id, dia_hora, comentario, archivos):
    try:
        sql = text("INSERT INTO avistamiento (voluntario_id, ave_id, fecha_hora, lugar, descripcion) VALUES (:voluntario_id, :ave_id, :fecha_hora, :lugar, :descripcion)")
        result = db.session.execute(sql, {
            'voluntario_id': voluntario_id,
            'ave_id': ave_id,
            'fecha_hora': dia_hora,
            'lugar': comuna_id,
            'descripcion': comentario
        })
        avistamiento_id = result.lastrowid
        
        sql_archivo = text("INSERT INTO registro (ruta_archivo, nombre_archivo, avistamiento_id) VALUES (:ruta_archivo, :nombre_archivo, :avistamiento_id)")
        for archivo in archivos:
            db.session.execute(sql_archivo, {
                'ruta_archivo': archivo['ruta'],
                'nombre_archivo': archivo['nombre'],
                'avistamiento_id': avistamiento_id
            })           
        db.session.commit()
        return True
    
    except Exception as e:
        db.session.rollback()
        app.logger.error("Error con base de datos: {e}")
        return False

def get_aves():
    sql = text("SELECT id, nombre FROM ave ORDER BY nombre ASC")
    return db.session.execute(sql).fetchall()

def get_comunas():
    sql = text("SELECT id, nombre FROM comuna ORDER BY nombre ASC")
    return db.session.execute(sql).fetchall()

def get_voluntarios():
    sql = text("SELECT id, nombre FROM voluntario ORDER BY nombre ASC")
    return db.session.execute(sql).fetchall()

def get_regiones():
    sql = text("SELECT id, nombre FROM region ORDER BY nombre ASC")
    return db.session.execute(sql).fetchall()

def get_avistamientos():
    sql = text("""
        SELECT a.id, a.fecha_hora,
                ave.nombre AS ave_nombre, 
                com.nombre AS comuna_nombre,
                (SELECT COUNT(*) FROM registro r WHERE r.avistamiento_id = a.id) AS cantidad_archivos
        FROM avistamiento a
        JOIN ave ON a.ave_id = ave.id
        JOIN comuna com ON a.lugar = com.id
        ORDER BY a.id DESC
    """)
    resultados = db.session.execute(sql).mappings().fetchall()
    lista_avistamientos = []
    for resultado in resultados:
        item = dict(resultado)
        if isinstance(item['fecha_hora'], datetime):
            item['fecha_hora'] = item['fecha_hora'].strftime('%Y-%m-%d %H:%M:%S')
        lista_avistamientos.append(item)
    return lista_avistamientos



if __name__ == "__main__":
    app.run(debug=True)