import logging
import psycopg2 as pg

conn = pg.connect(host="localhost",dbname="postgres",user="postgres",password="lillu178!",port=5432)
cur = conn.cursor()

MWF_TABLE = "mwf_availability"
TR_TABLE = "tr_availability"
PROFILES_TABLE = "profiles"
USERS_TABLE = "users"
QUESTIONS_TABLE = "questions"

def addUser(email,password):
    passed = True
    try:
        cur.execute("INSERT INTO users (email, password) VALUES (%s, %s)", (email, password))
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
    query = "SELECT * FROM users WHERE email = %s"
    cur.execute(query, (email,))
    user = cur.fetchone()  # Retrieves the first row from the result set
    logging.debug(f"Selected user {email} from DB")
    return user

def createUsersTable():
    cur.execute("""CREATE TABLE IF NOT EXISTS Users(
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    );
    """)
    conn.commit()
    logging.debug(f"Created users table")

def createPreferencesTables():
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
    cur.execute(f"""
    CREATE TABLE IF NOT EXISTS mwf_preferences (
        user_id INT PRIMARY KEY,
        {times},
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)
    cur.execute(f"""
    CREATE TABLE IF NOT EXISTS tr_preferences (
        user_id INT PRIMARY KEY,
        {times},
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)
    logging.debug(f"Created preferences table")
    conn.commit()

def clear_table(table):
    cur.execute(f"DELETE FROM {table}")
    conn.commit()
    logging.debug(f"Cleared table {table}")
    
def delete_table(table):
    cur.execute(f"DROP TABLE {table}")
    conn.commit()
    logging.debug(f"Deleted table {table}")


def get_preferences(user_id):
    sql = f"""
    SELECT * 
    FROM mwf_preferences
    WHERE user_id = {user_id}
    
    UNION ALL
    
    SELECT * 
    FROM tr_preferences
    WHERE user_id = {user_id}
    """
 
    cur.execute(sql)
    data = cur.fetchall()
    logging.debug(f"Data = {data}")
    if not data:
        return [[],[]]
    # The query response is provided in a rather ugly form: 
    # [(user_id,<mwf 9 am pref>,<mwf 10 am pref>,...user_id,<tr 9 am pref>,...)].
    # Clean this up and return a 2d array where:
    # element 0 = list of mwf preferences
    # element 1 = list of tr preferences
    data = data[0]
    split_index = data.index(int(user_id),1) if int(user_id) in data[1:] else len(data)
    mwf_prefs = list(data[1:split_index])
    tr_prefs = list(data[split_index+1:])
    return [mwf_prefs,tr_prefs]

def save_preferences(user_id,data):
    print(f"Saving preferences for user {user_id}, data = {data}")
    for entry in data:
        schedule = entry['schedule']
        time = entry['time'].upper()  
        preference = entry['preference']
        
        # Choose the correct table based on the schedule
        if schedule == 'MWF Schedule':
            table = "mwf_preferences"
        elif schedule == 'TR Schedule':
            table = "tr_preferences"
        else:
            print(f"Schedule not recognized: {schedule}")
            continue  # Skip if schedule is not recognized
        print(f"table = {table}")
        sql = f"""
        INSERT INTO {table} (user_id, "{time}")
        VALUES (%s, %s)
        ON CONFLICT (user_id) DO UPDATE
        SET "{time}" = EXCLUDED."{time}";
        """
        cur.execute(sql,(user_id,preference))    
    conn.commit()
    logging.info("Saved preferences")
    
if __name__ == "__main__":
    print("calling function to create users table")
    createUsersTable()
    print("calling function to create preferences table")
    createPreferencesTables()
    cur.close()