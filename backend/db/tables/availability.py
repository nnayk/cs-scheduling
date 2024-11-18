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
        print("Creating availability table")
        
        # Generate time slots in 30-minute increments from 9:00 AM to 5:00 PM
        time_slots = [
            f'"{hour}:{minute:02d} {"AM" if hour < 12 else "PM"}" VARCHAR(255)' 
            for hour in range(9, 12)  # 9 AM to 11 AM
            for minute in (0, 30)
        ] + [
            f'"{hour - 12 if hour > 12 else hour}:{minute:02d} {"AM" if hour < 12 else "PM"}" VARCHAR(255)'
            for hour in range(12, 17)  # 12 PM to 5 PM
            for minute in (0, 30)
        ]

        
        
        times = ", ".join(time_slots)
        
        sql = f"""
        CREATE TABLE IF NOT EXISTS {AVAILABILITY} (
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            quarter VARCHAR(15) REFERENCES quarters(quarter) ON DELETE CASCADE,
            day VARCHAR(10) CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday')),
            {times},
            PRIMARY KEY (user_id, quarter, day)
        );
        """
        cur.execute(sql)
        conn.commit()
        print("Availability table created successfully.")
    except Exception as e:
        print(f"Error creating availability table: {e}")
 
    finally:
        db_config.close_connection(conn, cur)

def get_availability(user_id, quarter,day):
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
            time = entry['time'].upper()  
            preference = entry['preference']
            day = entry['day'] 
            
            logging.debug(f"Inserting pref {preference} for time {time} for user {user_id} in quarter {quarter} for day {day}")
            sql = f"""
            INSERT INTO {AVAILABILITY} (user_id, quarter,day, "{time}")
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (user_id, quarter,day) DO UPDATE
            SET "{time}" = EXCLUDED."{time}";
            """
            cur.execute(sql, (user_id, quarter, day, preference))    

        conn.commit()
        logging.info("Saved preferences")
    finally:
        db_config.close_connection(conn, cur)