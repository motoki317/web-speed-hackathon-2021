FROM node:16.13.1

WORKDIR /srv

COPY ./package.json ./package-lock.json ./
COPY ./client/package.json ./client/
COPY ./server/package.json ./server/
RUN NODE_ENV=development npm ci

COPY . .
RUN npm run build

ENTRYPOINT ["npm", "run", "start"]
