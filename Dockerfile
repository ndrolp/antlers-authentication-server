FROM node:22.5.1-alpine3.19 as development

WORKDIR /usr/src/app

COPY package.json* .

RUN npm install

COPY . .

EXPOSE 5000

RUN npm run build


FROM node:22.5.1-alpine3.19 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV ANTLERS_SERVER_PORT=${ANTLERS_SERVER_PORT}

WORKDIR /usr/src/app

COPY package.json* .

RUN npm install --only=production

EXPOSE 5000

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main.js"]
