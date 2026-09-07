from flask import Flask, jsonify
from .config import Config
from .utils.modules import db, msh, lm
from flask_migrate import Migrate

from .models.atendente import Atendente
from .models.comanda import Atendimento, Comanda, Produto 

from .routes.atendente import bp as bp_atendente
from .routes.atendimento import bp as bp_atendimento

import werkzeug.exceptions as exc
from marshmallow import ValidationError

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate = Migrate(app, db)
    msh.init_app(app)
    lm.init_app(app)

    @app.errorhandler(exc.NotFound)
    def not_found():
        return "Resource not found", exc.NotFound.code

    @app.errorhandler(exc.InternalServerError)
    def error():
        return jsonify(error="Internal server error"), exc.InternalServerError.code

    @app.errorhandler(ValidationError)
    def validation_error(error):
        return jsonify(error="Dados inválidos", details=error.messages), 400

    @app.errorhandler(exc.BadRequest)
    def bad_request(error):
        return jsonify(error=error.description), exc.BadRequest.code

    @app.errorhandler(exc.Unauthorized)
    def unauthorized_error(error):
        return jsonify(error=error.description), exc.Unauthorized.code

    @lm.unauthorized_handler
    def unauthorized():
        return jsonify(error="Autenticação necessária"), 401

    app.register_blueprint(bp_atendente)
    app.register_blueprint(bp_atendimento)
    return app
