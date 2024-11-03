import logging
import psycopg2 as pg

conn = pg.connect(host="localhost",dbname="postgres",user="postgres",password="lillu178!",port=5432)
cur = conn.cursor()

# Table names
MWF_TABLE = "mwf_availability"
TR_TABLE = "tr_availability"
PROFILES_TABLE = "profiles"
USERS_TABLE = "users"
QUESTIONS_TABLE = "questions"
QUARTERS_TABLE = "quarters"
QUARTER_ANSWERS_TABLE = "quarter_answers"

# Data
QUESTIONS = [
    "If teaching 1 class with a lab, I would prefer",
    "If teaching 2 classes with labs, I would prefer",
    "If teaching 3 classes with labs, I would prefer",
    "If teaching lecture only classes (4 lecture units, e.g. 248/445/grad courses), I prefer",
    "Given the choice, I would prefer",
    "Are there constraints you have that don't fit this format?",
    "For each of the courses you are teaching in the specified quarter, do you have a room requirement? I.e. the course must be taught in the room due to equipment concerns? (Note that we do not have much control over lecture rooms and scheduling lectures in lab rooms for CSSE from 8am to 3pm is very difficult due to space constraints).",
    "For the courses you are teaching in the specified quarter, do you have a room preference? (Note that we do not have much control over lecture rooms and scheduling lectures in lab rooms from 8am to 3pm is very difficult due to space constraints). You can include whiteboard vs blackboard preference here, the university registrar tries to respect those requests.",
    "Any other thoughts/questions/comments/concerns?",
    "This survey is"
]

# Constants
QUESTIONS_OFFSET = 3 + 1 # 3 for the first 3 questions, 1 for Python's 0-based indexing
NUM_TIMESLOTS = 9

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

def createUsersTable():
    sql = f"""CREATE TABLE IF NOT EXISTS {USERS_TABLE} (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL);"""
    cur.execute(sql)
    conn.commit()
    logging.debug(f"Created users table")

def createAvailabilityTables():
    print("Creating preferences table")
    times = ", ".join([
            '"9 AM" VARCHAR(255)',
            '"10 AM" VARCHAR(255)',
            '"11 AM" VARCHAR(255)',
            '"12 PM" VARCHAR(255)',
            '"1 PM" VARCHAR(255)',
            '"2 PM" VARCHAR(255)',
            '"3 PM" VARCHAR(255)',
            '"4 PM" VARCHAR(255)',
            '"5 PM" VARCHAR(255)',
            ]);
    sql_mwf = f"""
    CREATE TABLE IF NOT EXISTS {MWF_TABLE} (
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        quarter VARCHAR(255),
        {times},
        PRIMARY KEY (user_id,quarter)
    );
    """
    cur.execute(sql_mwf)
    sql_tr = f"""
    CREATE TABLE IF NOT EXISTS {TR_TABLE} (
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        quarter VARCHAR(255),
        {times},
        PRIMARY KEY (user_id,quarter)
    );
    """
    cur.execute(sql_tr)
    logging.debug(f"Created availability tables")
    conn.commit()

def createQuestionsTable():
    sql_create = f"""CREATE TABLE IF NOT EXISTS {QUESTIONS_TABLE} (
        id SERIAL PRIMARY KEY,
        question VARCHAR(400) NOT NULL
        );
        ALTER SEQUENCE {QUESTIONS_TABLE}_id_seq RESTART WITH {QUESTIONS_OFFSET};
        """
    cur.execute(sql_create)
    for question in QUESTIONS:
        sql_insert = f"INSERT INTO {QUESTIONS_TABLE} (question) VALUES (%s)"
        cur.execute(sql_insert, (question,))
    conn.commit()
    logging.debug(f"Created questions table")

def createQuartersTable():
    sql = f"""CREATE TABLE IF NOT EXISTS {QUARTERS_TABLE} (
        quarter VARCHAR(255) PRIMARY KEY
        );
        """
    cur.execute(sql)
    conn.commit()
    logging.debug(f"Created questions table")

def insertQuarters(quarters):
    for quarter in quarters:
        sql = f"INSERT INTO {QUARTERS_TABLE} (quarter) VALUES (%s)"
        cur.execute(sql, (quarter,))
    conn.commit()
    logging.debug(f"Inserted quarters")

def createQuarter_QuestionsTable():
    sql = f"""CREATE TABLE IF NOT EXISTS {QUARTER_ANSWERS_TABLE} (
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        quarter VARCHAR(255) NOT NULL,
        question INT REFERENCES questions(id), # 
        answer VARCHAR(255),
        PRIMARY KEY (user_id,quarter,question)
        );
        """
    cur.execute(sql)
    conn.commit()
    logging.debug(f"Created questions table")

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

def save_preferences(user_id,quarter,data):
    print(f"Saving preferences for user {user_id}, data = {data}")
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