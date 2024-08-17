#!/bin/sh

if [ "$1" = "--build" ]; then
    docker compose --env-file .env.test -f docker-compose.test.yml up -d --build
else
    docker compose --env-file .env.test -f docker-compose.test.yml up -d  
fi
