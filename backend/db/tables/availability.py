import db.db_config as db_config
import logging

# Constants
NUM_TIMESLOTS = 9
MWF_TABLE = "mwf_availability"
TR_TABLE = "tr_availability"

conn,cur = db_config.connect()

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
        quarter VARCHAR(15) REFERENCES quarters(quarter) ON DELETE CASCADE, 
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