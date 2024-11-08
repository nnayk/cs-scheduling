import db.db_config as db_config
import logging

# Constants
WRITTEN_ANSWERS_TABLE = "WRITTEN_ANSWERS"

conn,cur = db_config.connect()

def createWrittenAnswersTable():
    print("Creating written answers table")
    sql_mwf = f"""
    CREATE TABLE IF NOT EXISTS {WRITTEN_ANSWERS_TABLE} (
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        quarter VARCHAR(15) REFERENCES quarters(quarter) ON DELETE CASCADE, 
        question INT REFERENCES questions(id) ON DELETE CASCADE,
        response VARCHAR(500),
        PRIMARY KEY (user_id,quarter,question)
    );
    """
    cur.execute(sql_mwf)
    logging.debug(f"Created written answers table")
    conn.commit()

def get_question_id(question_text):
    sql = f"""
    SELECT id
    FROM questions
    WHERE question = %s;
    """
    cur.execute(sql,(question_text,))
    question_id = cur.fetchone()
    if question_id:
        return question_id[0]
    else:
        return None

def get_written_answer(user_id, quarter,question_text):
    question_id = get_question_id(question_text)
    sql = f"""
    SELECT response
    FROM {WRITTEN_ANSWERS_TABLE}
    WHERE user_id = %s AND quarter = %s AND question = %s;
    """
    cur.execute(sql,(user_id,quarter,question_id))
    response = cur.fetchone()
    if response:
        return response[0]
    else:
        return None

def save_written_answer(user_id,quarter,question_id,response):
    # question_id = get_question_id(question_text)
    sql = f"""
    INSERT INTO {WRITTEN_ANSWERS_TABLE} (user_id,quarter,question,response)
    VALUES (%s,%s,%s,%s)
    ON CONFLICT (user_id,quarter,question) DO UPDATE
    SET response = %s;
    """
    cur.execute(sql,(user_id,quarter,question_id,response,response))
    conn.commit()
    logging.debug(f"Saved written answer {response} for user {user_id}, quarter {quarter}, question {question_id}")
