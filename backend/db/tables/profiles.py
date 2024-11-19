import logging
import db.db_config as db_config

PROFILES_TABLE = "profiles"

def createProfilesTable():
    conn, cur = db_config.connect()
    try:
        sql = f"""CREATE TABLE IF NOT EXISTS {PROFILES_TABLE} (
                  id SERIAL PRIMARY KEY,
                  name VARCHAR(255) UNIQUE NOT NULL
        );
        """
        cur.execute(sql)
        conn.commit()
        logging.debug("Created quarters table")
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
