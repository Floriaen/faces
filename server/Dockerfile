FROM node:12-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN apk add --no-cache \
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "node", "app.js" ]