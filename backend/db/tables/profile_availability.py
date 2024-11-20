import db.db_config as db_config
import logging

# Constants
NUM_TIMESLOTS = 16
AVAILABILITY = "profile_availability"


def createProfileAvailabilityTable():
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
            profile INT REFERENCES profiles(id) ON DELETE CASCADE,
            day VARCHAR(10) CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday')),
            {times},
            PRIMARY KEY (user_id, profile, day)
        );
        """
        cur.execute(sql)
        conn.commit()
        print("Availability table created successfully.")
    except Exception as e:
        print(f"Error creating availability table: {e}")
 
    finally:
        db_config.close_connection(conn, cur)

#TODO: fix, this is copied from availability.py
def get_availability(user_id, quarter,profile=None):
    conn, cur = db_config.connect()
    try:
        sql = f"""
        SELECT * 
        FROM {AVAILABILITY}
        WHERE user_id = %s
        AND quarter = %s
        """
    
        if profile:
            sql += "AND profile = %s"
            cur.execute(sql, (user_id, quarter, profile))
        else:
            cur.execute(sql, (user_id, quarter))
        data = cur.fetchall()
        print(f"Fetched data = {data}")
        print(f'data={data}')
        logging.debug(f"Data = {data}")
        
        if not data:
            return [["Unacceptable"] * 16]*5

        TOTAL_COLS = NUM_TIMESLOTS + 3  # 3 for user_id and quarter and profile 
        assert len(data) == 5 and len(data[0]) == TOTAL_COLS and len(data[1]) == TOTAL_COLS, \
            f"Unexpected data format for data: length = {len(data)}, data[0] = {data[0]}, data[1] = {data[1]}"

        prefs = [data[i][3:] for i in range(5)]
        logging.debug(f"prefs = {prefs}")
        print(f'prefs={prefs}')
        return prefs
    finally:
        db_config.close_connection(conn, cur)

def save_availability(user_id, quarter, data):
    conn, cur = db_config.connect()
    try:
        print(f"Saving availability for user {user_id}, data = {data}")
        for entry in data:
            time = entry['time'].upper()  
            preference = entry['preference']
            profile = entry['profile'] 
            
            logging.debug(f"Inserting pref {preference} for time {time} for user {user_id} in quarter {quarter} for profile {profile}")
            sql = f"""
            INSERT INTO {AVAILABILITY} (user_id, quarter,profile, "{time}")
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (user_id, quarter,profile) DO UPDATE
            SET "{time}" = EXCLUDED."{time}";
            """
            cur.execute(sql, (user_id, quarter, profile, preference))    

        conn.commit()
        logging.info("Saved preferences")
    finally:
        db_config.close_connection(conn, cur)