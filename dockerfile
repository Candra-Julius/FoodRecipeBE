FROM node:16.19.0-alpine3.17

WORKDIR /app

COPY . /app/

EXPOSE 8000

CMD ["node", "index.js"]