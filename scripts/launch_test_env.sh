#!/bin/sh

if [ "$1" = "--build" ]; then
    docker compose --env-file .test.env -f docker-compose.test.yml up -d --build
else
    docker compose --env-file .test.env -f docker-compose.test.yml up -d  
fi
