import logging
import db.db_config as db_config

QUARTERS_TABLE = "quarters"

def createQuartersTable():
    conn, cur = db_config.connect()
    try:
        sql = f"""CREATE TABLE IF NOT EXISTS {QUARTERS_TABLE} (
            quarter VARCHAR(15) PRIMARY KEY
        );
        """
        cur.execute(sql)
        conn.commit()
        logging.debug("Created quarters table")
    finally:
        db_config.close_connection(conn, cur)

def insertQuarters(quarters):
    conn, cur = db_config.connect()
    try:
        for quarter in quarters:
            sql = f"INSERT INTO {QUARTERS_TABLE} (quarter) VALUES (%s)"
            cur.execute(sql, (quarter,))
        conn.commit()
        logging.debug("Inserted quarters")
    finally:
        db_config.close_connection(conn, cur)

def deleteQuarters(quarters):
    conn, cur = db_config.connect()
    try:
        if quarters:
            sql = f"DELETE FROM {QUARTERS_TABLE} WHERE quarter = ANY(%s)"
            cur.execute(sql, (quarters,))
        else:
            cur.execute(f"DELETE FROM {QUARTERS_TABLE}")
        conn.commit()
        logging.debug("Deleted quarters")
    finally:
        db_config.close_connection(conn, cur)
