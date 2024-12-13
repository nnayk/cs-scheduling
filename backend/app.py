import inspect
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask import Flask, Config, request
from constants import Resources
from flask import jsonify, make_response
from flask_cors import CORS 
from db.tables import users, availability, written_answers, agreement_answers, \
profiles,profile_availability, profile_agreement_answers, profile_written_answers
from auth import hash_password, check_password
import logging

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config["JWT_SECRET_KEY"] = "CHANGE_TO_SECURE_KEY" # This is should be deleted when SAML auth is done
    app.config["DEBUG"] = True
    app.logger.setLevel(logging.DEBUG)
    logging.basicConfig(level=logging.DEBUG)  # Change to INFO or ERROR as needed
    JWTManager(app)
    # Configure CORS for all routes
    cors = CORS(app, resources={r"/*": {
        "origins": "*",  # Allow all origins (for development only)
        "methods": ["GET", "POST", "DELETE","OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization","Access-Control-Allow-Origin"]
    }})
    app.config["CORS_HEADERS"] = "Content-Type"

    # Profile routes
    @app.route("/profile_create",methods=['POST'])
    @jwt_required()
    def create_profile():
        app.logger.debug("inside create_profile")
        user = get_jwt_identity()
        data = request.get_json()
        profile = data["profile"]
        app.logger.debug(f'User {user} is creating profile {profile}')
        if profiles.profile_exists(user,profile):
            return jsonify("Profile already exists"),400
        profile_id = profiles.create_profile(user,profile)
        app.logger.debug(f"Created profile {profile_id}")
        return jsonify("Created profile"),200
    

    @app.route("/profile_clone",methods=['POST'])
    @jwt_required()
    def clone_profile():
        app.logger.debug("inside clone_profile")
        user = get_jwt_identity()
        data = request.get_json()
        profile_data = data["profiles"]
        app.logger.debug(f"User = {user}, profiles = {profile_data}")
        existing, new = profile_data["existing"], profile_data["new"]
        app.logger.debug(f"Existing profile = {existing}, new profile = {new}")
        # check if the new profile already exists
        if profiles.profile_exists(user, new):
            return jsonify(f"Profile {new} already exists"), 400
        if profiles.cloneProfile(user,existing,new):
            app.logger.debug(f"Successfully cloned profile {existing} to {new}")
            return jsonify("Cloned profile"),200
        else:
            return jsonify("Error cloning profile"),500

    @app.route("/profiles",methods=['GET'])
    @jwt_required()
    def get_profiles():
        app.logger.debug("inside get_profiles")
        user = get_jwt_identity()
        app.logger.debug(f"User = {user}")
        data = profiles.get_profiles(user)
        app.logger.debug(f"Got the following profiles for user {user}: {data}")
        return jsonify(data),200

    @app.route("/profiles/<path:profile_name>",methods=['DELETE'])
    @jwt_required()
    def delete_profile(profile_name):
        app.logger.debug("inside delete_profile")
        user = get_jwt_identity()
        app.logger.debug(f"User = {user}")
        app.logger.debug(f"Profile to delete = {profile_name}")
        profile_id = profiles.get_profile_id(user,profile_name)
        app.logger.debug(f"Profile ID = {profile_id}")
        profile_agreement_answers.deleteProfile(profile_id)
        profile_written_answers.deleteProfile(profile_id)
        profile_availability.deleteProfile(profile_id)
        profiles.deleteProfile(profile_id)
        app.logger.debug(f"Deleted profile {profile_name}")
        return jsonify(f"Successfully deleted profile {profile_name}"),200
    
    @app.route("/questions",methods=['POST'])
    @jwt_required()
    def save_answers():
        app.logger.debug("inside save_answers")
        user = get_jwt_identity()
        data = request.get_json()
        app.logger.debug(f"User = {user}")
        quarter = data["quarter"].lower()
        agreement_responses = data["agreementAnswers"]
        app.logger.debug('agreement_responses=',agreement_responses)
        for question_id,agreement_data in enumerate(agreement_responses.items()):
            question_id = int(question_id) + 1
            category,agreement_level = agreement_data
            app.logger.debug(f'agreement_data={agreement_data}')
            for category, agreement_level in agreement_data[1].items(): #TODO: Fix frontend to just not pass the oneLab preference...uselsss+dont wanna deal with a 2-tuple
                app.logger.debug('category=',category)
                app.logger.debug('agreement_level=',agreement_level)
                if(agreement_level):
                    agreement_level = agreement_level.lower()
                agreement_answers.save_agreement_answer(user,quarter,question_id,category,agreement_level)
        written_responses = data["writtenAnswers"]
        app.logger.debug('written_responses=',written_responses)
        for question_id,answer in written_responses.items():
            written_answers.save_written_answer(user,quarter,question_id,answer)
        return jsonify("Saved answers"),200

    @app.route("/questions",methods=['GET'])
    @jwt_required()
    def get_answers():
        user = get_jwt_identity()
        app.logger.debug("inside get_answers")
        app.logger.debug(f"User = {user}")
        quarter = request.args.get("quarter").lower()
        profile = request.args.get("profile")
        scope = request.args.get("scope",default=None)
        if scope:
            app.logger.debug(f"Scope = {scope}")
            if scope != "agreement" and scope != "written":
                return jsonify("Invalid scope"),400
        app.logger.debug(f"User = {user}, quarter = {quarter},profile = {profile}") 
        try:
            answers = {}
            if not scope or scope == "written":
                if profile:
                    answers = profile_written_answers.get_written_answers(user,profile)
                else:
                    answers = written_answers.get_written_answers(user,quarter)
            if not scope or scope == "agreement":
                if profile:
                    agreement = profile_agreement_answers.get_agreement_answers(user,profile)
                else:
                    agreement = agreement_answers.get_agreement_answers(user,quarter)
                if agreement:
                    answers.update(agreement)
            app.logger.debug(f"{scope} Answers for {quarter} for user {user} = {answers}")
            return jsonify(answers), 200
        except Exception as e:
            app.logger.debug(f"Exception {e}")
            return jsonify("Error reading from DB"), 500
    
    @app.route("/profile_questions",methods=['POST'])
    @jwt_required()
    def save_profile_answers():
        app.logger.debug("inside save_profile_answers")
        user = get_jwt_identity()
        data = request.get_json()
        app.logger.debug(f"User = {user}")
        app.logger.debug(f"Data = {data}")
        profile = data["profile"]
        agreement_responses = data["agreementAnswers"]
        app.logger.debug('agreement_responses=',agreement_responses)
        for question_id,agreement_data in enumerate(agreement_responses.items()):
            question_id = int(question_id) + 1
            category,agreement_level = agreement_data
            app.logger.debug(f'agreement_data={agreement_data}')
            for category, agreement_level in agreement_data[1].items():
                app.logger.debug('category=',category)
                app.logger.debug('agreement_level=',agreement_level)
                if(agreement_level):
                    agreement_level = agreement_level.lower()
                profile_agreement_answers.save_agreement_answer(user,profile,question_id,category,agreement_level)
        written_responses = data["writtenAnswers"]
        app.logger.debug('written_responses=',written_responses)
        for question_id,answer in written_responses.items():
            profile_written_answers.save_written_answer(user,profile,question_id,answer)
        return jsonify("Saved answers"),200

    @app.route("/profile_questions",methods=['GET'])
    @jwt_required()
    def get_profile_answers():
        user = get_jwt_identity()
        app.logger.debug("inside get_profile__answers")
        app.logger.debug(f"User = {user}")
        profile = request.args.get("profile")
        scope = request.args.get("scope",default=None)
        if scope:
            app.logger.debug(f"Scope = {scope}")
            if scope != "agreement" and scope != "written":
                return jsonify("Invalid scope"),400
        app.logger.debug(f"User = {user}, profile = {profile}") 
        try:
            answers = {}
            if not scope or scope == "written":
                answers = profile_written_answers.get_written_answers(user,profile)
            if not scope or scope == "agreement":
                agreement = profile_agreement_answers.get_agreement_answers(user,profile)
                if agreement:
                    answers.update(agreement)
            app.logger.debug(f"{scope} Answers for {profile} for user {user} = {answers}")
            return jsonify(answers), 200
        except Exception as e:
            app.logger.debug(f"Exception {e}")
            return jsonify("Error reading from DB"), 500
        
    @app.route("/profile_availability",methods=['POST'])
    @jwt_required()
    def set_profile_availability():
        app.logger.debug("inside set_profile_availability")
        user = get_jwt_identity()
        data = request.get_json()
        app.logger.debug(f"User = {user}")
        app.logger.debug(f"Data = {data}")
        profile = data["profile"]
        app.logger.debug(f"Profile = {profile}")
        profile_availability.save_availability(user,data["profile"],data["prefs"])
        return jsonify("Saved preferences"),200
        
    @app.route("/profile_availability",methods=['GET'])
    @jwt_required()
    def get_profile_availability():
        user = get_jwt_identity()
        app.logger.debug("inside get_profile_availability")
        app.logger.debug(f"User = {user}")
        profile = request.args.get("profile") 
        app.logger.debug(f"User = {user}, profile = {profile}") 
        try:
            preferences = profile_availability.get_availability(user,profile) 
            app.logger.debug(f"Preferences for {profile} for user {user} = {preferences}")
            return jsonify(preferences), 200
        except Exception as e:
            app.logger.debug(f"Exception {e}")
            return jsonify("Error reading from DB"), 500

    @app.route("/availability",methods=['POST'])
    @jwt_required()
    def set_availability():
        app.logger.debug("inside set_availability")
        user = get_jwt_identity()
        data = request.get_json()
        app.logger.debug(f"User = {user}")
        app.logger.debug(f"Data = {data}")
        quarter = data["quarter"]
        app.logger.debug(f"Quarter = {quarter}")
        availability.save_availability(user,data["quarter"],data["prefs"])
        return jsonify("Saved preferences"),200
    
    @app.route("/availability",methods=['GET'])
    @jwt_required()
    def get_availability():
        user = get_jwt_identity()
        app.logger.debug("inside get_availability")
        app.logger.debug(f"User = {user}")
        quarter = request.args.get("quarter")
        profile = request.args.get("profile") 
        app.logger.debug(f"User = {user}, quarter = {quarter}, profile = {profile}") 
        try:
            if profile:
                preferences = profile_availability.get_availability(user,profile)
            else:
                preferences = availability.get_availability(user,quarter) 
            app.logger.debug(f"Preferences for {quarter} for user {user} = {preferences}")
            return jsonify(preferences), 200
        except Exception as e:
            app.logger.debug(f"{inspect.currentframe().f_code.co_name} Exception",e)
            return jsonify("Error reading from DB"), 500
    
    @app.route("/login",methods=['POST','OPTIONS'])
    def login():
        app.logger.debug("inside login")
        try:
            # TODO: consider deleting this
            if request.method == 'OPTIONS':
                response = make_response()
                response.headers.add("Access-Control-Allow-Origin", "*")
                response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
                response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
                return response
            data = request.get_json()
            app.logger.info(f"received login data = {data}")
            user = users.get_user_by_email(data["email"]) 
            app.logger.info(f"User = {user}")
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
        except Exception as e:
            app.logger.error(f"Exception = {e}")
            return jsonify({"message":"Error logging in"}),500

    @app.route("/register",methods=['POST'])
    def register():
        app.logger.debug("inside register")
        data = request.get_json()
        required_fields = ["password", "email"]
        # Skipping check for existing email given that SAML auth will replace this 
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
        hashed_password = hash_password(plain_text_password)
        email = data["email"] or "bobby@gmail.com"
        response = users.addUser(email,hashed_password)
        if response:
            return {"message":"User added successfully"}
        else:
            return {"message":"User not added"},500 
    @app.route("/api/verify_user", methods=["GET","OPTIONS"])
    @jwt_required()
    def verify_user():
        app.logger.debug("inside verify_user")
        if request.method == 'OPTIONS':
            app.logger.info("Got an options request")
            response = make_response()
            response.headers.add("Access-Control-Allow-Origin", "*")
            response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
            response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
            return response
        try:
            return jsonify({"authenticated": True}), 200
        except Exception as e:
            app.logger.error(f"Exception = {e}")
            return jsonify({"error": str(e)}), 500
    
    @app.route("/",methods=['GET'])
    def home():
        return "Hello World!"
    
    @app.before_request
    def log_request_info():
        app.logger.debug(f"Headers: {request.headers}")
        app.logger.debug(f"Body: {request.get_data()}")

    return app

