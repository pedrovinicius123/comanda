from ..models.comanda import Atendimento, Comanda, Produto
from ..utils.modules import msh

class AtendimentoSchema(msh.SQLAlchemyAutoSchema):
    class Meta:
        model=Atendimento
        include_fk=True

class ComandaSchema(msh.SQLAlchemyAutoSchema):
    class Meta:
        model=Comanda
        include_fk=True

class ProdutoSchema(msh.SQLAlchemyAutoSchema):
    class Meta:
        model=Produto
        include_fk=True