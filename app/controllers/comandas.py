from datetime import datetime

from flask import request
from flask_login import current_user
from werkzeug.exceptions import BadRequest, NotFound

from ..models.comanda import Atendimento, Comanda, Produto
from ..schemas.comanda_schema import AtendimentoSchema, ComandaSchema, ProdutoSchema
from ..utils.modules import db

comanda_schema = ComandaSchema()
atendimento_schema = AtendimentoSchema()
produto_schema = ProdutoSchema()
produtos_schema = ProdutoSchema(many=True)

def iniciar_atendimento_controller():
    data = {**(request.get_json(silent=True) or {}), "atendente_id": current_user.id}
    atendimento = Atendimento(**atendimento_schema.load(data))
    comanda = Comanda()
    atendimento.comandas.append(comanda)

    db.session.add(atendimento)
    db.session.commit()
    return serializar_atendimento(atendimento)


def listar_atendimentos_controller():
    atendimentos = Atendimento.query.order_by(Atendimento.id.desc()).all()
    return [serializar_atendimento(atendimento) for atendimento in atendimentos]


def serializar_produto(produto):
    return {
        "id": produto.id,
        "id_commanda": produto.id_commanda,
        "nome": produto.nome,
        "preco": produto.preco,
        "descricao": produto.descricao,
    }


def serializar_comanda(comanda):
    return {
        "id": comanda.id,
        "id_atendimento": comanda.id_atendimento,
        "valor_a_pagar": comanda.valor_a_pagar,
        "produtos": [serializar_produto(produto) for produto in comanda.produtos],
    }


def serializar_atendimento(atendimento):
    return {
        "id": atendimento.id,
        "atendente_id": atendimento.atendente_id,
        "inicio": atendimento.inicio.isoformat() if atendimento.inicio else None,
        "fim": atendimento.fim.isoformat() if atendimento.fim else None,
        "comandas": [serializar_comanda(comanda) for comanda in atendimento.comandas],
    }

def finalizar_atendimento_controller():
    id_atendimento = (request.get_json(silent=True) or {}).get("id")
    atendimento = db.session.get(Atendimento, id_atendimento)
    if atendimento is None:
        raise BadRequest("Atendimento não encontrado")
    atendimento.fim = datetime.now()

    db.session.commit()
    return serializar_atendimento(atendimento)

def registrar_comanda_controller():
    comanda = Comanda(**comanda_schema.load(request.get_json(silent=True) or {}))

    db.session.add(comanda)
    db.session.commit()   
    return serializar_comanda(comanda)

def pagar_comandas_parcial_controller():
    data = request.get_json(silent=True) or {}
    comanda = db.session.get(Comanda, data.get("id"))
    if comanda is None:
        raise NotFound("Comanda não encontrada")
    valor_pago = data.get("valor", 0)
    if not isinstance(valor_pago, (int, float)) or valor_pago < 0:
        raise BadRequest("O valor pago deve ser um número não negativo")
    comanda.valor_a_pagar = max(0, comanda.valor_a_pagar-valor_pago)
    db.session.commit()
    return serializar_comanda(comanda)

def adicionar_produtos_controller():
    data = request.get_json(silent=True) or {}
    comanda_id = data.get("c_id")
    produtos_json = data.get("prods", [])
    comanda = db.session.get(Comanda, comanda_id)
    if comanda is None:
        raise NotFound("Comanda não encontrada")
    if not isinstance(produtos_json, list) or not produtos_json:
        raise BadRequest("Informe ao menos um produto")

    produtos_data = [
        {**produto, "id_commanda": comanda_id}
        for produto in produtos_json
        if isinstance(produto, dict)
    ]
    if len(produtos_data) != len(produtos_json):
        raise BadRequest("Cada produto deve ser um objeto")
    produtos = [Produto(**produto) for produto in produtos_schema.load(produtos_data)]
    comanda.produtos.extend(produtos)
    comanda.valor_a_pagar += sum(produto.preco or 0 for produto in produtos)

    db.session.commit()
    return serializar_comanda(comanda)
