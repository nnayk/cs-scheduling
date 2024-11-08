import db.db_config as db_config
import logging

# Constants
AGREEMENT_ANSWERS_TABLE = "AGREEMENT_ANSWERS"

conn,cur = db_config.connect()

def createAgreementAnswersTable():
    print("Creating agreement answers table")
    sql_mwf = f"""
    CREATE TABLE IF NOT EXISTS {AGREEMENT_ANSWERS_TABLE} (
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        quarter VARCHAR(15) REFERENCES quarters(quarter) ON DELETE CASCADE, 
        question INT REFERENCES agreement_questions(id) ON DELETE CASCADE,
        category VARCHAR(100) NOT NULL,
        agreement VARCHAR(20) REFERENCES agreement_levels(category) ON DELETE CASCADE,
        PRIMARY KEY (user_id,quarter,question,category)
    );
    """
    cur.execute(sql_mwf)
    logging.debug(f"Created agreement answers table")
    conn.commit()

def get_question_id(question_text):
    sql = f"""
    SELECT id
    FROM agreement_questions
    WHERE question = %s;
    """
    cur.execute(sql,(question_text,))
    question_id = cur.fetchone()
    if question_id:
        return question_id[0]
    else:
        return None

def get_agreement_answer(user_id, quarter,question_text):
    question_id = get_question_id(question_text)
    sql = f"""
    SELECT agreement
    FROM {AGREEMENT_ANSWERS_TABLE}
    WHERE user_id = %s AND quarter = %s AND question = %s;
    """
    cur.execute(sql,(user_id,quarter,question_id))
    response = cur.fetchone()
    if response:
        return response[0]
    else:
        return None

def save_agreement_answer(user_id,quarter,question_id,category,agreement):
    print(f"question_id={question_id}, category={category}, agreement={agreement}, user_id={user_id}, quarter={quarter}")
    # question_id = get_question_id(question_text)
    sql = f"""
    INSERT INTO {AGREEMENT_ANSWERS_TABLE} (user_id,quarter,question,category,agreement)
    VALUES (%s,%s,%s,%s,%s)
    ON CONFLICT (user_id,quarter,question,category) DO UPDATE
    SET agreement = %s;
    """
    cur.execute(sql,(user_id,quarter,question_id,category,agreement,agreement))
    conn.commit()
    logging.debug(f"Saved agreement answer {agreement} for user {user_id}, quarter {quarter}, question {question_id}, category {category}")
