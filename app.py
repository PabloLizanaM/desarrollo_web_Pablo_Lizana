from flask import Flask
from flask import request, render_template
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
        password= 'cc5002', #cambiar por la contraseña de base de datos
        host= 'localhost',
        charset= 'utf8'
    )
    return conn

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/registro', methods=['GET', 'POST'])
def registro():
    errors = [] 
    message = None
    
    if request.method == 'POST':
        nombre = request.form.get('nombre', '').strip()
        email = request.form.get('email', '').strip()
        telefono = request.form.get('telefono', '').strip()
        comuna_id = request.form.get('comuna_id', '').strip()
        
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
            
            if agregar_usuario_db(c, nombre, email, telefono, fecha_registro, comuna_id):
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
        regiones=regiones
    )

@app.route('/avistamiento', methods=['POST', 'GET'])
def avistamiento():
    errors = []
    message = None
    c = getConnection()
    fecha_hoy = datetime.now().strftime('%Y-%m-%d')
    
    if request.method == 'POST':
        voluntario_id = request.form.get('voluntario_id', '').strip()
        ave_id = request.form.get('ave_id', '').strip()
        comuna_id = request.form.get('comuna_id', '').strip()
        fecha = request.form.get('fecha', '').strip()
        hora = request.form.get('hora', '').strip()
        comentario = request.form.get('comentario', '').strip()
        archivos = request.files.getlist('archivos')
        
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
                    archivos_guardados.append(f"uploads/{nombre_archivo}")
            
            if len(archivos_guardados) >0:
                dia_hora = f"{fecha} {hora}:00"
                
                if agregar_avistamiento_db(c, voluntario_id, ave_id, comuna_id, dia_hora, comentario, archivos_validos):
                    c.close()
                    message = "Avistamiento agregado exitosamente"
                else:
                    errors.append("Error al agregar el avistamiento. Verifica los datos ingresados.")
            else:
                errors.append("Debe subir al menos un archivo válido (imagen o video).")
                    
        aves = get_aves(c)
        comunas = get_comunas(c)
        voluntarios = get_voluntarios(c)
        c.close()
        
        return render_template(
            'avistamiento.html',
            aves=aves,
            comunas=comunas,
            voluntarios=voluntarios,
            errors=errors,
            message=message,
            fecha_minima=fecha_minima,
            fecha_hoy=fecha_hoy
        )

@app.route('/consulta', methods=['GET'])
def consulta():
    c = getConnection()
    avistamientos = get_avistamientos(c)
    c.close()
    return render_template('consulta.html', avistamientos=avistamientos)

@app.route('/metricas', methods=['POST'])
def metricas():
    c = getConnection()
    stats = get_metrics(c)
    c.close()
    return render_template('metricas.html', stats=stats)

