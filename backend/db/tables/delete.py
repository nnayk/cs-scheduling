from db import db_config

conn,cur=db_config.connect()

while 1:
    table = input("Exact table name to delete: ")
    cur.execute(f"DROP TABLE {table}")
    conn.commit()
