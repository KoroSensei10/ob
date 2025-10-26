## BUILD Layer
FROM node:24 AS build

WORKDIR /app

COPY . .

ENV CI=true

# Build args for better-auth
ARG BETTER_AUTH_URL
ARG BETTER_AUTH_SECRET
ARG NOTE_DIR
ARG DB_PATH
ENV BETTER_AUTH_URL=$BETTER_AUTH_URL
ENV BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
ENV NOTE_DIR=$NOTE_DIR
ENV DB_PATH=$DB_PATH

RUN npm install -g pnpm
RUN pnpm i

# Handle BETTER_AUTH_SECRET generation / retrieval
RUN pnpm build

# Create admin user if not exists
RUN node scripts/setup-db.ts


### RUN LAYER
FROM node:24-alpine AS run

WORKDIR /app

COPY --from=build /app/build /app/build
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/*.lock /app/

RUN npm install -g pnpm
RUN pnpm install --production

# Crate data folders
# Run migrations

EXPOSE 3000

CMD ["node", "build/index.js"]