import logging
import db.db_config as db_config
import psycopg2 as pg

USERS_TABLE = "users"

def createUsersTable():
    conn, cur = db_config.connect()
    try:
        sql = f"""CREATE TABLE IF NOT EXISTS {USERS_TABLE} (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
        );"""
        cur.execute(sql)
        conn.commit()
        logging.debug("Created users table")
    finally:
        db_config.close_connection(conn, cur)

def addUser(email, password):
    conn, cur = db_config.connect()
    passed = True
    try:
        sql = f"INSERT INTO {USERS_TABLE} (email, password) VALUES (%s, %s)"
        cur.execute(sql, (email, password))
        conn.commit()
        logging.debug(f"Inserted user {email} into DB")
    except pg.DatabaseError as error:
        conn.rollback()
        logging.error(f"Error occurred during commit: {error}")
        passed = False
    finally:
        db_config.close_connection(conn, cur)
    return passed

def get_user_by_email(email):
    conn, cur = db_config.connect()
    try:
        sql = f"SELECT * FROM {USERS_TABLE} WHERE email = %s"
        cur.execute(sql, (email,))
        user = cur.fetchone()
        logging.debug(f"Selected user {email} from DB")
        return user
    finally:
        db_config.close_connection(conn, cur)
