from flask import Blueprint
from flask_login import login_required
from ..controllers.comandas import (
    iniciar_atendimento_controller,
    finalizar_atendimento_controller,
    registrar_comanda_controller,
    pagar_comandas_parcial_controller,
    adicionar_produtos_controller
)

bp = Blueprint("atendimentos", __name__, url_prefix="/atendimentos")

@bp.route("/", methods=["POST"])
@login_required
def iniciar_atendimento():
    iniciar_atendimento_controller()
    return "Atendimento iniciado com sucesso", 201

@bp.route("/", methods=["PUT"])
@login_required
def finalizar_atendimento():
    finalizar_atendimento_controller()
    return "Atendimento finalizado com sucesso", 200


@bp.route("/comandas", methods=["POST"])
@login_required
def registrar_comanda():
    registrar_comanda_controller()
    return "Comanda registrada com sucesso", 201


@bp.route("/comandas", methods=["PUT"])
@login_required
def pagar_comandas_parcial():
    pagar_comandas_parcial_controller()
    return "Valor pago com sucesso", 200


@bp.route("/comandas", methods=["PATCH"])
@login_required
def adicionar_produtos():
    adicionar_produtos_controller()
    return "Produtos adicionados com sucesso", 200
