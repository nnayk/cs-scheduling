import db.db_config as db_config
import logging

# Constants
NUM_TIMESLOTS = 9
AVAILABILITY = "availability"
MWF_TABLE = "mwf_availability"
TR_TABLE = "tr_availability"

def createAvailabilityTable():
    conn, cur = db_config.connect()
    try:
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
        ])
        
        sql = f"""
        CREATE TABLE IF NOT EXISTS {MWF_TABLE} (
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            quarter VARCHAR(15) REFERENCES quarters(quarter) ON DELETE CASCADE, 
            {times},
            PRIMARY KEY (user_id,quarter)
        );
        """
        cur.execute(sql)
        # print("Creating preferences table")
        # times = ", ".join([
        #     '"9 AM" VARCHAR(255)',
        #     '"10 AM" VARCHAR(255)',
        #     '"11 AM" VARCHAR(255)',
        #     '"12 PM" VARCHAR(255)',
        #     '"1 PM" VARCHAR(255)',
        #     '"2 PM" VARCHAR(255)',
        #     '"3 PM" VARCHAR(255)',
        #     '"4 PM" VARCHAR(255)',
        #     '"5 PM" VARCHAR(255)',
        # ])
        
        # sql_mwf = f"""
        # CREATE TABLE IF NOT EXISTS {MWF_TABLE} (
        #     user_id INT REFERENCES users(id) ON DELETE CASCADE,
        #     quarter VARCHAR(15) REFERENCES quarters(quarter) ON DELETE CASCADE, 
        #     {times},
        #     PRIMARY KEY (user_id,quarter)
        # );
        # """
        # cur.execute(sql_mwf)
        
        # sql_tr = f"""
        # CREATE TABLE IF NOT EXISTS {TR_TABLE} (
        #     user_id INT REFERENCES users(id) ON DELETE CASCADE,
        #     quarter VARCHAR(255),
        #     {times},
        #     PRIMARY KEY (user_id,quarter)
        # );
        # """
        # cur.execute(sql_tr)
        
        logging.debug("Created availability table")
        conn.commit()
    finally:
        db_config.close_connection(conn, cur)

def get_availability(user_id, quarter):
    conn, cur = db_config.connect()
    try:
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
    
        cur.execute(sql, (user_id, quarter, user_id, quarter))
        data = cur.fetchall()
        print(f"Fetched data = {data}")
        logging.debug(f"Data = {data}")
        
        if not data:
            return [["Unacceptable"] * 10, ["Unacceptable"] * 10]

        TOTAL_COLS = NUM_TIMESLOTS + 2  # 2 for user_id and quarter 
        assert len(data) == 2 and len(data[0]) == TOTAL_COLS and len(data[1]) == TOTAL_COLS, \
            f"Unexpected data format for data: length = {len(data)}, data[0] = {data[0]}, data[1] = {data[1]}"

        mwf_prefs = [x if x else "Unacceptable" for x in data[0][2:]]
        logging.debug(f"mwf_prefs = {mwf_prefs}")
        
        tr_prefs = [x if x else "Unacceptable" for x in data[1][2:]]
        logging.debug(f"tr_prefs = {tr_prefs}")
        
        return [mwf_prefs, tr_prefs]
    finally:
        db_config.close_connection(conn, cur)

def save_availability(user_id, quarter, data):
    conn, cur = db_config.connect()
    try:
        print(f"Saving availability for user {user_id}, data = {data}")
        for entry in data:
            schedule = entry['schedule']
            time = entry['time'].upper()  
            preference = entry['preference']
            
            # Choose the correct table based on the schedule
            table = MWF_TABLE if schedule == 'MWF Schedule' else TR_TABLE if schedule == 'TR Schedule' else None
            if table is None:
                print(f"Schedule not recognized: {schedule}")
                continue
            
            logging.debug(f"Inserting pref {preference} for time {time} for user {user_id} in quarter {quarter}")
            sql = f"""
            INSERT INTO {table} (user_id, quarter, "{time}")
            VALUES (%s, %s, %s)
            ON CONFLICT (user_id, quarter) DO UPDATE
            SET "{time}" = EXCLUDED."{time}";
            """
            cur.execute(sql, (user_id, quarter, preference))    

        conn.commit()
        logging.info("Saved preferences")
    finally:
        db_config.close_connection(conn, cur)
