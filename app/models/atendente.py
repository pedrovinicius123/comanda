from flask_login import UserMixin

from ..utils.modules import db
from .comanda import Atendimento


class Atendente(db.Model, UserMixin):
    __tablename__ = "atendente"
    id = db.Column(db.Integer, primary_key=True)
    password_hash = db.Column(db.String, nullable=False)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    atendimentos = db.relationship(
        "Atendimento", backref="atendente", lazy=True, cascade="all, delete-orphan"
    )
    
