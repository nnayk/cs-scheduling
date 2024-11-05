import logging

USERS_TABLE = "users"

def createUsersTable(cur,conn):
    sql = f"""CREATE TABLE IF NOT EXISTS {USERS_TABLE} (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL);"""
    cur.execute(sql)
    conn.commit()
    logging.debug(f"Created users table")

if __name__ == "__main__":
    import db
    conn, cur = db.connect()
    createUsersTable(cur,conn)
    db.close(conn,cur)