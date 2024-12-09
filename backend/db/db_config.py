import psycopg2 as pg

# Connect to the database
def connect():
    print("Connecting to DB")
    conn = pg.connect(host="localhost",dbname="postgres",user="postgres",password="lillu178!",port=5432)
    cur = conn.cursor() 
    print("Connected to DB")
    return conn, cur

def clear_table(table):
    conn,cur = connect()
    print(f'Clearing table {table}')
    cur.execute(f"DELETE FROM {table}")
    conn.commit()
    print(f"Cleared table {table}")
    
def delete_table(table):
    conn,cur = connect()
    print(f'Deleting table {table}')
    cur.execute(f"DROP TABLE {table}")
    conn.commit()
    print(f"Deleted table {table}")

def close_connection(conn,cur):
    print("Closing connection to DB")
    cur.close()
    conn.close()
    print("Closed connection to DB")