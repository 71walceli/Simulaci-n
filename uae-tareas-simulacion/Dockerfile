FROM node:18

WORKDIR /App

COPY ./package.json .
COPY ./yarn.lock .

# If you are building your code for production
# RUN npm ci --only=production
RUN yarn install --production

# Bundle app source
COPY ./ ./

RUN yarn build

#EXPOSE 8080
ENTRYPOINT [ "yarn", "run", "start" ]

