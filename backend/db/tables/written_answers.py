import db.db_config as db_config
import logging

# Constants
WRITTEN_ANSWERS_TABLE = "WRITTEN_ANSWERS"

def createWrittenAnswersTable():
    conn, cur = db_config.connect()
    try:
        print("Creating written answers table")
        sql_mwf = f"""
        CREATE TABLE IF NOT EXISTS {WRITTEN_ANSWERS_TABLE} (
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            quarter VARCHAR(15) REFERENCES quarters(quarter) ON DELETE CASCADE, 
            question INT REFERENCES written_questions(id) ON DELETE CASCADE,
            response VARCHAR(500),
            PRIMARY KEY (user_id, quarter, question)
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

def get_written_answers(user_id, quarter):
    conn, cur = db_config.connect()
    try:
        sql = f"""
        SELECT question, response
        FROM {WRITTEN_ANSWERS_TABLE}
        WHERE user_id = %s AND quarter = %s;
        """
        cur.execute(sql, (user_id, quarter))
        responses = cur.fetchall()
        return {question: response for question, response in responses} if responses else None
    finally:
        db_config.close_connection(conn, cur)

def get_written_answer(user_id, quarter, question_text):
    question_id = get_question_id(question_text)
    if question_id is None:
        logging.debug(f"Question not found: {question_text}")
        return None

    conn, cur = db_config.connect()
    try:
        sql = f"""
        SELECT response
        FROM {WRITTEN_ANSWERS_TABLE}
        WHERE user_id = %s AND quarter = %s AND question = %s;
        """
        cur.execute(sql, (user_id, quarter, question_id))
        response = cur.fetchone()
        return response[0] if response else None
    finally:
        db_config.close_connection(conn, cur)

def save_written_answer(user_id, quarter, question_id, response):
    conn, cur = db_config.connect()
    try:
        sql = f"""
        INSERT INTO {WRITTEN_ANSWERS_TABLE} (user_id, quarter, question, response)
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (user_id, quarter, question) DO UPDATE
        SET response = EXCLUDED.response;
        """
        cur.execute(sql, (user_id, quarter, question_id, response))
        conn.commit()
        logging.debug(f"Saved written answer '{response}' for user {user_id}, quarter {quarter}, question {question_id}")
    except Exception as e:
        conn.rollback()
        logging.error(f"Failed to save written answer for user {user_id}: {e}")
    finally:
        db_config.close_connection(conn, cur)
