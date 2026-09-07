from ..utils.modules import db
from datetime import datetime

class Atendimento(db.Model):
    __tablename__="atendimento"
    id = db.Column(db.Integer, primary_key=True)
    atendente_id = db.Column(db.Integer, db.ForeignKey("atendente.id"), nullable=False)
    comandas = db.relationship("Comanda", backref="atendimento", lazy=True, cascade="all, delete-orphan")
    inicio = db.Column(db.DateTime, default=datetime.now())
    fim = db.Column(db.DateTime)

class Comanda(db.Model):
    __tablename__="comanda"
    id = db.Column(db.Integer, primary_key=True)
    id_atendimento = db.Column(db.Integer, db.ForeignKey("atendimento.id"), nullable=False)
    valor_a_pagar = db.Column(db.Float, default=0.0)
    produtos = db.relationship("Produto", backref="comanda", lazy=True)

class Produto(db.Model):
    __tablename__="produto"
    id = db.Column(db.Integer, primary_key=True)
    id_commanda = db.Column(db.Integer, db.ForeignKey("comanda.id"), nullable=False)
    nome = db.Column(db.String)
    preco = db.Column(db.Float)
