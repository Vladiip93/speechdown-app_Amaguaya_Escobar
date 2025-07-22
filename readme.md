# SpeechDown: Aplicación Web con IA para Terapia del Habla

SpeechDown es una aplicación web full-stack diseñada como un caso de estudio para el apoyo terapéutico del habla en niños con Síndrome de Down. La plataforma utiliza inteligencia artificial generativa (Google Gemini) para crear ejercicios personalizados e interactivos, como cuentos, adivinanzas y prácticas de fonemas, en un entorno seguro y motivador.

## Arquitectura del Sistema

El proyecto sigue una arquitectura cliente-servidor desacoplada:

* **Frontend (Cliente):** Una Single-Page Application (SPA) desarrollada en **React.js**. Es responsable de toda la interfaz de usuario, la interactividad y la gestión del estado del lado del cliente. Se comunica con el backend a través de una API RESTful.
* **Backend (Servidor):** Una API RESTful construida con **Python y Flask**. Se encarga de la lógica de negocio, la gestión de usuarios y perfiles, la conexión con la base de datos y la orquestación de servicios externos como la IA de Google Gemini y la síntesis de voz.
* **Base de Datos:** Un servidor **PostgreSQL** que persiste todos los datos de la aplicación, incluyendo perfiles de usuarios, perfiles de niños y el historial de progreso de las actividades.
* **Servicios Externos:**
    * **Google Gemini API:** Para la generación de contenido dinámico.
    * **gTTS:** Para la conversión de texto a voz y la generación de retroalimentación auditiva.

![Diagrama de Arquitectura](docs/arquitectura.png)

## Tecnologías Utilizadas

* **Backend:**
    * Lenguaje: **Python 3**
    * Framework: **Flask**
    * ORM: **Flask-SQLAlchemy**
    * Base de Datos: **PostgreSQL**
    * Librerías Clave: `google-generativeai`, `gTTS`, `fpdf2`, `Flask-Cors`.
* **Frontend:**
    * Librería: **React.js**
    * Estilos: **Tailwind CSS**
    * Enrutamiento: **React Router DOM**
    * Cliente HTTP: **Axios**
    * Gráficos: **Chart.js**
* **Control de Versiones:**
    * **Git** y **GitHub/GitLab**

## Instrucciones de Despliegue

Sigue estos pasos para ejecutar el proyecto en un entorno de desarrollo local.

### Prerrequisitos
* Git
* Python 3.10 o superior
* Node.js y Yarn (o npm)
* Un servidor de PostgreSQL instalado y en ejecución.

### 1. Clonar el Repositorio
```bash
git clone <https://github.com/Vladiip93/speechdown-app_Amaguaya_Escobar>
cd speechdown_project
```

### 2. Configuración del Backend
#### 2.1 Navega a la carpeta del backend:
```bash
cd backend
```

#### 2.2 Crea y activa un entorno virtual:
```bash
# Crear el entorno
python -m venv venv
# Activar en Windows
.\venv\Scripts\activate
```

#### 2.3 Instala las dependencias:
```bash
pip install -r requirements.txt
```

#### 2.4 Configura la Base de Datos:
* Abre una terminal de psql o una herramienta como pgAdmin.
* Ejecuta el siguiente comando SQL para crear la base de datos:
```bash
CREATE DATABASE speechdown_db;
```

#### 2.5 Crea el archivo de entorno .env:
* En la carpeta backend, crea un archivo llamado .env.
* Copia y pega el siguiente contenido, reemplazando los valores con tus propias credenciales:
```bash
# Clave secreta para Flask (puedes generar una con python -c 'import secrets; print(secrets.token_hex(16))')
SECRET_KEY='tu_clave_secreta_aqui'

# URL de conexión a tu base de datos PostgreSQL
DATABASE_URL='postgresql://postgres:tu_contraseña_aqui@localhost:5432/speechdown_db'

# Tu clave de API de Google Gemini
GEMINI_API_KEY='tu_api_key_de_gemini_aqui'
```

#### 2.6 Ejecuta el servidor de backend:
```bash
python run.py
```
* El backend ahora estará corriendo en http://localhost:5001.

### 3. Configuración del Frontend
#### 3.1 Abre una nueva terminal.
#### 3.2 Navega a la carpeta del frontend:
```bash
cd frontend
```

#### 3.3 Instala las dependencias:
```bash
yarn install
```

#### 3.4 Ejecuta el servidor de desarrollo:
```bash
yarn start
```

### 4. Acceso a la App
* Abre tu navegador y ve a http://localhost:3000

### Ejemplos de Prompts Usados con la API de IA
La aplicación utiliza un sistema de prompts dinámicos para generar diferentes tipos de actividades.

    1. Para Cuentos Cortos (Terapéutico):
        * "Genera una historia infantil corta de 5 oraciones usando palabras con sílabas directas para un niño de {edad} años con Síndrome de Down. La historia debe ser simple, motivadora y relacionada con '{palabra_clave}'."

    2. Para Adivinanzas:
        * "Crea una adivinanza de 3 pistas para un niño de 8 años. La respuesta debe ser '{palabra_clave}'. Usa un lenguaje muy sencillo y directo."

    3. Para Práctica de Fonemas (ej. /s/):
        * "Genera 5 frases cortas y simples para un niño de 7 años. Cada frase debe incluir varias palabras que contengan la letra 's' para practicar el fonema /s/. El tema central debe ser '{palabra_clave}'."
