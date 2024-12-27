import { defineConfig } from "drizzle-kit";

import env from "./src/env.ts";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: env.DATABASE_URL,
    // @ts-expect-error : https://github.com/drizzle-team/drizzle-orm/issues/179
    authToken: env.DATABASE_AUTH_TOKEN,
  },
});
