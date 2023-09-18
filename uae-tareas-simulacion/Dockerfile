FROM node:18

WORKDIR /App

COPY ./package.json .
COPY ./yarn.lock .

RUN yarn install --production
RUN yes | npx browserslist@latest --update-db

# Bundle app source
COPY ./ ./

RUN yarn build

#EXPOSE 8080
ENTRYPOINT [ "yarn", "run", "start" ]

