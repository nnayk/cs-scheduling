import db.db_config as db_config
import logging
import profiles

# Constants
AGREEMENT_ANSWERS_TABLE = "PROFILE_AGREEMENT_ANSWERS"

def createAgreementAnswersTable():
    print("Creating agreement answers table")
    conn, cur = db_config.connect()
    try:
        sql = f"""
        CREATE TABLE IF NOT EXISTS {AGREEMENT_ANSWERS_TABLE} (
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            profile INT REFERENCES profiles(id) ON DELETE CASCADE, 
            question INT REFERENCES agreement_questions(id) ON DELETE CASCADE,
            category VARCHAR(100) NOT NULL,
            agreement VARCHAR(20) REFERENCES agreement_levels(category) ON DELETE CASCADE,
            PRIMARY KEY (user_id, profile, question, category)
        );
        """
        cur.execute(sql)
        logging.debug(f"Created agreement answers table")
        conn.commit()
    finally:
        db_config.close_connection(conn, cur)

def get_question_id(question_text):
    conn, cur = db_config.connect()
    try:
        sql = """
        SELECT id
        FROM agreement_questions
        WHERE question = %s;
        """
        cur.execute(sql, (question_text,))
        question_id = cur.fetchone()
        return question_id[0] if question_id else None
    finally:
        db_config.close_connection(conn, cur)

def get_agreement_answers(user_id, profile):
    profile_id = profiles.get_profile_id(user_id, profile)
    if not profile_id:
        raise ValueError(f"Profile {profile} does not exist for user {user_id}")
    conn, cur = db_config.connect()
    try:
        logging.debug("inside get_agreement_answers")
        sql = f"""
        SELECT question, category, agreement
        FROM {AGREEMENT_ANSWERS_TABLE}
        WHERE user_id = %s AND profile = %s;
        """
        cur.execute(sql, (user_id, profile_id))
        response = cur.fetchall()
        logging.debug(f"response={response}")
        print(f'response (print)={response}')
        
        if response:
            data = {}
            for question, category, agreement in response:
                print(f'question={question}, category={category}, agreement={agreement}')
                if question not in data:
                    data[question] = {}
                data[question][category] = agreement
            print(f'returning data={data}')
            return data
        else:
            return None
    finally:
        db_config.close_connection(conn, cur)

def get_agreement_answer(user_id, profile, question_text):
    profile_id = profiles.get_profile_id(user_id, profile)
    if not profile_id:
        raise ValueError(f"Profile {profile} does not exist for user {user_id}")
    conn, cur = db_config.connect()
    try:
        question_id = get_question_id(question_text)
        sql = f"""
        SELECT agreement
        FROM {AGREEMENT_ANSWERS_TABLE}
        WHERE user_id = %s AND profile = %s AND question = %s;
        """
        cur.execute(sql, (user_id, profile_id, question_id))
        response = cur.fetchone()
        return response[0] if response else None
    finally:
        db_config.close_connection(conn, cur)

def save_agreement_answer(user_id, profile, question_id, category, agreement):
    profile_id = profiles.get_profile_id(user_id, profile)
    if not profile_id:
        raise ValueError(f"Profile {profile} does not exist for user {user_id}")
    conn, cur = db_config.connect()
    try:
        print(f"question_id={question_id}, category={category}, agreement={agreement}, user_id={user_id}, profile={profile},profile_id={profile_id}")
        sql = f"""
        INSERT INTO {AGREEMENT_ANSWERS_TABLE} (user_id, profile, question, category, agreement)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (user_id, profile, question, category) DO UPDATE
        SET agreement = %s;
        """
        cur.execute(sql, (user_id, profile_id, question_id, category, agreement, agreement))
        conn.commit()
        logging.debug(f"Saved agreement answer {agreement} for user {user_id}, profile {profile}, question {question_id}, category {category}")
    finally:
        db_config.close_connection(conn, cur)

def deleteProfile(profile_id):
    logging.debug(f"Deleting profile {profile_id}")
    conn, cur = db_config.connect()
    try:
        sql = f"DELETE FROM {AGREEMENT_ANSWERS_TABLE} WHERE profile = {profile_id}"
        cur.execute(sql)
        conn.commit()
    finally:
        db_config.close_connection(conn, cur)