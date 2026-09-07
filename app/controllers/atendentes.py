from flask import request
from flask_login import login_user, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.exceptions import Unauthorized
from ..schemas.atendente_schema import *

atendente_schema = AtendenteSchema()

def registrar_atendente_controller():
    data = request.json

    atendente = atendente_schema.load(data)
    atendente.password_hash = generate_password_hash(atendente.password_hash)

    login_user(atendente)
    db.session.add(atendente)
    db.session.commit()

def logar_atendente_controller():
    data = request.json
    atendente = Atendente.query.get(data.get("id"))
    
    if not check_password_hash(atendente.password_hash, data.get("password")):
        raise Unauthorized("Senhas não conferem") 
    login_user(atendente)  

def update_atendente_controller():
    data = request.json
    atendente = atendente_schema.load(data)
    atual = Atendente.query.get(atendente.id)

    for k in atual.__dict__:
        atual.k = atendente.k

    db.session.commit()

def delete_atendente_controller():
    id_atendente = request.json.get("id")
    atendente = Atendente.query.get(id_atendente)

    db.session.remove(atendente)
    db.session.commit()
