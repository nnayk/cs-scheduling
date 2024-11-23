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

def get_profile_id(user_id, name):
    conn, cur = db_config.connect()
    try:
        sql = f"SELECT id FROM {PROFILES_TABLE} WHERE user_id = %s AND name = %s"
        cur.execute(sql, (user_id, name))
        data = cur.fetchone()
        logging.debug(f"data = {data}")
        return data[0] if data else None
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

def get_profiles(user_id):
    conn, cur = db_config.connect()
    try:
        sql = f"SELECT name FROM {PROFILES_TABLE} WHERE user_id = %s"
        cur.execute(sql, (user_id,))
        data = cur.fetchall()
        return [x[0] for x in data]
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

def deleteProfile(profile_id):
    conn, cur = db_config.connect()
    try:
        sql = f"DELETE FROM {PROFILES_TABLE} WHERE profile = ANY(%s)"
        cur.execute(sql, (profile_id))
        conn.commit()
        logging.debug(f"Deleted profile id = {profile_id}")
    finally:
        db_config.close_connection(conn, cur)
