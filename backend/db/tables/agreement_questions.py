import logging
import db.db_config as db_config

QUESTIONS_TABLE = "agreement_questions"
# QUESTIONS_OFFSET = 3 + 1 # 3 for the first 3 questions, 1 for Python's 0-based indexing

# Data
QUESTIONS = [
    "If teaching 1 class with a lab, I would prefer",
    "If teaching 2 classes with labs, I would prefer",
    "If teaching 3 classes with labs, I would prefer",
    "If teaching lecture only classes (4 lecture units, e.g. 248/445/grad courses), I prefer",
    "Given the choice, I would prefer",
]

conn,cur = db_config.connect()

def createAgreementQuestionsTable():
    print("Creating questions table")
    try:
        sql_create = f"""CREATE TABLE IF NOT EXISTS {QUESTIONS_TABLE} (
            id SERIAL PRIMARY KEY,
            question VARCHAR(400) NOT NULL UNIQUE
            );
            """
        cur.execute(sql_create)
        for question in QUESTIONS:
            sql_insert = f"INSERT INTO {QUESTIONS_TABLE} (question) VALUES (%s)"
            cur.execute(sql_insert, (question,))
        conn.commit()
        logging.debug(f"Created questions table")
    finally:
        db_config.close_connection(conn, cur)
