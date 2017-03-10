# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:latest

# Create application directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install application dependencies
COPY package.json /usr/src/app
RUN npm install

# Bundle application files
COPY . /usr/src/app

# Run server
CMD ["npm", "run", "prod"]