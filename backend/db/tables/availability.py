def createAvailabilityTables():
    print("Creating preferences table")
    times = ", ".join([
            '"9 AM" VARCHAR(255)',
            '"10 AM" VARCHAR(255)',
            '"11 AM" VARCHAR(255)',
            '"12 PM" VARCHAR(255)',
            '"1 PM" VARCHAR(255)',
            '"2 PM" VARCHAR(255)',
            '"3 PM" VARCHAR(255)',
            '"4 PM" VARCHAR(255)',
            '"5 PM" VARCHAR(255)',
            ]);
    sql_mwf = f"""
    CREATE TABLE IF NOT EXISTS {MWF_TABLE} (
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        quarter VARCHAR(15) REFERENCES quarters(quarter) ON DELETE CASCADE, 
        {times},
        PRIMARY KEY (user_id,quarter)
    );
    """
    cur.execute(sql_mwf)
    sql_tr = f"""
    CREATE TABLE IF NOT EXISTS {TR_TABLE} (
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        quarter VARCHAR(255),
        {times},
        PRIMARY KEY (user_id,quarter)
    );
    """
    cur.execute(sql_tr)
    logging.debug(f"Created availability tables")
    conn.commit()