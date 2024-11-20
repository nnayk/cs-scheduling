import logging
import db.db_config as db_config

PROFILES_TABLE = "profiles"

def createProfilesTable():
    conn, cur = db_config.connect()
    try:
        sql = f"""CREATE TABLE IF NOT EXISTS {PROFILES_TABLE} (
                  id SERIAL PRIMARY KEY,
                  user_id INT REFERENCES users(id) ON DELETE CASCADE,
                  name VARCHAR(255) UNIQUE NOT NULL
        );
        """
        cur.execute(sql)
        conn.commit()
        logging.debug("Created quarters table")
    finally:
        db_config.close_connection(conn, cur)

def profile_exists(user_id, name):
    conn, cur = db_config.connect()
    try:
        sql = f"SELECT * FROM {PROFILES_TABLE} WHERE user_id = %s AND name = %s"
        cur.execute(sql, (user_id, name))
        data = cur.fetchone()
        return data is not None
    finally:
        db_config.close_connection(conn, cur)
        
def create_profile(user_id, name):
    conn, cur = db_config.connect()
    try:
        sql = f"INSERT INTO {PROFILES_TABLE} (user_id, name) VALUES (%s, %s) RETURNING id"
        cur.execute(sql, (user_id, name))
        profile_id = cur.fetchone()[0]
        conn.commit()
        logging.debug(f"Created profile {profile_id}")
        return profile_id
    finally:
        db_config.close_connection(conn, cur)

#TODO
def editProfile(profile):
    pass

# TODO
def cloneProfile(original,clone):
    pass

def deleteProfile(profile):
    conn, cur = db_config.connect()
    try:
        sql = f"DELETE FROM {PROFILES_TABLE} WHERE quarter = ANY(%s)"
        cur.execute(sql, (profile))
        conn.commit()
        logging.debug(f"Deleted profile {profile}")
    finally:
        db_config.close_connection(conn, cur)
