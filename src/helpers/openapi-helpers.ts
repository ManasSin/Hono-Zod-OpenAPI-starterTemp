import { z } from "zod";

import type { ZodSchema } from "../types/index.ts";

export function jsonContent<
  T extends ZodSchema,
>(schema: T, description: string) {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
  };
}

export function createMessageObjectSchema(
  exampleMessage: string = "",
) {
  return z.object({
    message: z.string(),
  }).openapi({
    example: {
      message: exampleMessage,
    },
  })
  ;
}
