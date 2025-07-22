# backend/config.py

import os
# La línea "from dotenv import load_dotenv" se elimina de aquí
# La línea "load_dotenv()" se elimina de aquí

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False