# Antlers Authentication Service

This project originated from the question of how microservices handle
authentication and authorization. The idea is to create a Docker image,
developed with TypeScript, that can be reused with other microservices and is
technology-agnostic.

# Start development

To start development you can create a 'enviromment' file like follows

```
ANTLERS_SERVER_PORT=3000
MONGO_URL=mongodb
MONGO_PORT=27017
MONGO_USERNAME=admin
MONGO_PASSWORD=admin
MONGO_DATABASE=antlersauth
```

Then you can start the containers with

```bash
docker compose --env-file <env-file> -f docker-compose.dev.yml up -d
```

# Build the image

To build the production ready image you can run

```bash
docker build -t antlers-authentication .
```
