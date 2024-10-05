import sys
print(sys.executable)

import psycopg2 as pg

conn = pg.connect(host="localhost",dbname="postgres",user="postgres",password="lillu178!",port=5432)
cur = conn.cursor()

def addUser(email,password):
    passed = True
    try:
        # Example INSERT operation
        cur.execute("INSERT INTO users (email, password) VALUES (%s, %s)", (email, password))
        
        # Attempt to commit the transaction
        conn.commit()
        
        # If the commit is successful, you can print a confirmation
        print("Transaction committed successfully.")
    except pg.DatabaseError as error:
        # Rollback the transaction in case of error
        conn.rollback()
        
        # Print the error message
        print(f"Error occurred during commit: {error}")
        passed = False

    finally:
        # Close the cursor and connection
        cur.close()
        conn.close()
        return passed


if __name__ == "__main__":
    cur.execute("""CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    );
    """)
    conn.commit()
    cur.close()