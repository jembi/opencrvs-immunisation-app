FROM node:boron

ADD package.json /src/frontend/
WORKDIR /src/frontend/
RUN npm install

ADD . /src/frontend/

CMD npm start