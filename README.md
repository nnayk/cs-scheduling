# Poly Prefs

### Description

Poly Prefs is a full stack web application to allow professors at Cal Poly to easily specify and modify their teaching preferences. These include times they're free to teach as well as other specific preferences (ex. classroom preferences).

### Tech Stack

### Backend

- ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
- ![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
- ![PostgreSQL](https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)

### Frontend

- ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
- ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
- ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

## Installation and Setup

Make sure you have [Python](https://www.python.org/downloads/), [PostgreSql](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads), and [Node](https://nodejs.org/en/download) environments set up (this includes pip and npm). The latest stable releases should be fine as of December 2024, but this project uses Python 3.11, PostgreSql 14.13, and Node v20.

To setup Postgres I used the Edb installer (hyperlinked above). I used all the defaults except avoided installing `Stack Builder` (just unchecked this option). Since I was on a Mac I just ran `brew install postgresql` for the sys headers + postgres CLI tools.

Verify that the installations succeded with the following CLI commands:

1. `python3 --version`
2. `npm --version`
3. `postgres --version`

## Frontend setup

### Installing the frontend packages

From root:

- `cd Frontend`
- `npm install`

### Other setup configurations

1. The frontend needs to know what quarters it should collect data for. Currently I harcode the quarters in `frontend/constants/consts.js`. Simply modify the `QUARTERS` array as needed.
   * In theory the frontend could just fetch the list of quarters in the `quarters` table but I thought this might get messy if there are a bunch of older quarters still present in the `quarters` table.
2. The frontend also needs to know the backend url to invoke. To do this:
   1. In `frontend` directory, create a file `.env.local ` and add the following env vars:- NEXT_PUBLIC_BACKEND_URL= ``<backend url endpoint>`` (ex. locally Flask uses http://127.0.0.1:5000 by default)

## Backend setup

### Installing the backend packages

I recommend creating a virtual environment to limit the installation scope of the Python packages required for this project:

`python -m venv venv`

Activate the virtual environment (ex. `source ./venv/bin/activate` on *Nix machines)

From root:

- `cd Backend`
- `pip3 install -r requirements.txt`

### DB Setup

I used pgAdmin, an open source Postgres administration desktop app. You can download it here: https://www.pgadmin.org/

Once you have followed the PgAdmin setup instructions you should have a master password (which you should've set) as well as a username ("postgres" by default). There should also be a default "postgres" database that was created but you can also create a different database if you want.

1. **Connect to the DB**
   In order to connect to the DB programatically create a file called `.env` and add it to `backend/db`. Populate this file with the following vars:

   1. `DB_HOST`
   2. `DB_NAME` - name of the DB
   3. `DB_USERNAME` - name of user who owns the DB
   4. `DB_PASSWORD` - master password for user who owns the DB
   5. `DB_PORT`

   You can find the env. vars #1 and #5 by right clicking the Postgres icon (under servers tab) in PgAdmin and then right clicking `Properties`. Navigate to the `Connection` tab and you should see `Port` and `Host name` values. Though I'm pretty sure they will just be `5432` and `localhost` by default.

   At this point you should be able to programatically connect to the DB. Verify this with the following steps:

   1. From /backend/db, start an interactive python shell
   2. `import db_config`
   3. `db_config.connect()`
   4. At this point verify you see the output `Connected to DB`

   ex.

   > import db_config
   > db_config.connect()
   > Connecting to DB
   > Connected to DB
   > (<connection object at 0x10a1c34c0; dsn: 'user=postgres password=xxx dbname=poly_prefs host=localhost port=5432', closed: 0>, <cursor object at 0x10a2747c0; closed: 0>)
   >
2. **Creating the tables**
   Now it's time to create the tables within the DB. As of December 2024 there are 12 tables in total.

   1. From /backend dir, run `python -m db.scripts.create_all_tables`. Verify that this script creates 12 tables in the DB. You can do this in PgAdmin by right clicking `Schemas` and then right clicking `Tables`

   For now all tables are empty except the following, which have harcoded data that will probably rarely be modified:

   1. `agreement_questions`
   2. `written_questions`
   3. `agreement_levels`

   All the other tables will be populated by the web app itself and won't require any manual setup -- with one exception: the `quarters` table.
3. **Adding the quarters**

   Right now the `quarters` table will be empty. As its name suggests it contains all the quarters for which this web app will collect submissions for. In order to add quarters to the DB:

   1. In a python shell, use the script backend/db/tables/quarters.py to ADD NEW quarters or delete existing ones:
   2. Note: (Assuming cwd is backend):
      * `from db.tables.quarters import insertQuarters`
      * insertQuarters(`<python list of quarters as strings>`) (ex. insertQuarters(["fall 2023","winter 2024","spring 2024"])
      * Verify in Pgadmin that the quarters table contains rows for the new quarters
        NOTE: To delete quarters the process is similar except you would import and invoke deleteQuarters instead. This will delete all records in all tables for each quarter to be deleted.**

## Running the app locally

Backend:
From root:

- `cd Backend`
- `python -m flask run`

Frontend:
From root:

- `cd Frontend`
- `npm run dev`


## Deployment

In progress...
