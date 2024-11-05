import logging

QUESTIONS_TABLE = "questions"
QUESTIONS_OFFSET = 3 + 1 # 3 for the first 3 questions, 1 for Python's 0-based indexing

# Data
QUESTIONS = [
    "If teaching 1 class with a lab, I would prefer",
    "If teaching 2 classes with labs, I would prefer",
    "If teaching 3 classes with labs, I would prefer",
    "If teaching lecture only classes (4 lecture units, e.g. 248/445/grad courses), I prefer",
    "Given the choice, I would prefer",
    "Are there constraints you have that don't fit this format?",
    "For each of the courses you are teaching in the specified quarter, do you have a room requirement? I.e. the course must be taught in the room due to equipment concerns? (Note that we do not have much control over lecture rooms and scheduling lectures in lab rooms for CSSE from 8am to 3pm is very difficult due to space constraints).",
    "For the courses you are teaching in the specified quarter, do you have a room preference? (Note that we do not have much control over lecture rooms and scheduling lectures in lab rooms from 8am to 3pm is very difficult due to space constraints). You can include whiteboard vs blackboard preference here, the university registrar tries to respect those requests.",
    "Any other thoughts/questions/comments/concerns?",
    "This survey is"
]

def createQuestionsTable(cur,conn):
    sql_create = f"""CREATE TABLE IF NOT EXISTS {QUESTIONS_TABLE} (
        id SERIAL PRIMARY KEY,
        question VARCHAR(400) NOT NULL
        );
        ALTER SEQUENCE {QUESTIONS_TABLE}_id_seq RESTART WITH {QUESTIONS_OFFSET};
        """
    cur.execute(sql_create)
    for question in QUESTIONS:
        sql_insert = f"INSERT INTO {QUESTIONS_TABLE} (question) VALUES (%s)"
        cur.execute(sql_insert, (question,))
    conn.commit()
    logging.debug(f"Created questions table")