# The tape project

Open source software made with open source tools.

> :warning: **This project is still in early development.**

## Self-hosted, privacy-focused, markdown note-taking web application

- [Features](#features)
- [Roadmap](#roadmap)
- [Get started](#get-started)
- [The stack](#the-stack)

## Features

- Markdown note-taking with live preview
- Multiple notebooks support
- User authentication and management via [Better Auth](https://better-auth.com)
- Responsive design for every usage (mobile, tablet, desktop)
- Plugin extensibility

## Roadmap

See [TODO.md](TODO.md) for a list of planned features and improvements (not always up to date).

## Get started

### Prerequisites

The simplest way to get started is to use Docker (compose) to *build* and run the application.

### Setup steps

### :warning: Limitations

> Due to Better Auth requiring certain environment variables to be set at *build time*, you need to build the Docker image yourself using Docker Compose.
> This also applies to setting up the database, notes directory and the initial admin user.
> Hopefully in the future, this limitation will be removed by setting everything at run time only, including the secret of the app, the notes directory, the database path and the admin user.
> Thanks to that I will be able to provide pre-built Docker images and, you'll just have to setup environment variables for everything to work smoothly the first time.

Other than that, the steps below will guide you through the setup process.

#### Clone the repository

First, clone the repository:

```bash
git clone https://github.com/KoroSensei10/ob.git
cd ob-svelte
```

#### Docker Compose setup

Then, modify the `docker-compose.yml` file to set the required args and environment variables:

> As said above, at the time of writing, Better Auth requires certain environment variables to be set at *build time*. Therefore, we need to set some variables in the `build.args` section and some in the `environment` section.
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

The first time you run the application, you'll be prompted to create an admin user in the `/welcome` page.
You won't be able to access the `/welcome` page anymore after creating the admin user.

## The stack

- [Svelte & SvelteKit](https://svelte.dev)
- [Vite](https://vitejs.dev)
- [TailwindCSS](https://tailwindcss.com)
- [Shadcn Svelte](https://www.shadcn-svelte.com/)
- [Better Auth](https://better-auth.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [SQLite](https://www.sqlite.org)
- [Playwright](https://playwright.dev)
- [Vitest](https://vitest.dev)

## License

MIT
