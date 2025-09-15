## BUILD Layer
FROM node:24

WORKDIR /app

COPY . .

RUN yarn
RUN yarn build


### RUN LAYER
FROM node:24-alpine

WORKDIR /app

COPY --from=0 /app/build /app/build

EXPOSE 3000

CMD ["node", "build/index.js"]