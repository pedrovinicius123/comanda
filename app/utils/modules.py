from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from flask_login.login_manager import LoginManager

db = SQLAlchemy()
msh = Marshmallow()
lm = LoginManager()
