import logging
import db.db_config as db_config

QUARTERS_TABLE = "quarters"

conn,cur = db_config.connect()

def createQuartersTable():
    sql = f"""CREATE TABLE IF NOT EXISTS {QUARTERS_TABLE} (
        quarter VARCHAR(15) PRIMARY KEY
        );
        """
    cur.execute(sql)
    conn.commit()
    logging.debug(f"Created questions table")

def insertQuarters(quarters):
    for quarter in quarters:
        sql = f"INSERT INTO {QUARTERS_TABLE} (quarter) VALUES (%s)"
        cur.execute(sql, (quarter,))
    conn.commit()
    logging.debug(f"Inserted quarters")

def deleteQuarters(quarters):
    if quarters:
        sql = f"DELETE FROM {QUARTERS_TABLE} WHERE quarter = ANY(%s)"
        cur.execute(sql, (quarters,))
        conn.commit()
    else:
        cur.execute(f"DELETE FROM {QUARTERS_TABLE}")
        conn.commit()
        logging.debug(f"Deleted quarters")
