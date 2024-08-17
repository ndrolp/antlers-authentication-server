#!/bin/sh

if [ "$1" = "--build" ]; then
    docker compose --env-file .env.dev -f docker-compose.dev.yml up -d --build
else
    docker compose --env-file .env.dev -f docker-compose.dev.yml up -d  
fi
