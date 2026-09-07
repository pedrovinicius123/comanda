from flask import request
from flask_login import current_user
from ..models.comanda import Atendimento, Comanda, Produto
from ..schemas.comanda_schema import AtendimentoSchema, ComandaSchema, ProdutoSchema
from ..utils.modules import db
from werkzeug.exceptions import BadRequest, NotFound
from datetime import datetime

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

def finalizar_atendimento_controller():
    id_atendimento = (request.get_json(silent=True) or {}).get("id")
    atendimento = db.session.get(Atendimento, id_atendimento)
    if atendimento is None:
        raise BadRequest("Atendimento não encontrado")
    atendimento.fim = datetime.now()

    db.session.commit()

def registrar_comanda_controller():
    comanda = Comanda(**comanda_schema.load(request.get_json(silent=True) or {}))

    db.session.add(comanda)
    db.session.commit()   

def pagar_comandas_parcial_controller():
    data = request.get_json(silent=True) or {}
    comanda = db.session.get(Comanda, data.get("id"))
    if comanda is None:
        raise BadRequest("Comanda não encontrada")
    valor_pago = data.get("valor", 0)
    comanda.valor_a_pagar = max(0, comanda.valor_a_pagar-valor_pago)
    db.session.commit()

def adicionar_produtos_controller():
    data = request.get_json(silent=True) or {}
    comanda_id = data.get("c_id")
    produtos_json = data.get("prods", [])
    for produto in produtos_json:
        produto["id_commanda"] = comanda_id
    produtos = [Produto(**produto) for produto in produtos_schema.load(produtos_json)]
    
    comanda = db.session.get(Comanda, comanda_id)
    if comanda is None:
        raise NotFound("Comanda não encontrada")
    comanda.produtos.extend(produtos)

    db.session.commit()
