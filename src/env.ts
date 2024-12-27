import type { ZodError } from "zod-validation-error";

import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

expand(config());

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(8080),
  // DATABASE_URL: z.string().url(),
  // JWT_SECRET: z.string(),
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal"]),
});

export type Env = z.infer<typeof EnvSchema>;

// eslint-disable-next-line  import/no-mutable-exports
let env: Env;

try {
  // eslint-disable-next-line node/no-process-env
  env = EnvSchema.parse(process.env);
} catch (e) {
  const error = e as ZodError;
  console.error("X invalid env");
  console.error(error.flatten());
  process.exit(1);
}

export default env;
