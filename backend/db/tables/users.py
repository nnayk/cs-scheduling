import logging
import db.db_config as db_config
import psycopg2 as pg

USERS_TABLE = "users"

conn,cur = db_config.connect()

def createUsersTable():
    sql = f"""CREATE TABLE IF NOT EXISTS {USERS_TABLE} (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL);"""
    cur.execute(sql)
    conn.commit()
    logging.debug(f"Created users table")

def addUser(email,password):
    passed = True
    try:
        sql = f"INSERT INTO {USERS_TABLE} (email, password) VALUES (%s, %s)"
        cur.execute(sql, (email, password))
        conn.commit()
        logging.debug(f"Inserted user {email} into DB")
    except pg.DatabaseError as error:
        # Rollback the transaction in case of error
        conn.rollback()
        # Print the error message
        print(f"Error occurred during commit: {error}")
        passed = False
    return passed

def get_user_by_email(email):
    sql = f"SELECT * FROM {USERS_TABLE} WHERE email = %s"
    cur.execute(sql, (email,))
    user = cur.fetchone()  # Retrieves the first row from the result set
    logging.debug(f"Selected user {email} from DB")
    return user

