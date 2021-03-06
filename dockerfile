FROM node:16.14-alpine3.14
RUN npm install -g nodemon
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
EXPOSE 8080
CMD ["npm","run","dev"]