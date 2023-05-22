#!/bin/bash -e

# Stop and remove all containers and images
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
docker rmi $(docker images -q)
docker system prune -f --volumes
