from flask import Flask
from constants import Resources
from flask import logging 

def create_app():
    app = Flask(__name__)
    logging.basicConfig(level=logging.INFO)
    logger = logging.create_logger(app)

    @app.route(Resources.PROFESSORS,methods=['GET'])
    def get_professors_preferences():
        return 'Hello, World!'

    @app.route(Resources.PROFESSORS,methods=['POST'])
    def set_professors_preferences():
        return 'Hello, World!'
    return app