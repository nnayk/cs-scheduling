import logging
import psycopg2 as pg

conn = None
cur = None

# Table names
MWF_TABLE = "mwf_availability"
TR_TABLE = "tr_availability"
QUARTER_ANSWERS_TABLE = "quarter_answers"

# Constants
NUM_TIMESLOTS = 9

# Connect to the database
def connect():
    global conn, cur
    if conn and cur:
        logging.debug("Already connected to DB")
        return conn, cur
    conn = pg.connect(host="localhost",dbname="postgres",user="postgres",password="lillu178!",port=5432)
    cur = conn.cursor() 
    logging.debug("Connected to DB")
    return conn, cur

def addUser(email,password):
    passed = True
    try:
        sql = f"INSERT INTO {USERS_TABLE} (email, password) VALUES (%s, %s)"
        cur.execute(sql, (email, password))
        conn.commit()
        logging.debug(f"Inserted user {email} into DB")
    except pg.DatabaseError as error:
        # Rollback the transaction in case of error
        conn.rollback()
        # Print the error message
        print(f"Error occurred during commit: {error}")
        passed = False
    return passed

def get_user_by_email(email):
    sql = f"SELECT * FROM {USERS_TABLE} WHERE email = %s"
    cur.execute(sql, (email,))
    user = cur.fetchone()  # Retrieves the first row from the result set
    logging.debug(f"Selected user {email} from DB")
    return user



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
    cur.execute(sql)
    conn.commit()
    logging.debug(f"Created questions table")

def insertQuarter_Answers(user_id,quarter,answers):
    for question_id,answer in answers.items():
        sql = f"INSERT INTO {QUARTER_ANSWERS_TABLE} (user_id,quarter,question,answer) VALUES (%s, %s, %s, %s)"
        cur.execute(sql, (user_id,quarter,question_id,answer))
    conn.commit()
    logging.debug(f"Inserted quarter answers")

def clear_table(table):
    cur.execute(f"DELETE FROM {table}")
    conn.commit()
    logging.debug(f"Cleared table {table}")
    
def delete_table(table):
    cur.execute(f"DROP TABLE {table}")
    conn.commit()
    logging.debug(f"Deleted table {table}")


def get_availability(user_id, quarter):
    # TODO: don't hardcode table names + don't add the vars here due to sql injection vulenrability (use %s instead for cur.execute). Do this for all queries
    sql = f"""
    SELECT * 
    FROM {MWF_TABLE}
    WHERE user_id = %s
    AND quarter = %s
    
    UNION ALL
    
    SELECT * 
    FROM {TR_TABLE}
    WHERE user_id = %s
    AND quarter = %s;
    """
 
    cur.execute(sql,(user_id,quarter,user_id,quarter))
    data = cur.fetchall()
    logging.debug(f"Data = {data}")
    if not data:
        return [["Unacceptable"]*10,["Unacceptable"]*10]
    # The query response is provided in a rather ugly form: 
    # [(user_id,<mwf 9 am pref>,<mwf 10 am pref>,...user_id,<tr 9 am pref>,...)].
    # Clean this up and return a 2d array where:
    # element 0 = list of mwf preferences
    # element 1 = list of tr preferences
    TOTAL_COLS = NUM_TIMESLOTS + 2  # 2 for user_id and quarter 
    assert len(data) == 2 and len(data[0]) == TOTAL_COLS and len(data[1]) == TOTAL_COLS, f"Unexpected data format for data: length = {len(data)}, data[0] = {data[0]}, data[1] = {data[1]}"
    mwf_prefs = list(data[0][2:])
    mwf_prefs = [x if x else "Unacceptable" for x in mwf_prefs]
    logging.debug(f"mwf_prefs = {mwf_prefs}")
    tr_prefs = list(data[1][2:])
    tr_prefs = [x if x else "Unacceptable" for x in tr_prefs]
    logging.debug(f"tr_prefs = {tr_prefs}")
    return [mwf_prefs,tr_prefs]

def save_availability(user_id,quarter,data):
    print(f"Saving availability for user {user_id}, data = {data}")
    for entry in data:
        schedule = entry['schedule']
        time = entry['time'].upper()  
        preference = entry['preference']
        
        # Choose the correct table based on the schedule
        if schedule == 'MWF Schedule':
            table = MWF_TABLE 
        elif schedule == 'TR Schedule':
            table = TR_TABLE
        else:
            print(f"Schedule not recognized: {schedule}")
            continue  # Skip if schedule is not recognized
        print(f"table = {table}")
        logging.debug(f"Inserting pref {preference} for time {time} for user {user_id} in quarter {quarter}")
        sql = f"""
        INSERT INTO {table} (user_id, quarter, "{time}")
        VALUES (%s, %s, %s)
        ON CONFLICT (user_id,quarter) DO UPDATE
        SET "{time}" = EXCLUDED."{time}";
        """
        cur.execute(sql,(user_id,quarter,preference))    
    conn.commit()
    logging.info("Saved preferences")
    
if __name__ == "__main__":
    cur.close()