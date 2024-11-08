from db import db_config
import logging

AGREEMENT_TABLE="AGREEMENT_LEVELS"

AGREEMENTS = [
        "disagree",
        "neutral",
        "agree"
        ]

conn,cur = db_config.connect()

def createAgreementLevelsTable():
    print("Creating agreement levels table")
    sql = f"""
    CREATE TABLE IF NOT EXISTS {AGREEMENT_TABLE} (
    category VARCHAR(20) PRIMARY KEY
    );
    """
    cur.execute(sql)
    logging.debug("Created agreement table")
    for agreement in AGREEMENTS:
        sql_insert = f"INSERT INTO {AGREEMENT_TABLE} (category) VALUES (%s)"
        cur.execute(sql_insert,(agreement,))
    conn.commit()
