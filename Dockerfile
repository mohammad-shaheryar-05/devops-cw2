FROM node:14-alpine

WORKDIR /app

RUN npm init -y
COPY package.json .
COPY server.js .

EXPOSE 8080

CMD ["node", "server.js"]
