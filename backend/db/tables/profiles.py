import logging
import db.db_config as db_config
from db.tables.db_constants import time_slots

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
def cloneProfile(user_id,original,clone):
    logging.debug(f"Cloning profile {original} to {clone}")
    success = False
    try:
        conn, cur = db_config.connect()
        conns = []
        # create a profiles table entry
        clone_id = create_profile(user_id, clone)
        original_id = get_profile_id(user_id, original)
        # clone the profile_availability table entry
        times = ",".join(time_slots)
        sql_availability = f"""
        INSERT INTO profile_availability
        SELECT user_id, %s, day, {times}
        FROM profile_availability
        WHERE profile = %s
        """
        cur.execute(sql_availability, (clone_id, original_id))
        logging.debug(f"Cloned profile_availability")
        # clone the profile_written_questions table entry
        sql_written_questions = """
        INSERT INTO profile_written_answers
        SELECT user_id, %s, question, response
        FROM profile_written_answers
        WHERE profile = %s
        """
        cur.execute(sql_written_questions, (clone_id, original_id))
        logging.debug(f"Cloned profile_written_questions")
        # clone the profile_agreement_questions table entry
        sql_agreement_questions = """
        INSERT INTO profile_agreement_answers
        SELECT user_id, %s, question, category, agreement
        FROM profile_agreement_answers
        WHERE profile = %s
        """
        cur.execute(sql_agreement_questions, (clone_id, original_id))
        logging.debug(f"Cloned profile_agreement_answers")
        conn.commit()
        logging.debug(f"Cloned profile {original} to {clone}")
        success = True
        for c in conns:
            logging.debug(f"Comitting connection {c}")
            c.commit()
            c.close()
    except Exception as e:
        logging.error(f"Error cloning profile {original} to {clone}: {e}")
    finally:
        db_config.close_connection(conn, cur)
    return success

def deleteProfile(profile_id):
    conn, cur = db_config.connect()
    try:
        logging.debug(f"Deleting profile id = {profile_id}")
        sql = f"DELETE FROM {PROFILES_TABLE} WHERE id = {profile_id}"
        cur.execute(sql)
        conn.commit()
        logging.debug(f"Deleted profile id = {profile_id}")
    finally:
        db_config.close_connection(conn, cur)
