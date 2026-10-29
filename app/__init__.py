import werkzeug.exceptions as exc
from flask import Flask, jsonify, redirect, render_template, url_for
from flask_migrate import Migrate
from flask_login import login_required
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

    @app.route("/login", methods=["GET"])
    def login():
        return render_template("register_atendente.html", login=True)

    @app.route("/logon", methods=["GET"])
    def logon():
        return render_template("register_atendente.html", login=False)

    @lm.unauthorized_handler
    def unauthorized():
        return redirect(url_for("login"))

    @app.route("/")
    @login_required
    def index():
        return render_template("index.html")

    @app.route("/comandas")
    @login_required
    def comandas():
        return render_template("mesas.html")

    @app.route("/produtos")
    @login_required
    def produtos():
        return render_template("produtos.html")

    app.register_blueprint(bp_atendente)
    app.register_blueprint(bp_atendimento)
    return app
