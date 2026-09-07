from flask import request
from flask_login import user_logged_in, current_user
from ..schemas.comanda_schema import *
from ..utils.modules import db
from werkzeug.exceptions import Unauthorized
from datetime import datetime

comanda_schema = ComandaSchema()
atendimento_schema = AtendimentoSchema()
produto_schema = ProdutoSchema()
produtos_schema = ProdutoSchema(many=True)

def iniciar_atendimento_controller():
    data = {**request.json, "atendente_id": current_user.id}
    atendimento = atendimento_schema.load(data)
    comanda = Comanda()
    atendimento.comandas.append(comanda)

    db.session.add(atendimento)
    db.session.commit()

def finalizar_atendimento_controller():
    id_atendimento = request.json.get("id")
    atendimento = Atendimento.query.get(id_atendimento)
    atendimento.fim = datetime.now()

    db.session.commit()

def registrar_comanda_controller():
    comanda = comanda_schema.load(request.json)

    db.session.add(comanda)
    db.session.commit()   

def pagar_comandas_parcial_controller():
    comanda = Comanda.query.get(request.json.get("id"))
    
    valor_pago = request.json.get("valor")
    comanda.valor_a_pagar = max(0, comanda.valor_a_pagar-valor_pago)
    db.session.commit()

def adicionar_produtos_controller():
    comanda_id = request.json.get("c_id")
    produtos_json = request.json.get("prods", [])
    produtos = produtos_schema.load(produtos_json)
    
    comanda = Comanda.query.get_or_404(comanda_id)
    comanda.produtos.extend(produtos)

    db.session.commit()
