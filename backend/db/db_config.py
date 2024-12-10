import psycopg2 as pg
import os
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST") 
DB_NAME = os.getenv("DB_NAME") 
DB_USERNAME = os.getenv("DB_USERNAME") 
DB_PASSWORD = os.getenv("DB_PASSWORD") 
DB_PORT = os.getenv("DB_PORT") 

# DB_HOST =  "host.docker.internal"
# DB_NAME = "postgres"
# DB_USERNAME =  "postgres"
# DB_PASSWORD =  "lillu178!"
# DB_PORT =  "5432"

# Connect to the database
def connect():
    print("Connecting to DB")
    conn = pg.connect(host=DB_HOST,dbname=DB_NAME,user=DB_USERNAME,password=DB_PASSWORD,port=DB_PORT)
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