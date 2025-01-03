import db.db_config as db_config
import logging
import db.tables.profiles as profiles

# Constants
WRITTEN_ANSWERS_TABLE = "PROFILE_WRITTEN_ANSWERS"

def createProfileWrittenAnswersTable():
    conn, cur = db_config.connect()
    try:
        print("Creating written answers table")
        sql_mwf = f"""
        CREATE TABLE IF NOT EXISTS {WRITTEN_ANSWERS_TABLE} (
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            profile INT REFERENCES profiles(id) ON DELETE CASCADE, 
            question INT REFERENCES written_questions(id) ON DELETE CASCADE,
            response VARCHAR(500),
            PRIMARY KEY (user_id, profile, question)
        );
        """
        cur.execute(sql_mwf)
        conn.commit()
        logging.debug("Created written answers table")
    finally:
        db_config.close_connection(conn, cur)

def get_question_id(question_text):
    conn, cur = db_config.connect()
    try:
        sql = """
        SELECT id
        FROM written_questions
        WHERE question = %s;
        """
        cur.execute(sql, (question_text,))
        question_id = cur.fetchone()
        return question_id[0] if question_id else None
    finally:
        db_config.close_connection(conn, cur)

def get_written_answers(user_id, profile):
    profile_id = profiles.get_profile_id(user_id, profile)
    if not profile_id:
        raise ValueError(f"Profile {profile} does not exist for user {user_id}")
    conn, cur = db_config.connect()
    try:
        sql = f"""
        SELECT question, response
        FROM {WRITTEN_ANSWERS_TABLE}
        WHERE user_id = %s AND profile = %s;
        """
        cur.execute(sql, (user_id, profile_id))
        responses = cur.fetchall()
        return {question: response for question, response in responses} if responses else None
    finally:
        db_config.close_connection(conn, cur)

def get_written_answer(user_id, profile, question_text):
    profile_id = profiles.get_profile_id(user_id, profile)
    if not profile_id:
        raise ValueError(f"Profile {profile} does not exist for user {user_id}")
    question_id = get_question_id(question_text)
    if question_id is None:
        logging.debug(f"Question not found: {question_text}")
        return None

    conn, cur = db_config.connect()
    try:
        sql = f"""
        SELECT response
        FROM {WRITTEN_ANSWERS_TABLE}
        WHERE user_id = %s AND profile = %s AND question = %s;
        """
        cur.execute(sql, (user_id, profile_id, question_id))
        response = cur.fetchone()
        return response[0] if response else None
    finally:
        db_config.close_connection(conn, cur)

def save_written_answer(user_id, profile, question_id, response):
    profile_id = profiles.get_profile_id(user_id, profile)
    if not profile_id:
        raise ValueError(f"Profile {profile} does not exist for user {user_id}")
    conn, cur = db_config.connect()
    try:
        sql = f"""
        INSERT INTO {WRITTEN_ANSWERS_TABLE} (user_id, profile, question, response)
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (user_id, profile, question) DO UPDATE
        SET response = EXCLUDED.response;
        """
        cur.execute(sql, (user_id, profile_id, question_id, response))
        conn.commit()
        logging.debug(f"Saved written answer '{response}' for user {user_id}, profile {profile}, question {question_id}")
    except Exception as e:
        conn.rollback()
        logging.error(f"Failed to save written answer for user {user_id}: {e}")
    finally:
        db_config.close_connection(conn, cur)

def deleteProfile(profile_id):
    logging.debug(f"Deleting profile {profile_id}")
    conn, cur = db_config.connect()
    try:
        sql = f"DELETE FROM {WRITTEN_ANSWERS_TABLE} WHERE profile = {profile_id}"
        cur.execute(sql)
        conn.commit()
        logging.debug(f"Deleted profile {profile_id}")
    except Exception as e:
        conn.rollback()
        logging.error(f"Failed to delete profile {profile_id}: {e}")
    finally:
        db_config.close_connection(conn, cur)