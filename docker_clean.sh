#!/bin/bash -e

# Stop and remove all frontend containers
cd frontend/
docker stop frontend-container
docker system prune -f --volumes

# Stop and remove all backend containers
cd ../backend/
docker stop backend-container
docker system prune -f --volumes
