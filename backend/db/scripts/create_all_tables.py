import logging
import psycopg2 as pg
from db.tables.users import createUsersTable
from db.tables.quarters import createQuartersTable
from db.tables.agreement_questions import createAgreementQuestionsTable
from db.tables.agreement_levels import createAgreementLevelsTable
from db.tables.written_questions import createWrittenQuestionsTable
from db.tables.agreement_answers import createAgreementAnswersTable
from db.tables.written_answers import createWrittenAnswersTable
from db.tables.availability import createAvailabilityTable
from db.tables.profiles import createProfilesTable
from db.tables.profile_availability import createProfileAvailabilityTable
from db.tables.profile_written_answers import createProfileWrittenAnswersTable
from db.tables.profile_agreement_answers import createProfileAgreementAnswersTable

def create_all():
    '''
    Creates all tables in the proper dependency order
    '''
    # users
    createUsersTable()
    # quarters
    createQuartersTable()
    # agreement_questions
    createAgreementQuestionsTable()
    # agreement_levels
    createAgreementLevelsTable()
    # written_questions
    createWrittenQuestionsTable()
    # agreement_answers
    createAgreementAnswersTable()
    # written_answers
    createWrittenAnswersTable()
    # availability
    createAvailabilityTable()
    # profiles
    createProfilesTable()
    # profile_availability
    createProfileAvailabilityTable()
    # profile_written_answers
    createProfileWrittenAnswersTable()
    # profile_agreement_answers
    createProfileAgreementAnswersTable()

if __name__=="__main__":
    create_all()
