from flask import request
from flask_login import login_user
from werkzeug.exceptions import BadRequest, NotFound, Unauthorized
from werkzeug.security import check_password_hash, generate_password_hash

from ..models.atendente import Atendente
from ..schemas.atendente_schema import AtendenteSchema
from ..utils.modules import db

atendente_schema = AtendenteSchema()


def registrar_atendente_controller():
    data = request.get_json(silent=True) or {}
    nome = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password")
    if not nome or not email or not password:
        raise BadRequest("Nome, email e senha são obrigatórios")
    if Atendente.query.filter_by(email=email).first():
        raise BadRequest("Já existe um atendente com esse email")

    atendente = Atendente(
        name=nome,
        email=email,
        password_hash=generate_password_hash(password),
    )
    db.session.add(atendente)
    db.session.commit()
    login_user(atendente)
    return {"id": atendente.id, "name": atendente.name, "email": atendente.email}


def logar_atendente_controller():
    data = request.get_json(silent=True) or {}
    atendente = None
    if data.get("id") is not None:
        atendente = db.session.get(Atendente, data["id"])
    else:
        email = (data.get("email") or data.get("name") or "").strip().lower()
        atendente = Atendente.query.filter_by(email=email).first()
    if atendente is None or not check_password_hash(
        atendente.password_hash, data.get("password", "")
    ):
        raise Unauthorized("Senhas não conferem")
    login_user(atendente)
    return {"id": atendente.id, "name": atendente.name, "email": atendente.email}


def update_atendente_controller():
    data = request.get_json(silent=True) or {}
    atual = db.session.get(Atendente, data.get("id"))
    if atual is None:
        flash("Atendente não encontrado", "error")
        raise NotFound("Atendente não encontrado")
    if data.get("password"):
        atual.password_hash = generate_password_hash(data["password"])

    db.session.commit()


def delete_atendente_controller():
    id_atendente = (request.get_json(silent=True) or {}).get("id")
    atendente = db.session.get(Atendente, id_atendente)
    if atendente is None:
        flash("Atendente não encontrado", "error")
        raise NotFound("Atendente não encontrado")
    db.session.delete(atendente)
    db.session.commit()
