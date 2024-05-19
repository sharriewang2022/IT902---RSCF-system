from flask import Flask, request, session
import os, sys

from flask_cors import CORS
from config.setting import SERVER_PORT
from api import user
from api import product
from api import order
from api import category
from api import document
from api import menu
from api import role


BASE_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_PATH)

app = Flask(__name__)
app.secret_key = os.urandom(24)
app.config['SESSION_TYPE'] = 'filesystem'
# session(app)

# CORS(app, expose_headers='Authorization')
CORS(app, resources={r"/*": {"origins": "*"}})
# Allow CORS requests

app.register_blueprint(user.UserBP)
app.register_blueprint(product.ProductBP)
app.register_blueprint(role.RoleBP)
app.register_blueprint(order.OrderBP)
app.register_blueprint(category.CategoryBP)
app.register_blueprint(document.DocumentBP)
app.register_blueprint(menu.MenuBP)


if __name__ == '__main__':
    # url_map shows all flask route info
    app.secret_key = os.urandom(24)
    print("\n url_map = {0} \n".format(app.url_map))
    app.run(host="0.0.0.0", port=SERVER_PORT, debug=True)

@app.route("/", methods =['GET'])
def home():
    return "Hello, Flask!%$##"


@app.route("/test", methods =['GET'])
def test():
    print("testss")
    return "test, Flask!" 