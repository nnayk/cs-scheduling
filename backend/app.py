import sys
print(sys.executable)

from flask import Flask, Config, request
from constants import Resources
from flask import logging, jsonify
from flask_cors import CORS 
import db
import bcrypt

def hash_password(password):
    # Generate a salt
    salt = bcrypt.gensalt()
    # Hash the password with the generated salt
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password

def create_app(config_class=Config):
    app = Flask(__name__)
    cors = CORS(app)
    # cors = CORS(app, resources={r"/*": {"origins": "*"}})
    app.config["CORS_HEADERS"] = "Content-Type"
    # app.config.from_object(config_class)
    logger = logging.create_logger(app)

    @app.route("/availability",methods=['POST'])
    def get_availability():
        data = request.get_json()
        print(data)
        return 'Hello, World!' 
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
        # Hash the password
        hashed_password = hash_password(plain_text_password)
        email = data["email"] or "bobby@gmail.com"
        print(plain_text_password,email)
        response = db.addUser(email,hashed_password)
        if response:
            return {"message":"User added successfully"}
        else:
            return {"message":"User not added"},500 
    @app.route(Resources.PROFESSORS,methods=['GET'])
    def get_professors_preferences():
        return 'Hello, World!'

    @app.route(Resources.PROFESSORS,methods=['POST'])
    def set_professors_preferences():
        return 'Hello, World!'
    return app

