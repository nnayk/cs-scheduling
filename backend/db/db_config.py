import logging
import psycopg2 as pg

conn = None
cur = None

# Table names
QUARTER_ANSWERS_TABLE = "quarter_answers"


# Connect to the database
def connect():
    global conn, cur
    print("Connecting to DB")
    print(f"beginning: conn={conn}, cur={cur}")
    if conn and cur:
        logging.debug("Already connected to DB")
        return conn, cur
    conn = pg.connect(host="localhost",dbname="postgres",user="postgres",password="lillu178!",port=5432)
    cur = conn.cursor() 
    print(f"end: conn={conn}, cur={cur}")
    logging.debug("Connected to DB")
    return conn, cur

def createQuarter_AnswersTable():
    # Note: TEXT can store up to 65,535 characters
    sql = f"""CREATE TABLE IF NOT EXISTS {QUARTER_ANSWERS_TABLE} (
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        quarter VARCHAR(15) REFERENCES quarters(quarter) ON DELETE CASCADE, 
        question INT REFERENCES questions(id), 
        answer TEXT, 
        PRIMARY KEY (user_id,quarter,question)
        );
        """
    conn,cur = connect()
    cur.execute(sql)
    conn.commit()
    logging.debug(f"Created questions table")

def insertQuarter_Answers(user_id,quarter,answers):
    conn,cur = connect()
    for question_id,answer in answers.items():
        sql = f"INSERT INTO {QUARTER_ANSWERS_TABLE} (user_id,quarter,question,answer) VALUES (%s, %s, %s, %s)"
        cur.execute(sql, (user_id,quarter,question_id,answer))
    conn.commit()
    logging.debug(f"Inserted quarter answers")

def clear_table(table):
    conn,cur = connect()
    cur.execute(f"DELETE FROM {table}")
    conn.commit()
    logging.debug(f"Cleared table {table}")
    
def delete_table(table):
    conn,cur = connect()
    cur.execute(f"DROP TABLE {table}")
    conn.commit()
    logging.debug(f"Deleted table {table}")


    
if __name__ == "__main__":
    cur.close()