from flask import Blueprint

from ..controllers.atendentes import (
    delete_atendente_controller,
    logar_atendente_controller,
    registrar_atendente_controller,
    update_atendente_controller,
)
from ..models.atendente import Atendente
from ..schemas.atendente_schema import AtendenteSchema
from ..utils.modules import db, lm

atendente_loader = AtendenteSchema()
bp = Blueprint("atendentes", __name__, url_prefix="/atendentes")

@lm.user_loader
def load_user(user_id:int):
    return db.session.get(Atendente, user_id)

@bp.route("/register", methods=["POST"])
def registrar_atendente():
    registrar_atendente_controller()
    return "Atendente registrado com sucesso", 201

@bp.route("/login", methods=["POST"])
def login_atendente():
    logar_atendente_controller()
    return "Atendente logado com sucesso", 200

@bp.route("/delete", methods=["DELETE"])
def delete_atendente():
    delete_atendente_controller()
    return "Atendente removido com sucesso", 200

@bp.route("/update", methods=["PATCH"])
def update_atendente():
    update_atendente_controller()
    return "Atendente atualizado com sucesso", 200
    