#!/bin/bash

# Script to set up Docker Compose and run Jest tests

# Stop and remove any running containers
docker compose --env-file .env.test -f docker-compose.test.yml down

# Build and start the containers in the background
docker compose --env-file .env.test -f docker-compose.test.yml up -d --build

# Wait for the database to be ready
check_mongo() {
  while ! nc -z "localhost" 27017; do
    echo "Waiting for MongoDB to initialize..."
    sleep 1
  done
  echo "MongoDB is ready."
}

# Call the function to check MongoDB status
check_mongo

docker compose --env-file .env.test -f docker-compose.test.yml run --rm api sh -c "npm run test"

# Stop and remove the containers
docker compose --env-file .env.test -f docker-compose.test.yml down
