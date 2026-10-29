from flask import Blueprint, jsonify
from flask_login import login_required

from ..controllers.comandas import (
    adicionar_produtos_controller,
    finalizar_atendimento_controller,
    iniciar_atendimento_controller,
    listar_atendimentos_controller,
    pagar_comandas_parcial_controller,
    registrar_comanda_controller,
)

bp = Blueprint("atendimentos", __name__, url_prefix="/atendimentos")

@bp.route("/", methods=["POST"])
@login_required
def iniciar_atendimento():
    return jsonify(iniciar_atendimento_controller()), 201


@bp.route("/", methods=["GET"])
@login_required
def listar_atendimentos():
    return jsonify(listar_atendimentos_controller())

@bp.route("/", methods=["PUT"])
@login_required
def finalizar_atendimento():
    return jsonify(finalizar_atendimento_controller())


@bp.route("/comandas", methods=["POST"])
@login_required
def registrar_comanda():
    return jsonify(registrar_comanda_controller()), 201


@bp.route("/comandas", methods=["PUT"])
@login_required
def pagar_comandas_parcial():
    return jsonify(pagar_comandas_parcial_controller())


@bp.route("/comandas", methods=["PATCH"])
@login_required
def adicionar_produtos():
    return jsonify(adicionar_produtos_controller())
