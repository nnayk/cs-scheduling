from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask import Flask, Config, request
from constants import Resources
from flask import jsonify, make_response
from flask_cors import CORS 
import db
from auth import hash_password, check_password
import logging

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config["JWT_SECRET_KEY"] = "CHANGE_TO_SECURE_KEY"
    logging.basicConfig(level=logging.DEBUG)  # Change to INFO or ERROR as needed
    jwt = JWTManager(app)
    # Configure CORS for all routes
    cors = CORS(app, resources={r"/*": {
        "origins": "*",  # Allow all origins (for development only)
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization","Access-Control-Allow-Origin"]
    }})
    app.config["CORS_HEADERS"] = "Content-Type"

    @app.route("/availability",methods=['POST'])
    @jwt_required()
    def set_availability():
        user = get_jwt_identity()
        data = request.get_json()
        app.logger.debug(f"User = {user}")
        app.logger.debug(f"Data = {data}")
        print(f'QUARTER={data["quarter"]}')
        db.save_preferences(user,data["quarter"],data["prefs"])
        return jsonify("Saved preferences"),200
    
    @app.route("/availability",methods=['GET'])
    @jwt_required()
    def get_availability():
        user = get_jwt_identity()
        app.logger.debug("inside get_availability")
        app.logger.debug(f"User = {user}")
        quarter = request.args.get("quarter") 
        app.logger.debug(f"User = {user}, quarter = {quarter}") 
        try:
            preferences = db.get_availability(user,quarter)
            app.logger.debug(f"Preferences for {quarter} for user {user} = {preferences}")
            return jsonify(preferences), 200
        except Exception as e:
            print("Exception",e)
            return jsonify("Error reading from DB"), 500
    
    @app.route("/login",methods=['POST','OPTIONS'])
    def login():
        # TODO: consider deleting this
        if request.method == 'OPTIONS':
            response = make_response()
            response.headers.add("Access-Control-Allow-Origin", "*")
            response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
            response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
            return response
        data = request.get_json()
        app.logger.info(f"login data = {data}")
        user = db.get_user_by_email(data["email"])
        if not user:
            return {"message":"Email doesn't exist"},401
        user_id, email, expected_pwd_hash = user 
        if check_password(data["password"],expected_pwd_hash):
            access_token = create_access_token(identity=str(user_id))
            return {"message":"User authenticated",
                    "access_token":access_token
                    },200
        else:
            return jsonify({"message":"Incorrect password"}),401

    @app.route("/register",methods=['POST'])
    def register():
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
        plain_text_password = data["password"]
        # Hash the password
        hashed_password = hash_password(plain_text_password)
        email = data["email"] or "bobby@gmail.com"
        response = db.addUser(email,hashed_password)
        if response:
            return {"message":"User added successfully"}
        else:
            return {"message":"User not added"},500 
    @app.route("/api/verify_user", methods=["GET","OPTIONS"])
    @jwt_required()
    def verify_user():
        if request.method == 'OPTIONS':
            app.logger.info("Got an options request")
            response = make_response()
            response.headers.add("Access-Control-Allow-Origin", "*")
            response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
            response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
            return response
        try:
            # Retrieve the user by username
            user = get_jwt_identity()
            return jsonify({"authenticated": True}), 200
        except Exception as e:
            app.logger.error(f"exception = {e}")
            return jsonify({"error": str(e)}), 500
    
    @app.before_request
    def log_request_info():
        print(f"Headers: {request.headers}")
        print(f"Body: {request.get_data()}")

    return app

