from flask import flash, request
from flask_login import login_user
from werkzeug.exceptions import BadRequest, NotFound, Unauthorized
from werkzeug.security import check_password_hash, generate_password_hash

from ..models.atendente import Atendente
from ..schemas.atendente_schema import AtendenteSchema
from ..utils.modules import db

atendente_schema = AtendenteSchema()


def registrar_atendente_controller():
    data = request.get_json(silent=True) or {}
    password = data.get("password") or data.get("password_hash")
    if not password:
        flash("O campo password é obrigatório", "error")
        raise BadRequest("O campo password é obrigatório")

    atendente_data = {"password_hash": generate_password_hash(password)}
    if data.get("id") is not None:
        atendente_data["id"] = data["id"]
    atendente = Atendente(**atendente_data)

    login_user(atendente)
    db.session.add(atendente)
    db.session.commit()


def logar_atendente_controller():
    data = request.get_json(silent=True) or {}
    atendente = db.session.get(Atendente, data.get("id"))
    if atendente is None or not check_password_hash(
        atendente.password_hash, data.get("password", "")
    ):
        flash("Senhas não conferem", "error")
        raise Unauthorized("Senhas não conferem")
    login_user(atendente)


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
