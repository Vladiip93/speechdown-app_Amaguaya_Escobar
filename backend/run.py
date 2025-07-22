# backend/run.py

# Importa y carga dotenv AQUÍ, al principio de todo
from dotenv import load_dotenv
load_dotenv()

from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5001)