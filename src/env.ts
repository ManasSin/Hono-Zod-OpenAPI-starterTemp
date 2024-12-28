import type { ZodError } from "zod";

import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "node:path";
import { z } from "zod";

expand(config({
  path: path.resolve(
    process.cwd(),
    // eslint-disable-next-line node/no-process-env
    process.env.NODE_ENV === "test" ? ".env.test" : ".env",
  ),
}));

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(8080),
  DATABASE_URL: z.string().url(),
  DATABASE_AUTH_TOKEN: z.string(),
  // JWT_SECRET: z.string(),
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal", "silent"]),
}).superRefine(
  (data, ctx) => {
    if (data.NODE_ENV === "production" && !data.DATABASE_AUTH_TOKEN) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_type,
        expected: "string",
        received: "undefined",
        message: "DATABASE_AUTH_TOKEN is required in production",
        path: ["DATABASE_AUTH_TOKEN"],
      });
    }
  },
);

export type Env = z.infer<typeof EnvSchema>;

// eslint-disable-next-line  import/no-mutable-exports
let env: Env;

try {
  // // eslint-disable-next-line node/no-process-env
  // const { data: error, data: env } = EnvSchema.safeParse(process.env);

  // eslint-disable-next-line node/no-process-env
  env = EnvSchema.parse(process.env);
}
catch (e) {
// if (error) {
  const error = e as ZodError;
  console.error("X invalid env");
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  // console.error(error.message);
  process.exit(1);
}

export default env;
