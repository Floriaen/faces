FROM node as build-stage
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package*.json ./
RUN npm install cross-env
COPY . .
RUN npm run build

FROM nginx
COPY --from=build-stage /app/build/. ./usr/share/nginx/html/.