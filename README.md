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

Make sure you have [Python](https://www.python.org/downloads/) and [Node](https://nodejs.org/en/download) environments set up (this includes npm and pip3). The latest stable releases should be fine as of December 2024, but this project uses Node v20 and Python 3.10.

### Installing the frontend packages

From root:

- `cd Frontend`
- `npm install`

### Installing the backend packages

I recommend creating a virtual environment to limit the installation scope of the Python packages required for this project:

`python -m venv .venv`

From root:

- `cd Backend`
- `pip3 install -r requirements.txt`

### Running the app locally

Backend:
From root:

- `cd Backend`
- `python -m flask run`

Frontend:
From root:

- `cd Frontend`
- Create a file `.env.local` and add the following env vars:
- `npm run dev`
