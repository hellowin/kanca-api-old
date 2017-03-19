FROM node:6

MAINTAINER Andi N. Dirgantara <andi.nugroho@salestock.id>

# install host utilities
RUN apt-get update
RUN apt-get install ocaml libelf-dev -y

# install PM2 and update NPM
RUN npm install -g pm2

# create app directory
RUN mkdir -p /app
WORKDIR /app

# copy project and run installation
COPY . /app
RUN rm -rf /app/node_modules
RUN npm install
RUN npm run flow
RUN npm run test
RUN npm run build

# re-install in production mode
RUN rm -rf /app/node_modules
RUN npm install --production

CMD [ "pm2", "start", "--no-daemon", "index.js"]
EXPOSE 80
