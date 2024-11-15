from db import db_config
import logging

AGREEMENT_TABLE = "AGREEMENT_LEVELS"
AGREEMENTS = ["disagree", "neutral", "agree"]

def createAgreementLevelsTable():
    conn, cur = db_config.connect()
    try:
        print("Creating agreement levels table")
        sql = f"""
        CREATE TABLE IF NOT EXISTS {AGREEMENT_TABLE} (
            category VARCHAR(20) PRIMARY KEY
        );
        """
        cur.execute(sql)
        logging.debug("Created agreement table")

        for agreement in AGREEMENTS:
            sql_insert = f"INSERT INTO {AGREEMENT_TABLE} (category) VALUES (%s) ON CONFLICT DO NOTHING"
            cur.execute(sql_insert, (agreement,))

        conn.commit()
    finally:
        db_config.close_connection(conn, cur)
