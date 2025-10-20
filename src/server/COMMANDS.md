# Commands for managing Drizzle ORM & Better-Auth

## Better auth

When anything related to the auth system change, use the following command to apply migrations:

```bash
npx @better-auth/cli@latest generate
```

This will create a new file at the root folder, just copy it to `src/server/schemas/`

## Drizzle ORM

When modifying any model or schema, or adding new tables, run the following command to generate the necessary migration files:

```bash
npx drizzle-kit generate
```

This command will create migration files in the `drizzle/` directory, which you can then apply to your database.

### Apply migrations

To apply the generated migrations to your database, use the following command:

```bash
npx drizzle-kit migrate
```
