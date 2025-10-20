import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { admin } from "better-auth/plugins"

export const auth = betterAuth({
    database: new Database("./db/main.db"),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        admin()
    ]
})