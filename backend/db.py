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

def clear_table(table):
    cur.execute(f"DELETE FROM {table}")
    conn.commit()
    logging.debug(f"Cleared table {table}")
    
def delete_table(table):
    cur.execute(f"DROP TABLE {table}")
    conn.commit()
    logging.debug(f"Deleted table {table}")


def get_availability(user_id):
    # TODO: don't hardcode table names + don't add the vars here due to sql injection vulenrability (use %s instead for cur.execute). Do this for all queries
    sql = f"""
    SELECT * 
    FROM {MWF_TABLE}
    WHERE user_id = %s
    
    UNION ALL
    
    SELECT * 
    FROM {TR_TABLE}
    WHERE user_id = %s
    """
 
    cur.execute(sql,(user_id,user_id))
    data = cur.fetchall()
    logging.debug(f"Data = {data}")
    if not data:
        return [["Unacceptable"]*10,["Unacceptable"]*10]
    # The query response is provided in a rather ugly form: 
    # [(user_id,<mwf 9 am pref>,<mwf 10 am pref>,...user_id,<tr 9 am pref>,...)].
    # Clean this up and return a 2d array where:
    # element 0 = list of mwf preferences
    # element 1 = list of tr preferences
    assert len(data) == 2 and len(data[0]) == 10 and len(data[1]) == 10
    mwf_prefs = list(data[0][1:])
    mwf_prefs = [x if x else "Unacceptable" for x in mwf_prefs]
    tr_prefs = list(data[1][1:])
    tr_prefs = [x if x else "Unacceptable" for x in tr_prefs]
    logging.debug(f"mwf_prefs = {mwf_prefs}")
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