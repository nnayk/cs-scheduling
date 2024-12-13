# Set base image (host OS)
FROM python:3.11-alpine

# By default, listen on port 5000
EXPOSE 5000/tcp

# Set the working directory in the container
WORKDIR /app

# Copy the dependencies file to the working directory
COPY requirements.txt .
COPY db ./db
COPY *.py .

# Install any dependencies
RUN pip install -r requirements.txt
RUN python -m venv venv
RUN source venv/bin/activate
# RUN echo "../../../../../backend/db/tables " > venv/lib/python3.11/site-packages/extra-paths.pth
# RUN echo "../../../../../backend/db/tables " > venv/lib/python3.12/site-packages/extra-paths.pth

# Copy the content of the local src directory to the working directory
#COPY app.py .



# Specify the command to run on container start
CMD [ "python", "-m", "flask", "run", "--host=0.0.0.0" ]
