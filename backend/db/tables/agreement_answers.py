import db.db_config as db_config
import logging

# Constants
AGREEMENT_ANSWERS_TABLE = "AGREEMENT_ANSWERS"

def createAgreementAnswersTable():
    print("Creating agreement answers table")
    conn, cur = db_config.connect()
    try:
        sql = f"""
        CREATE TABLE IF NOT EXISTS {AGREEMENT_ANSWERS_TABLE} (
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            quarter VARCHAR(15) REFERENCES quarters(quarter) ON DELETE CASCADE, 
            question INT REFERENCES agreement_questions(id) ON DELETE CASCADE,
            category VARCHAR(100) NOT NULL,
            agreement VARCHAR(20) REFERENCES agreement_levels(category) ON DELETE CASCADE,
            PRIMARY KEY (user_id, quarter, question, category)
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

def get_agreement_answers(user_id, quarter):
    conn, cur = db_config.connect()
    try:
        logging.debug("inside get_agreement_answers")
        sql = f"""
        SELECT question, category, agreement
        FROM {AGREEMENT_ANSWERS_TABLE}
        WHERE user_id = %s AND quarter = %s;
        """
        cur.execute(sql, (user_id, quarter))
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

def get_agreement_answer(user_id, quarter, question_text):
    conn, cur = db_config.connect()
    try:
        question_id = get_question_id(question_text)
        sql = f"""
        SELECT agreement
        FROM {AGREEMENT_ANSWERS_TABLE}
        WHERE user_id = %s AND quarter = %s AND question = %s;
        """
        cur.execute(sql, (user_id, quarter, question_id))
        response = cur.fetchone()
        return response[0] if response else None
    finally:
        db_config.close_connection(conn, cur)

def save_agreement_answer(user_id, quarter, question_id, category, agreement):
    conn, cur = db_config.connect()
    try:
        print(f"question_id={question_id}, category={category}, agreement={agreement}, user_id={user_id}, quarter={quarter}")
        sql = f"""
        INSERT INTO {AGREEMENT_ANSWERS_TABLE} (user_id, quarter, question, category, agreement)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (user_id, quarter, question, category) DO UPDATE
        SET agreement = %s;
        """
        cur.execute(sql, (user_id, quarter, question_id, category, agreement, agreement))
        conn.commit()
        logging.debug(f"Saved agreement answer {agreement} for user {user_id}, quarter {quarter}, question {question_id}, category {category}")
    finally:
        db_config.close_connection(conn, cur)
