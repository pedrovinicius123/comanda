import werkzeug.exceptions as exc
from flask import Flask, jsonify
from flask_migrate import Migrate
from marshmallow import ValidationError

from .config import Config
from .routes.atendente import bp as bp_atendente
from .routes.atendimento import bp as bp_atendimento
from .utils.modules import db, lm, msh


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate = Migrate(app, db)
    msh.init_app(app)
    lm.init_app(app)

    @app.errorhandler(exc.NotFound)
    def not_found(error):
        return "Resource not found", error.code

    @app.errorhandler(exc.InternalServerError)
    def error(error):
        return jsonify(error="Internal server error"), error.code

    @app.errorhandler(ValidationError)
    def validation_error(error):
        return jsonify(error="Dados inválidos", details=error.messages), error.code

    @app.errorhandler(exc.BadRequest)
    def bad_request(error):
        return jsonify(error=error.description), error.code

    @app.errorhandler(exc.Unauthorized)
    def unauthorized_error(error):
        return jsonify(error=error.description), error.code

    @lm.unauthorized_handler
    def unauthorized(error):
        return jsonify(error="Autenticação necessária"), error.code

    app.register_blueprint(bp_atendente)
    app.register_blueprint(bp_atendimento)
    return app
