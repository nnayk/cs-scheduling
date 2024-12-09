import logging
import db.db_config as db_config

QUESTIONS_TABLE = "written_questions"

# Data
QUESTIONS = [
    "Are there constraints you have that don't fit this format?",
    "For each of the courses you are teaching in the specified quarter, do you have a room requirement? I.e. the course must be taught in the room due to equipment concerns? (Note that we do not have much control over lecture rooms and scheduling lectures in lab rooms for CSSE from 8am to 3pm is very difficult due to space constraints).",
    "For the courses you are teaching in the specified quarter, do you have a room preference? (Note that we do not have much control over lecture rooms and scheduling lectures in lab rooms from 8am to 3pm is very difficult due to space constraints). You can include whiteboard vs blackboard preference here, the university registrar tries to respect those requests.",
    "Any other thoughts/questions/comments/concerns?",
]

def createWrittenQuestionsTable():
    conn, cur = db_config.connect()
    try:
        # Create the questions table if it doesn't exist
        sql_create = f"""CREATE TABLE IF NOT EXISTS {QUESTIONS_TABLE} (
            id SERIAL PRIMARY KEY,
            question VARCHAR(400) NOT NULL UNIQUE
        );
        """
        cur.execute(sql_create)

        # Insert questions into the table
        for question in QUESTIONS:
            sql_insert = f"INSERT INTO {QUESTIONS_TABLE} (question) VALUES (%s) ON CONFLICT (question) DO NOTHING;"
            cur.execute(sql_insert, (question,))

        conn.commit()
        logging.debug("Created questions table and inserted questions")
    except Exception as e:
        # Rollback in case of an error
        conn.rollback()
        logging.error(f"Error occurred while creating the questions table: {e}")
    finally:
        db_config.close_connection(conn, cur)
