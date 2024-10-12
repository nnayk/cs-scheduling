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
    return passed

def createUsersTable():
    cur.execute("""CREATE TABLE IF NOT EXISTS Users(
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    );
    """)
    conn.commit()

def createPreferencesTable():
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
    cur.execute(f"""
    CREATE TABLE IF NOT EXISTS preferences (
        user_id INT PRIMARY KEY,
        {times},
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)
    print("Preferences table created")
    conn.commit()
if __name__ == "__main__":
    print("calling function to create users table")
    createUsersTable()
    print("calling function to create preferences table")
    createPreferencesTable()
    cur.close()