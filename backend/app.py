from flask import Flask, Config
from constants import Resources
from flask import logging
from flask_cors import CORS 

def create_app(config_class=Config):
    app = Flask(__name__)
    cors = CORS(app)
    app.config["CORS_HEADERS"] = "Content-Type"
    app.config.from_object(config_class)
    logger = logging.create_logger(app)
    
    @app.route("/register",methods=['POST'])
    def register():
        data = request.get_json()
        # Validate required fields
        required_fields = ["password", "email"]
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return (
                jsonify(
                    {
                        "message": "Request missing required fields",
                        "missing_fields": missing_fields,
                    }
                ),
                400,
            )

        plain_text_password = data["password"] or "123"
        email = data["email"] or "bobby@gmail.com"
        print(plain_text_password,email)
    @app.route(Resources.PROFESSORS,methods=['GET'])
    def get_professors_preferences():
        return 'Hello, World!'

    @app.route(Resources.PROFESSORS,methods=['POST'])
    def set_professors_preferences():
        return 'Hello, World!'
    return app