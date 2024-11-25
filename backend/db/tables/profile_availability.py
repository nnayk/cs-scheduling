import db.db_config as db_config
import logging
import profiles
from db_constants import time_slots_cols

# Constants
NUM_TIMESLOTS = 16
AVAILABILITY = "profile_availability"

def createProfileAvailabilityTable():
    conn, cur = db_config.connect()
    try:
        print("Creating availability table")
        
               
        
        times = ", ".join(time_slots_cols)
        
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

def get_availability(user_id, profile,day=None):
    logging.debug(f"Getting availability for user {user_id} in profile {profile}")
    profile_id = profiles.get_profile_id(user_id, profile)
    if not profile_id:
        raise ValueError(f"Profile {profile} does not exist for user {user_id}")
    conn, cur = db_config.connect()
    try:
        sql = f"""
        SELECT * 
        FROM {AVAILABILITY}
        WHERE user_id = %s
        AND profile = %s
        """
    
        if day:
            sql += "AND day = %s"
            cur.execute(sql, (user_id, profile_id, day))
        else:
            cur.execute(sql, (user_id, profile_id))
        data = cur.fetchall()
        print(f"Fetched data = {data}")
        print(f'data={data}')
        logging.debug(f"Data = {data}")
        
        if not data:
            return [["Unacceptable"] * 16]*5

        TOTAL_COLS = NUM_TIMESLOTS + 3  # 3 for user_id and profile and day
        assert len(data) == 5 and len(data[0]) == TOTAL_COLS and len(data[1]) == TOTAL_COLS, \
            f"Unexpected data format for data: length = {len(data)}, data[0] = {data[0]}, data[1] = {data[1]}"

        prefs = [data[i][3:] for i in range(5)]
        logging.debug(f"prefs = {prefs}")
        print(f'prefs={prefs}')
        return prefs
        # mwf_prefs = [x if x else "Unacceptable" for x in data[0][2:]]
        # logging.debug(f"mwf_prefs = {mwf_prefs}")
        
        # tr_prefs = [x if x else "Unacceptable" for x in data[1][2:]]
        # logging.debug(f"tr_prefs = {tr_prefs}")
        
        # return [mwf_prefs, tr_prefs]
    finally:
        db_config.close_connection(conn, cur)

def save_availability(user_id, profile, data):
    profile_id = profiles.get_profile_id(user_id, profile)
    logging.debug(f"Profile id = {profile_id}")
    if not profile_id:
        raise ValueError(f"Profile {profile} does not exist for user {user_id}")
    conn, cur = db_config.connect()
    try:
        print(f"Saving availability for user {user_id}, data = {data}")
        for entry in data:
            time = entry['time'].upper()  
            preference = entry['preference']
            day = entry['day'] 
            
            logging.debug(f"Inserting pref {preference} for time {time} for user {user_id} in profile {profile} for day {day}")
            sql = f"""
            INSERT INTO {AVAILABILITY} (user_id, profile,day, "{time}")
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (user_id, profile,day) DO UPDATE
            SET "{time}" = EXCLUDED."{time}";
            """
            cur.execute(sql, (user_id, profile_id, day, preference))    

        conn.commit()
        logging.info("Saved preferences")
    finally:
        db_config.close_connection(conn, cur)

def deleteProfile(profile_id):
    conn, cur = db_config.connect()
    try:
        sql = f"DELETE FROM {AVAILABILITY} WHERE profile = {profile_id}"
        cur.execute(sql)
        conn.commit()
        logging.debug(f"Deleted availability for profile {profile_id}")
    finally:
        db_config.close_connection(conn, cur)