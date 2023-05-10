#!/bin/bash -e

# Build the backend image
cd backend/
docker image build -f Dockerfile -t backend-image .

# Run the backend container
docker container run -p 8080:8080 --detach --name backend-container backend-image

# Build the frontend image
cd ../frontend/
docker image build -f Dockerfile -t frontend-image .

# Run the frontend container
docker container run -p 80:80 --detach --name frontend-container frontend-image
