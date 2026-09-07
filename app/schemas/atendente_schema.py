from ..models.atendente import Atendente
from ..utils.modules import msh

class AtendenteSchema(msh.SQLAlchemyAutoSchema):
    class Meta:
        model = Atendente
        include_fk = True
