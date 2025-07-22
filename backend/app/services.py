import os
import requests
import google.generativeai as genai
from gtts import gTTS

def generate_ia_story(age, keyword, activity_type='cuento'): # Añadimos activity_type
    """
    Llama a la API de Google Gemini con un prompt seleccionado dinámicamente
    y valida la respuesta.
    """
    
    # Diccionario de prompts
    prompts = {
        'cuento': f"Genera una historia infantil corta de 5 oraciones usando palabras con sílabas directas para un niño de {age} años con Síndrome de Down. La historia debe ser simple, motivadora y relacionada con '{keyword}'.",
        'adivinanza': f"Crea una adivinanza de 3 pistas para un niño de 8 años. La respuesta debe ser '{keyword}'. Usa un lenguaje muy sencillo y directo.",
        'fonema_s': f"Genera 5 frases cortas y simples para un niño de 7 años. Cada frase debe incluir varias palabras que contengan la letra 's' para practicar el fonema /s/. El tema central debe ser '{keyword}'.",
    }

    # Selecciona el prompt o usa el de 'cuento' por defecto
    prompt = prompts.get(activity_type, prompts['cuento'])

    try:
        api_key = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        
        response = model.generate_content(prompt)
        
        # --- INICIO DE LA VALIDACIÓN MEJORADA ---
        
        # 1. Limpieza inicial del texto
        content = response.text.strip().replace('*', '')

        # 2. Validación de longitud
        if len(content.split()) < 10:
             print("Error de validación: La respuesta de la IA es demasiado corta.")
             return None # Rechaza la respuesta

        # 3. Validación de pertinencia cultural y terapéutica (lista negra de palabras)
        # Esta lista se puede expandir con palabras que no sean adecuadas.
        palabras_no_deseadas = ['violencia', 'tristeza', 'miedo', 'comprar', 'dinero']
        
        for palabra in palabras_no_deseadas:
            if palabra in content.lower():
                print(f"Error de validación: La respuesta contiene la palabra no deseada '{palabra}'.")
                return None # Rechaza la respuesta

        # 4. (Opcional) Validación de seguridad de la propia API de Gemini
        # Comprueba si la API bloqueó la respuesta por alguna razón
        if not response.parts:
             print("Error de validación: La API de Gemini bloqueó la respuesta por motivos de seguridad.")
             return None # Rechaza la respuesta

        # Si pasa todas las validaciones, devuelve el contenido.
        return content
        # --- FIN DE LA VALIDACIÓN MEJORADA ---
        
    except Exception as e:
        print(f"Error en la API de Gemini: {e}")
        return None
    
def generate_text_to_speech(text):
    """
    Genera un archivo de audio .mp3 a partir del texto usando gTTS
    y devuelve la ruta para acceder a él.
    """
    try:
        tts = gTTS(text, lang='es')
        filename = f"{hash(text)}.mp3"
        
        # --- MÉTODO DE RUTA UNIFICADO ---
        # __file__ se refiere a este mismo archivo (services.py)
        # os.path.dirname(__file__) nos da la carpeta que lo contiene ('app/')
        # Así construimos una ruta absoluta y confiable.
        audio_directory = os.path.join(os.path.dirname(__file__), 'static', 'audio')
        
        os.makedirs(audio_directory, exist_ok=True)
        filepath = os.path.join(audio_directory, filename)

        if not os.path.exists(filepath):
            tts.save(filepath)
            print(f"Audio generado y guardado en: {filepath}")
        else:
            print(f"Audio ya existente: {filename}")

        return f"/api/audio/{filename}"

    except Exception as e:
        print(f"Error al generar audio con gTTS: {e}")
        return None

from fpdf import FPDF

def create_activity_pdf(text, keyword):
    """
    Crea un archivo PDF a partir del texto de una actividad.
    """
    pdf = FPDF()
    pdf.add_page()
    
    # Se utiliza una fuente que soporte Unicode (caracteres latinos).
    # FPDF2 moderno maneja esto bien con fuentes estándar.
    pdf.set_font("Arial", size=12)
    
    # Título
    pdf.set_font("Arial", 'B', 16)
    # Usamos .encode() para asegurar la compatibilidad con caracteres especiales en el título
    pdf.cell(0, 10, txt=f"Actividad: {keyword.title()}", ln=True, align='C')
    pdf.ln(10) # Salto de línea
    
    # Cuerpo del texto
    pdf.set_font("Arial", size=12)
    # .multi_cell ya maneja bien el texto unicode.
    pdf.multi_cell(0, 10, txt=text)
    
    filename = f"actividad_{keyword.replace(' ', '_')}.pdf"
    
    return pdf.output(), filename
