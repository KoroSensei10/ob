## BUILD Layer
FROM node:24 AS build

WORKDIR /app

COPY . .

ENV CI=true

RUN npm install -g bun
RUN bun i
RUN bun run build


### RUN LAYER
FROM node:24-alpine AS run

WORKDIR /app

COPY --from=build /app/build /app/build
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/*.lock /app/

RUN npm install -g bun
RUN bun install --production

# Crate data folders
# Run migrations

EXPOSE 3000

CMD ["node", "build/index.js"]