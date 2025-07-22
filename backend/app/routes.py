import os
from flask import current_app as app, request, jsonify, send_file
from io import BytesIO
from . import db
from .models import User, ChildProfile, ActivityHistory
from .services import generate_ia_story, generate_text_to_speech, create_activity_pdf
from flask import send_from_directory

# --- RUTAS DE GESTIÓN DE USUARIOS (TERAPEUTAS/PADRES) ---

@app.route('/api/users', methods=['POST'])
def add_user():
    data = request.get_json()
    # Ahora también validamos que el rol venga en la petición
    if not data or not data.get('username') or not data.get('role'):
        return jsonify({"error": "Faltan datos: se requiere username y role"}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "El nombre de usuario ya existe"}), 409

    # Pasamos el rol al crear el nuevo usuario
    new_user = User(username=data['username'], role=data['role'])
    db.session.add(new_user)
    db.session.commit()
    
    # Devolvemos también el rol en la respuesta
    return jsonify({"message": "Usuario creado", "id": new_user.id, "username": new_user.username, "role": new_user.role}), 201

@app.route('/api/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    # Devolvemos el rol de cada usuario
    return jsonify([{"id": u.id, "username": u.username, "role": u.role} for u in users])

# --- RUTAS COMPLETAS DE GESTIÓN DE PERFILES DE NIÑOS (CRUD) ---

@app.route('/api/children', methods=['POST'])
def add_child():
    data = request.get_json()
    # Ahora se requiere el user_id para asociar el niño a un usuario
    if not data or not data.get('name') or not data.get('age') or not data.get('user_id'):
        return jsonify({"error": "Faltan datos: se requiere name, age y user_id"}), 400
    
    # Verificar que el usuario exista
    user = User.query.get(data['user_id'])
    if not user:
        return jsonify({"error": "El usuario especificado no existe"}), 404

    new_child = ChildProfile(name=data['name'], age=data['age'], user_id=data['user_id'])
    db.session.add(new_child)
    db.session.commit()
    
    return jsonify({"message": "Perfil de niño creado", "id": new_child.id}), 201

@app.route('/api/children', methods=['GET'])
def get_all_children():
    children = ChildProfile.query.all()
    return jsonify([{"id": c.id, "name": c.name, "age": c.age, "user_id": c.user_id} for c in children])

@app.route('/api/children/<int:child_id>', methods=['PUT'])
def update_child(child_id):
    child = ChildProfile.query.get_or_404(child_id)
    data = request.get_json()
    
    if 'name' in data:
        child.name = data['name']
    if 'age' in data:
        child.age = data['age']
        
    db.session.commit()
    return jsonify({"message": "Perfil de niño actualizado"})

@app.route('/api/children/<int:child_id>', methods=['DELETE'])
def delete_child(child_id):
    child = ChildProfile.query.get_or_404(child_id)
    
    # Opcional: eliminar también el historial de progreso asociado
    ActivityHistory.query.filter_by(child_id=child_id).delete()
    
    db.session.delete(child)
    db.session.commit()
    return jsonify({"message": "Perfil de niño eliminado"})


# --- RUTAS DE GESTIÓN DE HISTORIAL DE ACTIVIDADES ---

@app.route('/api/children/<int:child_id>/progress', methods=['POST'])
def add_progress_record(child_id):
    ChildProfile.query.get_or_404(child_id) # Verificar que el niño exista
    data = request.get_json()
    if not data or not data.get('activity_text'):
        return jsonify({"error": "Falta el texto de la actividad"}), 400

    new_record = ActivityHistory(child_id=child_id, activity_text=data['activity_text'])
    db.session.add(new_record)
    db.session.commit()
    
    return jsonify({"message": "Progreso guardado"}), 201

@app.route('/api/children/<int:child_id>/progress', methods=['GET'])
def get_child_progress(child_id):
    ChildProfile.query.get_or_404(child_id)
    history = ActivityHistory.query.filter_by(child_id=child_id).order_by(ActivityHistory.date_completed.desc()).all()
    return jsonify([{"date": h.date_completed.isoformat(), "activity": h.activity_text} for h in history])


# --- RUTAS DE GENERACIÓN DE ACTIVIDADES Y RECURSOS ---

@app.route('/api/activities/generate', methods=['POST'])
def generate_activity():
    data = request.get_json()
    # Obtenemos el nuevo parámetro 'activity_type' del JSON
    activity_type = data.get("activity_type", "cuento") 

    if not data or 'age' not in data or 'keyword' not in data:
        return jsonify({"error": "Faltan datos: se requiere 'age' y 'keyword'"}), 400

    # Pasamos el activity_type a la función del servicio
    story_text = generate_ia_story(data['age'], data['keyword'], activity_type)
    
    if not story_text:
        return jsonify({"error": "No se pudo generar el contenido con la IA"}), 500

    audio_url = generate_text_to_speech(story_text)
    return jsonify({"generated_text": story_text, "audio_feedback_url": audio_url})

@app.route('/api/activities/download', methods=['POST'])
def download_activity_pdf():
    data = request.get_json()
    if not data or not data.get('text') or not data.get('keyword'):
        return jsonify({"error": "Faltan datos para generar el PDF"}), 400
    
    pdf_data, filename = create_activity_pdf(data['text'], data['keyword'])
    return send_file(BytesIO(pdf_data), mimetype='application/pdf', as_attachment=True, download_name=filename)

# --- RUTA PARA SERVIR ARCHIVOS DE AUDIO ---
@app.route('/api/audio/<path:filename>')
def serve_audio(filename):
    """
    Sirve los archivos de audio desde la carpeta estática.
    """
    audio_directory = os.path.join(os.path.dirname(__file__), 'static', 'audio')
    print(f"Buscando audio en el directorio: {audio_directory}") # Dejamos esto para depurar
    return send_from_directory(audio_directory, filename)