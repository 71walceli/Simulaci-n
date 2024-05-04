FROM node:18

WORKDIR /App

COPY ./package.json .
COPY ./yarn.lock .

RUN yarn install --production
RUN yes | npx browserslist@latest --update-db

# Bundle app source
COPY ./ ./

RUN sed -i 's/forceSwcTransforms: true,//g' next.config.js
RUN sed -i 's/swcMinify: true/swcMinify: false/g' next.config.js
RUN yarn build

#EXPOSE 8080
ENTRYPOINT [ "yarn", "run", "start" ]

