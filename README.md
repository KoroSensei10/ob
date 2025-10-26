# The tape project

## Get started

### Prerequisites

The simplest way to get started is to use Docker (compose) to *build* and run the application.

### Setup steps

### /!\ Limitations

Due to Better Auth requiring certain environment variables to be set at *build time* as well as *run time*, you need to build the Docker image yourself using Docker Compose.
This also applies to setting up the database, notes directory and the initial admin user.

In the future, this limitation will be removed by setting everything at run time only, including the secret of the app, the notes directory, the database path and the admin user.
Thanks to that I will be able to provide pre-built Docker images and, you'll just have to setup environment variables for everything to work smoothly the first time.

Other than that, the steps below will guide you through the setup process.

#### Clone the repository

First, clone the repository:

```bash
git clone https://github.com/KoroSensei10/ob.git
cd ob-svelte
```

#### Docker Compose setup

Then, modify the `docker-compose.yml` file to set the required args and environment variables:

> ! Limitation: At the time of writing, Better Auth requires certain environment variables to be set at *build time* as well as *run time*. Therefore, we need to set some variables in the `build.args` section and some in the `environment` section.
> That's why there are two sections below and you need to *build* the Docker image yourself using Docker Compose.

##### Args (build time)

- `BETTER_AUTH_URL`: The URL where the Better Auth service will be accessible (e.g., `http://localhost:3000`).
- `BETTER_AUTH_SECRET`: A secure secret key for Better Auth (you can generate one using for example `openssl rand -hex 32`).
- `NOTE_DIR`: The directory where notes will be stored (e.g., `./data`).
  - This directory should be mounted as a volume in the Docker Compose file.
  - Ex for a "data" folder: `- ./data:/app/data`, or a "notes" folder: `- ./notes:/app/notes`.
- `DB_PATH`: The path to the SQLite database file (e.g., `file:./data/.data.db`).
  - Same as above, this path should be within the mounted volume.

##### Environment variables (run time)

- `ORIGIN`: The origin URL of your application (e.g., `https://your-domain.com`).
  - This must match the URL you use to access the app (with domain name for example).
- `BASE_URL`: The base URL of your application (e.g., `http://localhost:3000/`).
- `VITE_BETTER_AUTH_URL`: The URL for Better Auth to be used in the frontend (e.g., `http://localhost:3000`).

#### Build and run the application

Now, you can build and run the application using Docker Compose:

```bash
docker-compose up --build
```

### Access the application

Once the application is running, you can access it in your web browser at `http://localhost:3000` (or the domain you specified in the `ORIGIN` variable).

The first time you run the application, you have to connect using the admin user created with credentials specified in `scripts/adminUser.ts`.

## The stack

- SvelteKit
- Vite
- TailwindCSS
- Better Auth
- Drizzle ORM
- SQLite
