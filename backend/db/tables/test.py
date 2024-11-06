import db.db_config as conf
import written_answers as wa

conn,cur=conf.connect()

test_user = 30
test_quarter = "spring 2025"
test_question = "If teaching lecture only classes (4 lecture units, e.g. 248/445/grad courses), I prefer"
test_response="Hello this is a pure test response!!!"
wa.save_written_answer(test_user,test_quarter,test_question,test_response)
answer = wa.get_written_answer(test_user,test_quarter,test_question)
print(f'answer = {answer}\n')
