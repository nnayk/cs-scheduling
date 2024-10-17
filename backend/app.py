import sys

from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
print(sys.executable)

from flask import Flask, Config, request
from constants import Resources
from flask import logging, jsonify, make_response
from flask_cors import CORS 
import db
from auth import hash_password, check_password


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config["JWT_SECRET_KEY"] = "CHANGE_TO_SECURE_KEY"
    jwt = JWTManager(app)
    # cors = CORS(app)
    # CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
    cors = CORS(app, resources={r"/*": {"origins": "*"}})
    app.config["CORS_HEADERS"] = "Content-Type"
    # app.config.from_object(config_class)
    logger = logging.create_logger(app)

    @app.route("/availability",methods=['POST'])
    # @jwt_required()
    def get_availability():
        data = request.get_json()
        print(data)
        return 'Hello, World!' 
    
    @app.route("/login",methods=['POST','OPTIONS'])
    def login():
        if request.method == 'OPTIONS':
            response = make_response()
            response.headers.add("Access-Control-Allow-Origin", "*")
            response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
            response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
            return response
        print("login")
        data = request.get_json()
        print(f"login data = {data}")
        user = db.get_user_by_email(data["email"])
        if not user:
            return {"message":"Email doesn't exist"},401
        user_id, username, expected_pwd_hash = user 
        print(f"expected_pwd_hash = {expected_pwd_hash}")
        print(f"hash_password(data['password']) = {hash_password(data['password'])}")
        if check_password(data["password"],expected_pwd_hash):
            access_token = create_access_token(identity=str(user_id))
            print(f"access_token = {access_token}")
            return {"message":"User authenticated",
                    "access_token":access_token
                    },200
        else:
            return {"message":"Incorrect password"},401

    @app.route("/register",methods=['POST','OPTIONS'])
    def register():
        if request.method == 'OPTIONS':
            print("options")
            response = make_response()
            response.headers.add("Access-Control-Allow-Origin", "*")
            response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
            response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
            return response

        data = request.get_json()
        # Validate required fields
        required_fields = ["password", "email"]
        # Skipping check for existing email given use case of this app
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
        print(f"plaintext pwd = {plain_text_password},hashed_password = {hashed_password}")
        email = data["email"] or "bobby@gmail.com"
        print(plain_text_password,email)
        response = db.addUser(email,hashed_password)
        if response:
            return {"message":"User added successfully"}
        else:
            return {"message":"User not added"},500 
    @app.route("/api/verify_user", methods=["GET"])
    # @jwt_required()
    def verify_user():
        try:
            # Retrieve the user by username
            # user = get_jwt_identity()
            # temp = User.objects.get(pk=user).username
            return jsonify({"authenticated": True}), 200

        except DoesNotExist:
            # If the user is not found
            return jsonify({"error": "User not found"}), 404
        except jwt.ExpiredSignatureError:
            # Token has expired
            return jsonify({"authenticated": False}), 200
        except jwt.InvalidTokenError:
            # Invalid token
            return jsonify({"authenticated": False}), 200
        except Exception as e:
            # Handle any other exceptions
            return jsonify({"error": str(e)}), 500
    
    @app.route(Resources.PROFESSORS,methods=['GET'])
    def get_professors_preferences():
        return 'Hello, World!'

    @app.route(Resources.PROFESSORS,methods=['POST'])
    def set_professors_preferences():
        return 'Hello, World!'
    return app

