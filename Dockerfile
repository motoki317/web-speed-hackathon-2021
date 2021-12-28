FROM node:16.13.1

WORKDIR /srv

COPY ./package.json ./yarn.lock ./
COPY ./client/package.json ./client/
COPY ./server/package.json ./server/
RUN NODE_ENV=development yarn

COPY . .
RUN yarn build

ENTRYPOINT ["yarn", "start"]
