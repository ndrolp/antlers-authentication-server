FROM node:alpine3.20 as development

WORKDIR /usr/src/app

COPY package.json* .

RUN npm install

COPY . .

RUN npm run build


FROM node:alpine3.20 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV ANTLERS_SERVER_PORT=${ANTLERS_SERVER_PORT}

WORKDIR /usr/src/app

COPY package.json* .

RUN npm ci --only=production

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main.js"]
