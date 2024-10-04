import psycopg2 as pg

conn = pg.connect(host="localhost",dbname="postgres",user="postgres",password="lillu178!",port=5432)
cur = conn.cursor()

def addUser(email,password):
    cur.execute("INSERT INTO users(email,password) VALUES (%s,%s)",(email,password))
    conn.commit()

if __name__ == "__main__":
    cur.execute("""CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    );
    """)
    conn.commit()
    cur.close()